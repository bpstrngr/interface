 import stream from "stream";
 import {EventEmitter} from "events";

 // smuggled from: https://github.com/npm/node-tar/blob/main/lib/read-entry.js

 const maxMetaEntrySize = 1024 * 1024

 const gzipHeader = Buffer.from([0x1f, 0x8b])
 const STATE = Symbol('state')
 const WRITEENTRY = Symbol('writeEntry')
 const READENTRY = Symbol('readEntry')
 const NEXTENTRY = Symbol('nextEntry')
 const PROCESSENTRY = Symbol('processEntry')
 const EX = Symbol('extendedHeader')
 const GEX = Symbol('globalExtendedHeader')
 const META = Symbol('meta')
 const EMITMETA = Symbol('emitMeta')
 const BUFFER = Symbol('buffer')
 const QUEUE = Symbol('queue')
 const ENDED = Symbol('ended')
 const EMITTEDEND = Symbol('emittedEnd')
 const EMIT = Symbol('emit')
 const UNZIP = Symbol('unzip')
 const CONSUMECHUNK = Symbol('consumeChunk')
 const CONSUMECHUNKSUB = Symbol('consumeChunkSub')
 const CONSUMEBODY = Symbol('consumeBody')
 const CONSUMEMETA = Symbol('consumeMeta')
 const CONSUMEHEADER = Symbol('consumeHeader')
 const CONSUMING = Symbol('consuming')
 const BUFFERCONCAT = Symbol('bufferConcat')
 const MAYBEEND = Symbol('maybeEnd')
 const WRITING = Symbol('writing')
 const ABORTED = Symbol('aborted')
 const DONE = Symbol('onDone')
 const SAW_VALID_ENTRY = Symbol('sawValidEntry')
 const SAW_NULL_BLOCK = Symbol('sawNullBlock')
 const SAW_EOF = Symbol('sawEOF')

 const types = new Map(Object.entries(
 {0:'File'
 // same as File
 ,'':'OldFile',1:'Link',2:'SymbolicLink'
 // Devices and FIFOs aren't fully supported
 // they are parsed, but skipped when unpacking
 ,3:'CharacterDevice',4:'BlockDevice',5:'Directory',6:'FIFO'
 // same as File
 ,7:'ContiguousFile'
 // pax headers
 ,g:'GlobalExtendedHeader',x:'ExtendedHeader'
 // vendor-specific stuff
 // skip
 ,A:'SolarisACL'
 // like 5, but with data, which should be skipped
 ,D:'GNUDumpDir'
 // metadata only, skip
 ,I:'Inode'
 // data = link path of next file
 ,K:'NextFileHasLongLinkpath'
 // data = path of next file
 ,L:'NextFileHasLongPath'
 // skip
 ,M:'ContinuationFile'
 // like L
 ,N:'OldGnuLongPath'
 // skip
 ,S:'SparseFile'
 // skip
 ,V:'TapeVolumeHeader'
 // like x
 ,X:'OldExtendedHeader'
 }));

 const SLURP = Symbol('slurp')
 const TYPE = Symbol('type')
 const EOF = Symbol('EOF')
 const MAYBE_EMIT_END = Symbol('maybeEmitEnd')
 const EMITTED_END = Symbol('emittedEnd')
 const EMITTING_END = Symbol('emittingEnd')
 const EMITTED_ERROR = Symbol('emittedError')
 const CLOSED = Symbol('closed')
 const READ = Symbol('read')
 const FLUSH = Symbol('flush')
 const FLUSHCHUNK = Symbol('flushChunk')
 const ENCODING = Symbol('encoding')
 const DECODER = Symbol('decoder')
 const FLOWING = Symbol('flowing')
 const PAUSED = Symbol('paused')
 const RESUME = Symbol('resume')
 const BUFFERLENGTH = Symbol('bufferLength')
 const BUFFERPUSH = Symbol('bufferPush')
 const BUFFERSHIFT = Symbol('bufferShift')
 const OBJECTMODE = Symbol('objectMode')
 const DESTROYED = Symbol('destroyed')
 const EMITDATA = Symbol('emitData')
 const EMITEND = Symbol('emitEnd')
 const EMITEND2 = Symbol('emitEnd2')
 const ASYNC = Symbol('async')
 const defer = fn => Promise.resolve().then(fn)

 // TODO remove when Node v8 support drops
 const doIter = global._MP_NO_ITERATOR_SYMBOLS_  !== '1'
 const ASYNCITERATOR = doIter && Symbol.asyncIterator||Symbol('asyncIterator not implemented')
 const ITERATOR = doIter && Symbol.iterator||Symbol('iterator not implemented')

 // events that mean 'the stream is over'
 // these are treated specially, and re-emitted
 // if they are listened for after emitting.
 const isEndish = ev => ev === 'end' ||ev === 'finish' ||ev === 'prefinish'
 const isArrayBuffer = b => b instanceof ArrayBuffer ||typeof b === 'object' &&b.constructor &&b.constructor.name === 'ArrayBuffer' &&b.byteLength >= 0
 const isArrayBufferView = b => !Buffer.isBuffer(b) && ArrayBuffer.isView(b)

 class Pipe
{constructor (src, dest, opts)
{Object.assign(this,{src,dest,opts,ondrain:()=>src[RESUME]()})
 dest.on('drain', this.ondrain);
}
 unpipe(){this.dest.removeListener('drain', this.ondrain);}
 // istanbul ignore next - only here for the prototype
 proxyErrors(){}
 end(){this.unpipe();if(this.opts.end)this.dest.end();}
}

 class PipeProxyErrors extends Pipe
{constructor(src, dest, opts)
{super(src, dest, opts)
 this.proxyErrors = er => dest.emit('error', er)
 src.on('error', this.proxyErrors)
}
 unpipe()
{this.src.removeListener('error', this.proxyErrors)
 super.unpipe()
}
}

 class Entry extends stream
{constructor(header,ex,gex)
{super()
 this[FLOWING] = false
 // whether we're explicitly paused
 this[PAUSED] = false
 this.pipes = []
 this.buffer = []
 this[OBJECTMODE] = false
 if(this[OBJECTMODE])
 this[ENCODING] = null
 else
 this[ENCODING] = null
 if(this[ENCODING] === 'buffer')
 this[ENCODING] = null
 this[ASYNC] = false
 this[DECODER] = this[ENCODING] ? new SD(this[ENCODING]) : null
 this[EOF] = false
 this[EMITTED_END] = false
 this[EMITTING_END] = false
 this[CLOSED] = false
 this[EMITTED_ERROR] = null
 this.writable = true
 this.readable = true
 this[BUFFERLENGTH] = 0
 this[DESTROYED] = false
 // read entries always start life paused.  this is to avoid the
 // situation where Minipass's auto-ending empty streams results
 // in an entry ending before we're ready for it.
 this.pause()
 this.extended = ex
 this.globalExtended = gex
 this.header = header
 this.startBlockSize = 512 * Math.ceil(header.size / 512)
 this.blockRemain = this.startBlockSize
 this.remain = header.size
 this.type = header.type
 this.meta = false
 this.ignore = false
 if(['NextFileHasLongLinkpath','NextFileHasLongPath','OldGnuLongPath','GlobalExtendedHeader','ExtendedHeader','OldExtendedHeader'].includes(this.type))
 this.meta = true;
 else if(!['File','OldFile','Link','SymbolicLink','CharacterDevice','BlockDevice','Directory','FIFO','ContiguousFile','GNUDumpDir'].includes(this.type))
 // NOTE: gnutar and bsdtar treat unrecognized types as 'File'
 // it may be worth doing the same, but with a warning.
 this.ignore = true
 this.path = header.path
 this.mode = header.mode
 if (this.mode)
 this.mode = this.mode & 0o7777
 this.uid = header.uid
 this.gid = header.gid
 this.uname = header.uname
 this.gname = header.gname
 this.size = header.size
 this.mtime = header.mtime
 this.atime = header.atime
 this.ctime = header.ctime
 this.linkpath = header.linkpath
 this.uname = header.uname
 this.gname = header.gname
 if(ex)slurp.call(this,ex)
 if(gex)slurp.call(this,gex, true)
}

 write(data, encoding, cb)
{const writeLen = data.length
 if (writeLen > this.blockRemain)
 throw new Error('writing more to entry than is appropriate')
 const r = this.remain
 const br = this.blockRemain
 this.remain = Math.max(0, r - writeLen)
 this.blockRemain = Math.max(0, br - writeLen)
 if (this.ignore)
 return true
 let chunk=r >= writeLen?data:data.slice(0, r);
 if (this[EOF])
 throw new Error('write after end')
 if (this[DESTROYED])
{this.emit('error'
,Object.assign(new Error('Cannot call write after a stream was destroyed')
,{ code: 'ERR_STREAM_DESTROYED' }));
 return true;
}
 if (typeof encoding === 'function')
 cb = encoding, encoding = 'utf8'
 if (!encoding)
 encoding = 'utf8'
 const fn = this[ASYNC] ? defer : f => f()
 // convert array buffers and typed array views into buffers
 // at some point in the future, we may want to do the opposite!
 // leave strings and buffers as-is
 // anything else switches us into object mode
 if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk))
 if (isArrayBufferView(chunk))
 chunk = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength)
 else if (isArrayBuffer(chunk))
 chunk = Buffer.from(chunk)
 else if (typeof chunk !== 'string')
 // use the setter so we throw if we have encoding set
 this.objectMode = true
 // handle object mode up front, since it's simpler
 // this yields better performance, fewer checks later.
 if (this[OBJECTMODE])
{/* istanbul ignore if - maybe impossible? */
 if (this.flowing && this[BUFFERLENGTH] !== 0)
 this[FLUSH](true)
 if (this.flowing)
 this.emit('data', chunk)
 else
 this[BUFFERPUSH](chunk)
 if (this[BUFFERLENGTH] !== 0)
 this.emit('readable')
 if (cb)
 fn(cb)
 return this.flowing
}
 // at this point the chunk is a buffer or string
 // don't buffer it up or send it to the decoder
 if (!chunk.length)
{if (this[BUFFERLENGTH] !== 0)
 this.emit('readable')
 if (cb)
 fn(cb)
 return this.flowing
}
 // fast-path writing strings of same encoding to a stream with
 // an empty buffer, skipping the buffer/decoder dance
 if(typeof chunk === 'string' &&
  // unless it is a string already ready for us to use
 !(encoding === this[ENCODING] && !this[DECODER].lastNeed))
 chunk = Buffer.from(chunk, encoding)
 if (Buffer.isBuffer(chunk) && this[ENCODING])
 chunk = this[DECODER].write(chunk)
 // Note: flushing CAN potentially switch us into not-flowing mode
 if(this.flowing && this[BUFFERLENGTH] !== 0)
 this[FLUSH](true)
 if(this.flowing)
 this.emit('data', chunk)
 else
 this[BUFFERPUSH](chunk)
 if(this[BUFFERLENGTH] !== 0)
 this.emit('readable')
 if(cb)fn(cb)
 return this.flowing
}
 get bufferLength(){return this[BUFFERLENGTH];}
 get encoding(){return this[ENCODING];}
 set encoding(enc)
{if(this[OBJECTMODE])
 throw new Error('cannot set encoding in objectMode')
 if(this[ENCODING] && enc !== this[ENCODING] &&
 (this[DECODER] && this[DECODER].lastNeed || this[BUFFERLENGTH]))
 throw new Error('cannot change encoding')
 if(this[ENCODING] !== enc)
{this[DECODER] = enc ? new SD(enc) : null
 if(this.buffer.length)
 this.buffer = this.buffer.map(chunk => this[DECODER].write(chunk))
}
 this[ENCODING] = enc
}
 setEncoding(enc){this.encoding = enc}
 get objectMode(){return this[OBJECTMODE];}
 set objectMode(om){this[OBJECTMODE]=this[OBJECTMODE] || !!om;}
 get ['async'](){return this[ASYNC]}
 set ['async'](a){this[ASYNC] = this[ASYNC] || !!a;}
 read(n)
{if (this[DESTROYED])return null
 if (this[BUFFERLENGTH] === 0 || n === 0 || n > this[BUFFERLENGTH])
{this[MAYBE_EMIT_END]();return null
}
 if(this[OBJECTMODE])n = null
 if (this.buffer.length > 1 && !this[OBJECTMODE])
{if (this.encoding)
 this.buffer = [this.buffer.join('')]
 else
 this.buffer = [Buffer.concat(this.buffer, this[BUFFERLENGTH])]
}
 const ret = this[READ](n || null, this.buffer[0])
 this[MAYBE_EMIT_END]()
 return ret
}

 [READ](n, chunk)
{if (n === chunk.length || n === null)
 this[BUFFERSHIFT]()
 else
{this.buffer[0] = chunk.slice(n)
 chunk = chunk.slice(0, n)
 this[BUFFERLENGTH] -= n
}
 this.emit('data', chunk)
 if (!this.buffer.length && !this[EOF])
 this.emit('drain')
 return chunk
}

 end(chunk, encoding, cb)
{if(typeof chunk === 'function')
 cb = chunk, chunk = null
 if (typeof encoding === 'function')
 cb = encoding, encoding = 'utf8'
 if (chunk)
 this.write(chunk, encoding)
 if (cb)
 this.once('end', cb)
 this[EOF] = true
 this.writable = false
 // if we haven't written anything, then go ahead and emit,
 // even if we're not reading.
 // we'll re-emit if a new 'end' listener is added anyway.
 // This makes MP more suitable to write-only use cases.
 if (this.flowing || !this[PAUSED])
 this[MAYBE_EMIT_END]()
 return this
}

  // don't let the internal resume be overwritten
 [RESUME]()
{if (this[DESTROYED])
 return
 this[PAUSED] = false
 this[FLOWING] = true
 this.emit('resume')
 if (this.buffer.length)
 this[FLUSH]()
 else if (this[EOF])
 this[MAYBE_EMIT_END]()
 else
 this.emit('drain')
}
 resume(){return this[RESUME]()}
 pause()
{this[FLOWING] = false
 this[PAUSED] = true
}
 get destroyed () {return this[DESTROYED]}
 get flowing () {return this[FLOWING]}
 get paused () {return this[PAUSED]}

 [BUFFERPUSH] (chunk)
{this[BUFFERLENGTH] += this[OBJECTMODE]?1:chunk.length;
 this.buffer.push(chunk)
}

 [BUFFERSHIFT] ()
{if (this.buffer.length)
 if (this[OBJECTMODE])
 this[BUFFERLENGTH] -= 1
 else
 this[BUFFERLENGTH] -= this.buffer[0].length
 return this.buffer.shift()
}

 [FLUSH] (noDrain)
{do {} while (this[FLUSHCHUNK](this[BUFFERSHIFT]()))
 if (!noDrain && !this.buffer.length && !this[EOF])
 this.emit('drain')
}

 [FLUSHCHUNK] (chunk){return chunk ? (this.emit('data', chunk), this.flowing) : false;}

 pipe(dest, opts)
{if(this[DESTROYED])return;
 const ended = this[EMITTED_END]
 opts = opts || {}
 opts.end = dest === proc.stdout || dest === proc.stderr?false:(opts.end !== false)
 opts.proxyErrors = !!opts.proxyErrors
 // piping an ended stream ends immediately
 if(ended){if(opts.end)dest.end();}
 else
{this.pipes.push(!opts.proxyErrors?new Pipe(this, dest, opts):new PipeProxyErrors(this, dest, opts));
 if(this[ASYNC])defer(()=>this[RESUME]());
 else this[RESUME]();
}
 return dest
}

 unpipe (dest)
{const p = this.pipes.find(p => p.dest === dest)
 if (p)
{this.pipes.splice(this.pipes.indexOf(p), 1)
 p.unpipe()
}
}

 addListener(ev, fn){return this.on(ev, fn)}

 on (ev, fn)
{const ret = super.on(ev, fn)
 if (ev === 'data' && !this.pipes.length && !this.flowing)
 this[RESUME]()
 else if (ev === 'readable' && this[BUFFERLENGTH] !== 0)
 super.emit('readable')
 else if (isEndish(ev) && this[EMITTED_END])
{super.emit(ev)
 this.removeAllListeners(ev)
} else if (ev === 'error' && this[EMITTED_ERROR])
{if (this[ASYNC])
 defer(() => fn.call(this, this[EMITTED_ERROR]))
 else
 fn.call(this, this[EMITTED_ERROR])
}
 return ret
}

 get emittedEnd(){return this[EMITTED_END]}

 [MAYBE_EMIT_END] ()
{if (!this[EMITTING_END] &&
 !this[EMITTED_END] &&
 !this[DESTROYED] &&
 this.buffer.length === 0 &&
 this[EOF])
{this[EMITTING_END] = true
 this.emit('end')
 this.emit('prefinish')
 this.emit('finish')
 if (this[CLOSED])
 this.emit('close')
 this[EMITTING_END] = false
}
}

 emit(ev, data, ...extra)
{// error and close are only events allowed after calling destroy()
 if(ev !== 'error' && ev !== 'close' && ev !== DESTROYED && this[DESTROYED])
 return
 else if (ev === 'data')
{return !data ? false
:this[ASYNC] ? defer(() => this[EMITDATA](data))
:this[EMITDATA](data)
}else if (ev === 'end')
{return this[EMITEND]()
}else if (ev === 'close')
{this[CLOSED] = true
 // don't emit close before 'end' and 'finish'
 if (!this[EMITTED_END] && !this[DESTROYED])
 return
 const ret = super.emit('close')
 this.removeAllListeners('close')
 return ret
}else if (ev === 'error') {
 this[EMITTED_ERROR] = data
 const ret = super.emit('error', data)
 this[MAYBE_EMIT_END]()
 return ret
}else if (ev === 'resume') {
 const ret = super.emit('resume')
 this[MAYBE_EMIT_END]()
 return ret
}else if (ev === 'finish' || ev === 'prefinish')
{const ret = super.emit(ev)
 this.removeAllListeners(ev)
 return ret
}
 // Some other unknown event
 const ret = super.emit(ev, data, ...extra)
 this[MAYBE_EMIT_END]()
 return ret
}

 [EMITDATA](data)
{for(const p of this.pipes)
 if(p.dest.write(data) === false)this.pause();
 const ret = super.emit('data', data)
 this[MAYBE_EMIT_END]()
 return ret;
}

 [EMITEND]()
{if (this[EMITTED_END])
 return
 this[EMITTED_END] = true
 this.readable = false
 if (this[ASYNC])
 defer(() => this[EMITEND2]())
 else
 this[EMITEND2]()
}

 [EMITEND2]()
{if(this[DECODER])
{const data = this[DECODER].end()
 if (data)
{for (const p of this.pipes)
 p.dest.write(data);
 super.emit('data', data)
}
}
 for (const p of this.pipes)
 p.end();
 const ret = super.emit('end')
 this.removeAllListeners('end')
 return ret
}

 // const all = await stream.collect()
 collect()
{const buf = []
 if (!this[OBJECTMODE])
 buf.dataLength = 0
 // set the promise first, in case an error is raised
 // by triggering the flow here.
 const p = this.promise()
 this.on('data',c=>{buf.push(c);if(!this[OBJECTMODE])buf.dataLength+=c.length;})
 return p.then(() => buf)
}

 // const data = await stream.concat()
 concat()
{return this[OBJECTMODE]
?Promise.reject(new Error('cannot concat in objectMode'))
:this.collect().then(buf=>this[OBJECTMODE]
?Promise.reject(new Error('cannot concat in objectMode'))
:this[ENCODING] ? buf.join('') : Buffer.concat(buf, buf.dataLength))
}

 // stream.promise().then(() => done, er => emitted error)
 promise()
{return new Promise((resolve, reject) => {
 this.on(DESTROYED, () => reject(new Error('stream destroyed')))
 this.on('error', er => reject(er))
 this.on('end', () => resolve())
})
}
 
 // for await (let chunk of stream)
 [ASYNCITERATOR] ()
{const next = () => {
 const res = this.read()
 if (res !== null)return Promise.resolve({ done: false, value: res })
 if (this[EOF])return Promise.resolve({ done: true })
 let resolve = null
 let reject = null
 const onerr = er =>
{this.removeListener('data', ondata)
 this.removeListener('end', onend)
 reject(er)
}
 const ondata = value =>
{this.removeListener('error', onerr)
 this.removeListener('end', onend)
 this.pause()
 resolve({ value: value, done: !!this[EOF] })
}
 const onend = () =>
{this.removeListener('error', onerr)
 this.removeListener('data', ondata)
 resolve({ done: true })
}
 const ondestroy = () => onerr(new Error('stream destroyed'));
 return new Promise((res, rej) =>
{reject = rej
 resolve = res
 this.once(DESTROYED, ondestroy)
 this.once('error', onerr)
 this.once('end', onend)
 this.once('data', ondata)
});
}
 return {next}
}

 // for (let chunk of stream)
 [ITERATOR]()
{const next = () => 
{const value = this.read()
 const done = value === null
 return { value, done }
}
 return { next }
}

 destroy(er) 
{if(this[DESTROYED])
{this.emit(...er?['error', er]:[DESTROYED]);
 return this;
}
 this[DESTROYED] = true
 // throw away all buffered data, it's never coming out
 this.buffer.length = 0
 this[BUFFERLENGTH] = 0
 if(typeof this.close==='function'&&!this[CLOSED])
 this.close()
 // if no error to emit, still reject pending promises
 this.emit(...er?['error', er]:[DESTROYED])
 return this
}

 static isStream (s)
{return !!s && (s instanceof Minipass || s instanceof Stream ||s instanceof EE && 
(typeof s.pipe === 'function' || // readable
 (typeof s.write === 'function' && typeof s.end === 'function') // writable
))
}
}

// Tar can encode large and negative numbers using a leading byte of
// 0xff for negative, and 0x80 for positive.

 const encodePositive = (num, buf) =>
{buf[0] = 0x80
 for(var i = buf.length; i > 1; i--){buf[i - 1] = num & 0xff, num = Math.floor(num / 0x100);}
}

 const onesComp=byte=>(0xff^byte)&0xff;
 const twosComp=byte=>((0xff^byte)+1)&0xff;

 const encodeNegative=(num,buf)=>
{buf[0] = 0xff
 var flipped = false
 num = num * -1
 for (var i = buf.length; i > 1; i--)
{var byte = num & 0xff
 num = Math.floor(num / 0x100)
 if (flipped)
 buf[i - 1] = onesComp(byte)
 else if (byte === 0)
 buf[i - 1] = 0
 else
{flipped = true
 buf[i - 1] = twosComp(byte)
}
}
}

 const twos=(buf)=>
{var len = buf.length
 var sum = 0
 var flipped = false
 for (var i = len - 1; i > -1; i--)
{var byte = buf[i]
 var f
 if(flipped)
 f=onesComp(byte);
 else if(byte === 0)
 f=byte;
 else{flipped = true;f = twosComp(byte);}
 if (f !== 0)
 sum -= f * Math.pow(256, len - i - 1)
}
 return sum
}

 const pos = (buf) =>
 //sum(Array(buffer.length).fill(0).map((value,index,{length})=>
 //buffer[index]?buffer[index]*Math.pow(256,length-index-1):0));
{var len = buf.length
 var sum = 0
 for (var i = len - 1; i > -1; i--)
{var byte = buf[i]
 if (byte !== 0)
 sum += byte * Math.pow(256, len - i - 1)
};
 return sum
}

 const large=
 {encode(num, buf)
{if (!Number.isSafeInteger(num))
 // The number is so large that javascript cannot represent it with integer
 // precision.
 throw Error('cannot encode number outside of javascript safe integer range')
 else [encodePositive,encodeNegative][Number(num<0)](num, buf)
 return buf
},parse(buf)
{const pre = buf[0]
 const value = pre === 0x80 ? pos(buf.slice(1, buf.length)): pre === 0xff ? twos(buf): null
 if (value === null)
 throw Error('invalid base256 encoding')
 if (!Number.isSafeInteger(value))
 // The number is so large that javascript cannot represent it with integer
 // precision.
 throw Error('parsed number outside of javascript safe integer range')
 return value
}};


 class Header
{constructor (data, off, ex, gex)
{Object.assign(this,{cksumValid:false,needPax:false,nullBlock:false,block:null,path:null,mode:null,uid:null,gid:null,size:null,mtime:null,cksum:null,linkpath:null,uname:null,gname:null,devmaj:0,devmin:0,atime:null,ctime:null});
 this[TYPE] = '0'
 if(Buffer.isBuffer(data))
 this.decode(data, off || 0, ex, gex)
 else if(data)
 this.set(data)
}

 decode (buf, off, ex, gex)
{if(!off)off=0;
 if(!buf || !(buf.length >= off + 512))
 throw new Error('need 512 bytes for header')
 this.path = decString(buf, off, 100)
 this.mode = decNumber(buf, off + 100, 8)
 this.uid = decNumber(buf, off + 108, 8)
 this.gid = decNumber(buf, off + 116, 8)
 this.size = decNumber(buf, off + 124, 12)
 this.mtime = decDate(buf, off + 136, 12)
 this.cksum = decNumber(buf, off + 148, 12)
 // if we have extended or global extended headers, apply them now
 // See https://github.com/npm/node-tar/pull/187
 slurp.call(this,ex)
 slurp.call(this,gex, true)
 // old tar versions marked dirs as a file with a trailing /
 this[TYPE]=decString(buf, off + 156, 1)
 if (this[TYPE] === '')
 this[TYPE] = '0'
 if (this[TYPE] === '0' && this.path.substr(-1) === '/')
 this[TYPE] = '5'
 // tar implementations sometimes incorrectly put the stat(dir).size
 // as the size in the tarball, even though Directory entries are
 // not able to have any body at all.  In the very rare chance that
 // it actually DOES have a body, we weren't going to do anything with
 // it anyway, and it'll just be a warning about an invalid header.
 if (this[TYPE] === '5')
 this.size = 0
 this.linkpath = decString(buf, off + 157, 100)
 if (buf.slice(off + 257, off + 265).toString() === 'ustar\u000000')
{this.uname = decString(buf, off + 265, 32)
 this.gname = decString(buf, off + 297, 32)
 this.devmaj = decNumber(buf, off + 329, 8)
 this.devmin = decNumber(buf, off + 337, 8)
 if (buf[off + 475] !== 0)
 // definitely a prefix, definitely >130 chars.
 this.path = decString(buf, off + 345, 155) + '/' + this.path
 else
{const prefix = decString(buf, off + 345, 130)
 if (prefix)
 this.path = prefix + '/' + this.path
 this.atime = decDate(buf, off + 476, 12)
 this.ctime = decDate(buf, off + 488, 12)
}
}
 let sum = 8 * 0x20
 for (let i = off; i < off + 148; i++)
 sum += buf[i]
 for (let i = off + 156; i < off + 512; i++)
 sum += buf[i]
 this.cksumValid = sum === this.cksum
 if (this.cksum === null && sum === 8 * 0x20)
 this.nullBlock = true
}

 encode (buf, off)
{if (!buf)
{buf = this.block = Buffer.alloc(512)
 off = 0
}
 if (!off)
 off = 0
 if (!(buf.length >= off + 512))
 throw new Error('need 512 bytes for header')
 const prefixSize = this.ctime || this.atime ? 130 : 155
 const split = splitPrefix(this.path || '', prefixSize)
 const path = split[0]
 const prefix = split[1]
 this.needPax = split[2]
 this.needPax = encString(buf, off, 100, path) || this.needPax
 this.needPax = encNumber(buf, off + 100, 8, this.mode) || this.needPax
 this.needPax = encNumber(buf, off + 108, 8, this.uid) || this.needPax
 this.needPax = encNumber(buf, off + 116, 8, this.gid) || this.needPax
 this.needPax = encNumber(buf, off + 124, 12, this.size) || this.needPax
 this.needPax = encDate(buf, off + 136, 12, this.mtime) || this.needPax
 buf[off + 156] = this[TYPE].charCodeAt(0)
 this.needPax = encString(buf, off + 157, 100, this.linkpath) || this.needPax
 buf.write('ustar\u000000', off + 257, 8)
 this.needPax = encString(buf, off + 265, 32, this.uname) || this.needPax
 this.needPax = encString(buf, off + 297, 32, this.gname) || this.needPax
 this.needPax = encNumber(buf, off + 329, 8, this.devmaj) || this.needPax
 this.needPax = encNumber(buf, off + 337, 8, this.devmin) || this.needPax
 this.needPax = encString(buf, off + 345, prefixSize, prefix) || this.needPax
 if (buf[off + 475] !== 0)
 this.needPax = encString(buf, off + 345, 155, prefix) || this.needPax
 else
{this.needPax = encString(buf, off + 345, 130, prefix) || this.needPax
 this.needPax = encDate(buf, off + 476, 12, this.atime) || this.needPax
 this.needPax = encDate(buf, off + 488, 12, this.ctime) || this.needPax
}
 let sum = 8 * 0x20
 for (let i = off; i < off + 148; i++)
 sum += buf[i]
 for (let i = off + 156; i < off + 512; i++)
 sum += buf[i]
 this.cksum = sum
 encNumber(buf, off + 148, 8, this.cksum)
 this.cksumValid = true
 return this.needPax
}

 set(data)
{for (const i in data)
 if (data[i] !== null && data[i] !== undefined)
 this[i] = data[i]
}

 get type(){return types.get(this[TYPE]) || this[TYPE];}
 get typeKey(){return this[TYPE]}
 set type (type)
{if (types.code.has(type))
 this[TYPE] = types.code.get(type)
 else
 this[TYPE] = type
}
}

 const splitPrefix = (p, prefixSize) =>
{const pathSize = 100
 let pp = p
 let prefix = ''
 let ret
 const root = pathModule.parse(p).root || '.'
 if (Buffer.byteLength(pp) < pathSize)
 ret = [pp, prefix, false]
 else {
 // first set prefix to the dir, and path to the base
 prefix = pathModule.dirname(pp)
 pp = pathModule.basename(pp)
 do
{if (Buffer.byteLength(pp) <= pathSize &&
 Buffer.byteLength(prefix) <= prefixSize)
 // both fit!
 ret = [pp, prefix, false]
 else if (Buffer.byteLength(pp) > pathSize &&
 Buffer.byteLength(prefix) <= prefixSize)
  // prefix fits in prefix, but path doesn't fit in path
 ret = [pp.substr(0, pathSize - 1), prefix, true]
 else
{ // make path take a bit from prefix
 pp = pathModule.join(pathModule.basename(prefix), pp)
 prefix = pathModule.dirname(prefix)
}
} while (prefix !== root && !ret)
 // at this point, found no resolution, just truncate
 if (!ret)
 ret = [p.substr(0, pathSize - 1), '', true]
}
 return ret
}

 const decString = (buf, off, size) =>buf.slice(off, off + size).toString('utf8').replace(/\0.*/, '')
 const decDate = (buf, off, size) =>numToDate(decNumber(buf, off, size))
 const numToDate = num => num === null ? null : new Date(num * 1000)
 const decNumber = (buf, off, size) =>buf[off] & 0x80 ? large.parse(buf.slice(off, off + size)): decSmallNumber(buf, off, size)
 const nanNull = value => isNaN(value) ? null : value
 const decSmallNumber = (buf, off, size) => nanNull(parseInt(buf.slice(off, off + size).toString('utf8').replace(/\0.*$/, '').trim(), 8))
 // the maximum encodable as a null-terminated octal, by field size
 const MAXNUM = {12: 0o77777777777,8: 0o7777777,}
 const encNumber = (buf, off, size, number) =>
 number === null ? false : number > MAXNUM[size] || number < 0
?(large.encode(number, buf.slice(off, off + size)), true)
:(encSmallNumber(buf, off, size, number), false);
 const encSmallNumber = (buf, off, size, number) =>buf.write(octalString(number, size), off, size, 'ascii')
 const octalString = (number, size) =>padOctal(Math.floor(number).toString(8), size)
 const padOctal = (string, size) => (string.length === size - 1 ? string: new Array(size - string.length - 1).join('0') + string + ' ') + '\0';
 const encDate = (buf, off, size, date) => date === null ? false : encNumber(buf, off, size, date.getTime() / 1000);
 // enough to fill the longest string we've got
 const NULLS = new Array(156).join('\0');
 // pad with nulls, return true if it's longer or non-ascii
 const encString = (buf, off, size, string) =>
  string === null ? false :
  (buf.write(string + NULLS, off, size, 'utf8'),
  string.length !== Buffer.byteLength(string) || string.length > size)

 function slurp (ex, global)
{for (const k in ex)
 // we slurp in everything except for the path attribute in
 // a global extended header, because that's weird.
 if (ex[k] !== null && ex[k] !== undefined && !(global && k === 'path'))
 this[k] = ex[k]
}

 class Pax
{constructor (obj, global)
{this.atime = obj.atime || null
 this.charset = obj.charset || null
 this.comment = obj.comment || null
 this.ctime = obj.ctime || null
 this.gid = obj.gid || null
 this.gname = obj.gname || null
 this.linkpath = obj.linkpath || null
 this.mtime = obj.mtime || null
 this.path = obj.path || null
 this.size = obj.size || null
 this.uid = obj.uid || null
 this.uname = obj.uname || null
 this.dev = obj.dev || null
 this.ino = obj.ino || null
 this.nlink = obj.nlink || null
 this.global = global || false
}

 encode ()
{const body = this.encodeBody()
 if(body === '')
 return null;
 const bodyLen = Buffer.byteLength(body)
 // round up to 512 bytes
 // add 512 for header
 const bufLen = 512 * Math.ceil(1 + bodyLen / 512)
 const buf = Buffer.allocUnsafe(bufLen)
 // 0-fill the header section, it might not hit every field
 for (let i = 0; i < 512; i++) buf[i] = 0;
 new Header(
 // XXX split the path
 // then the path should be PaxHeader + basename, but less than 99,
 // prepend with the dirname
 {path: ('PaxHeader/' + path.basename(this.path)).slice(0, 99)
 ,mode: this.mode || 0o644
 ,uid: this.uid || null
 ,gid: this.gid || null
 ,size: bodyLen
 ,mtime: this.mtime || null
 ,type: this.global ? 'GlobalExtendedHeader' : 'ExtendedHeader'
 ,linkpath: ''
 ,uname: this.uname || ''
 ,gname: this.gname || ''
 ,devmaj: 0
 ,devmin: 0
 ,atime: this.atime || null
 ,ctime: this.ctime || null
 }).encode(buf);
 buf.write(body, 512, bodyLen, 'utf8')
 // null pad after the body
 for (let i = bodyLen + 512; i < buf.length; i++) buf[i] = 0;
 return buf
}

 encodeBody()
{return ['path','ctime','atime','dev','ino','nlink','charset','comment','gid','gname','linkpath','mtime','size','uid','uname'].map(field=>
 this.encodeField(field)).reduce((sum,field)=>
 sum+field);
}

 encodeField (field)
{if (this[field] === null || this[field] === undefined)
 return ''
 const v = this[field] instanceof Date ? this[field].getTime() / 1000: this[field]
 const s = ' ' + (field === 'dev' || field === 'ino' || field === 'nlink' ? 'SCHILY.' : '') + field + '=' + v + '\n'
 const byteLen = Buffer.byteLength(s)
 // the digits includes the length of the digits in ascii base-10
 // so if it's 9 characters, then adding 1 for the 9 makes it 10
 // which makes it 11 chars.
 let digits = Math.floor(Math.log(byteLen) / Math.log(10)) + 1
 if (byteLen + digits >= Math.pow(10, digits)) {digits += 1;}
 const len = digits + byteLen
 return len + s
}
}

 Pax.parse = (string, ex, g) => new Pax(merger(parseKV(string), ex), g);
 const merger = (a, b) => b ? Object.keys(a).reduce((s, k) => (s[k] = a[k], s), b) : a;
 const parseKV = string => string.replace(/\n$/, '').split('\n').reduce(parseKVLine, Object.create(null));

 const parseKVLine = (set, line) =>
{const n = parseInt(line, 10)
 // XXX Values with \n in them will fail this.
 // Refactor to not be a naive line-by-line parse.
 if (n !== Buffer.byteLength(line) + 1)
 return set
 line = line.substr((n + ' ').length)
 const kv = line.split('=')
 const k = kv.shift().replace(/^SCHILY\.(dev|ino|nlink)/, '$1')
 if (!k) return set
 const v = kv.join('=')
 set[k] = /^([A-Z]+\.)?([mac]|birth|creation)time$/.test(k) ? new Date(v * 1000) : /^[0-9]+$/.test(v) ? +v : v
 return set
}

 export class Parser extends EventEmitter
{constructor(opt)
{super()
 // set to boolean false when an entry starts.  1024 bytes of \0
 // is technically a valid tarball, albeit a boring one.
 this[SAW_VALID_ENTRY] = null
 // these BADARCHIVE errors can't be detected early. listen on DONE.
 this.on(DONE, _ =>
{if (this.state === 'begin' || this[SAW_VALID_ENTRY] === false)
 // either less than 1 block of data, or all entries were invalid.
 // Either way, probably not even a tarball.
 this.warn('TAR_BAD_ARCHIVE', 'Unrecognized archive format')
});
 this.on(DONE, _ =>
{this.emit('prefinish')
 this.emit('finish')
 this.emit('end')
 this.emit('close')
});
 this.maxMetaEntrySize = maxMetaEntrySize
 this.filter = value=>true
 // have to set this so that streams are ok piping into it
 this.writable = true
 this.readable = false
 this.queue=[]
 this[BUFFER] = null
 this[READENTRY] = null
 this.writeEntry = null
 this.state = 'begin'
 this[META] = ''
 this[EX] = null
 this[GEX] = null
 this[ENDED] = false
 this[UNZIP] = null
 this[ABORTED] = false
 this[SAW_NULL_BLOCK] = false
 this[SAW_EOF] = false
}

 write(chunk)
{if(this.aborted)return
 /* first write, might be gzipped
 if (this[UNZIP] === null && chunk)
{if (this[BUFFER])
{chunk = Buffer.concat([this[BUFFER], chunk])
 this[BUFFER] = null
}
 if (chunk.length < gzipHeader.length)
{this[BUFFER] = chunk
 return true
}
 for (let i = 0; this[UNZIP] === null && i < gzipHeader.length; i++)
 if (chunk[i] !== gzipHeader[i])
 this[UNZIP] = false
 if (this[UNZIP] === null)
{const ended = this[ENDED]
 this[ENDED] = false
 this[UNZIP] = new zlib.Unzip()
 this[UNZIP].on('data', chunk => this[CONSUMECHUNK](chunk))
 this[UNZIP].on('error', er => this.abort(er))
 this[UNZIP].on('end', _ =>
{this[ENDED] = true
 this[CONSUMECHUNK]()
})
 this[WRITING] = true
 const ret = this[UNZIP][ended ? 'end' : 'write'](chunk)
 this[WRITING] = false
 return ret
}
}*/
 this[WRITING] = true
 //if (this[UNZIP])this[UNZIP].write(chunk); else
 this.consumeChunk(chunk);
 this[WRITING] = false
 // return false if there's a queue, or if the current entry isn't flowing
 const ret=this.queue.length?false:this[READENTRY]?.flowing??true
 // if we have no queue, then that means a clogged READENTRY
 if (!ret && !this.queue.length)
 this[READENTRY].once('drain', _ => this.emit('drain'))
 return ret
}

 consumeChunk(chunk)
{if (this[CONSUMING] || this[BUFFER])
 if (chunk && !this[ABORTED])
 this[BUFFER] = this[BUFFER] ? Buffer.concat([this[BUFFER], chunk]) : chunk;
 if (!chunk && !this[BUFFER])
 this[MAYBEEND]()
 else
{this[CONSUMING] = true
 if (this[BUFFER])
{const c = this[BUFFER]
 this[BUFFER] = null
 this.consumeChunkSub(c)
} else
 this.consumeChunkSub(chunk)
 while(this[BUFFER]&&this[BUFFER].length>=512&&!this[ABORTED]&&!this[SAW_EOF])
{const c=this[BUFFER]
 this[BUFFER] = null
 this.consumeChunkSub(c)
}
 this[CONSUMING] = false
}
 if (!this[BUFFER] || this[ENDED])
 this[MAYBEEND]()
}

 consumeChunkSub(chunk)
{// we know that we are in CONSUMING mode, so anything written goes into
 // the buffer. Advance the position and put any remainder in the buffer.
 let position = 0
 const length = chunk.length
 while (position + 512 <= length && !this[ABORTED] && !this[SAW_EOF])
{switch (this.state)
{case 'begin':
 case 'header':this.consumeHeader(chunk, position);position += 512;break
 case 'ignore':
 case 'body':position += this.consumeBody(chunk, position);break
 case 'meta':position += this.consumeMeta(chunk, position);break     
 default:throw new Error('invalid state: ' + this[STATE])
}
 /*position+=
 {begin:this.consumeHeader
 ,header:this.consumeHeader
 ,ignore:this.consumeBody
 ,body:this.consumeBody
 ,meta:this.consumeMeta
 }[this.state](chunk, position)??512*/
}
 if (position < length)
 this[BUFFER] = this[BUFFER]
?Buffer.concat([chunk.slice(position), this[BUFFER]])
:chunk.slice(position)
}

 consumeHeader(chunk,position)
{if(this[SAW_VALID_ENTRY]===null)
 this[SAW_VALID_ENTRY]=false;
 let header=new Header(chunk, position, this[EX], this[GEX])
 if(header.nullBlock)
{if(this[SAW_NULL_BLOCK])
{this[SAW_EOF] = true
 // ending an archive with no entries.  pointless, but legal.
 if (this.state === 'begin')
 this.state = 'header'
 this[EMIT]('eof')
}else
{this[SAW_NULL_BLOCK] = true
 this[EMIT]('nullBlock')
}
}else
{this[SAW_NULL_BLOCK] = false
 if(!header.cksumValid)
 throw Error('checksum failure')
 else if (!header.path)
 this.warn('TAR_ENTRY_INVALID', 'path is required', { header })
 else
{const type = header.type
 if (/^(Symbolic)?Link$/.test(type) && !header.linkpath)
 this.warn('TAR_ENTRY_INVALID', 'linkpath required', { header })
 else if (!/^(Symbolic)?Link$/.test(type) && header.linkpath)
 this.warn('TAR_ENTRY_INVALID', 'linkpath forbidden', { header })
 else
{const entry = this.writeEntry = new Entry(header, this[EX], this[GEX])
 // we do this for meta & ignored entries as well, because they
 // are still valid tar, or else we wouldn't know to ignore them
 if (!this[SAW_VALID_ENTRY])
 if (entry.remain)
 // this might be the one!
 entry.on('end',() =>
{if (!entry.invalid)
 this[SAW_VALID_ENTRY] = true
})
 else this[SAW_VALID_ENTRY] = true
 if (entry.meta)
{if (entry.size > this.maxMetaEntrySize)
{entry.ignore = true
 this[EMIT]('ignoredEntry', entry)
 this.state = 'ignore'
 entry.resume()
}else if (entry.size > 0)
{this[META] = ''
 entry.on('data', c => this[META] += c)
 this.state = 'meta'
}
}else
{this[EX] = null
 entry.ignore = entry.ignore || !this.filter(entry.path, entry)

 if (entry.ignore)
{// probably valid, just not something we care about
 this[EMIT]('ignoredEntry', entry)
 this.state = entry.remain ? 'ignore' : 'header'
 entry.resume()
}else
{if(entry.remain)this.state = 'body'
 else{this.state = 'header';entry.end()}
 this.queue.push(entry)
 if (!this[READENTRY])
 this.nextEntry()
}
}
}
}
}
 return 512;
}

 [PROCESSENTRY] (entry)
{let go = true
 if (!entry)
{this[READENTRY] = null
 go = false
}else if (Array.isArray(entry))
 this.emit.apply(this, entry);
 else
{this[READENTRY] = entry
 this.emit('entry', entry)
 if (!entry.emittedEnd) {
 entry.on('end', _ => this.nextEntry())
 go = false
}
}
 return go
}

 nextEntry ()
{do {} while (this[PROCESSENTRY](this.queue.shift()))
 if (!this.queue.length)
{// At this point, there's nothing in the queue, but we may have an
 // entry which is being consumed (readEntry).
 // If we/ If we don't, then we definitely can handle more data.
 // If we do, and either it's flowing, or it has never had any data
 // written to it, then it needs more.
 // The only other possibility is that it has returned false from a
 // write() call, so we wait for the next drain to continue.
 const re = this[READENTRY]
 const drainNow = !re || re.flowing || re.size === re.remain
 if (drainNow)
{if (!this[WRITING])
 this.emit('drain')
}else
 re.once('drain', _ => this.emit('drain'));
}
}

 consumeBody(chunk, position)
{// write up to but no  more than writeEntry.blockRemain
 const entry = this.writeEntry
 const br = entry.blockRemain
 const c = (br >= chunk.length && position === 0) ? chunk : chunk.slice(position, position + br);
 entry.write(c)
 if(!entry.blockRemain)
{this.state = 'header'
 this.writeEntry = null
 entry.end()
}
 return c.length
}

 consumeMeta(chunk, position)
{const entry = this.writeEntry
 const ret = this.consumeBody(chunk, position)
 // if we finished, then the entry is reset
 if (!this.writeEntry)
 this[EMITMETA](entry)
 return ret
}

 [EMIT] (ev, data, extra)
{if (!this.queue.length && !this[READENTRY])
 this.emit(ev, data, extra)
 else
 this.queue.push([ev, data, extra])
}

 [EMITMETA] (entry)
{this[EMIT]('meta', this[META])
 switch (entry.type)
{case 'ExtendedHeader':
 case 'OldExtendedHeader':
 this[EX] = Pax.parse(this[META], this[EX], false)
 break
 case 'GlobalExtendedHeader':
 this[GEX] = Pax.parse(this[META], this[GEX], true)
 break
 case 'NextFileHasLongPath':
 case 'OldGnuLongPath':
 this[EX] = this[EX] || Object.create(null)
 this[EX].path = this[META].replace(/\0.*/, '')
 break
 case 'NextFileHasLongLinkpath':
 this[EX] = this[EX] || Object.create(null)
 this[EX].linkpath = this[META].replace(/\0.*/, '')
 break
 /* istanbul ignore next */
 default: throw new Error('unknown meta: ' + entry.type)
}
}
 abort(error){this[ABORTED] = true;this.emit('abort', error);}

 [MAYBEEND]()
{if(this[ENDED] && !this[EMITTEDEND] && !this[ABORTED] && !this[CONSUMING])
{this[EMITTEDEND] = true
 const entry = this.writeEntry
 if (entry && entry.blockRemain)
{// truncated, likely a damaged file
 const have = this[BUFFER] ? this[BUFFER].length : 0
 this.warn('TAR_BAD_ARCHIVE', `Truncated input (needed ${
 entry.blockRemain} more bytes, only ${have} available)`, { entry })
 if (this[BUFFER])
 entry.write(this[BUFFER])
 entry.end()
}
 this[EMIT](DONE)
}
}

 end(chunk)
{if (!this[ABORTED])
 if (this[UNZIP])
 this[UNZIP].end(chunk)
 else
{this[ENDED] = true
 this.write(chunk)
}
}
}
