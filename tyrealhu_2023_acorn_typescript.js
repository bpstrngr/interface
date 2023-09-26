import * as acornNamespace from './haverbeke_2012_acorn.js';
import { tokTypes, TokContext, TokenType, keywordTypes } from './haverbeke_2012_acorn.js';

// @ts-ignore
const startsExpr = true;
// Succinct definitions of keyword token types
function kwLike(_name, options = {}) {
    return new TokenType('name', options);
}
const acornTypeScriptMap = new WeakMap();
function generateAcornTypeScript(_acorn) {
    const acorn = _acorn.Parser.acorn || _acorn;
    let acornTypeScript = acornTypeScriptMap.get(acorn);
    if (!acornTypeScript) {
        const tsKwTokenType = generateTsKwTokenType();
        const tsTokenType = generateTsTokenType();
        const tsTokenContext = generateTsTokenContext();
        const tsKeywordsRegExp = new RegExp(`^(?:${Object.keys(tsKwTokenType).join('|')})$`);
        tsTokenType.jsxTagStart.updateContext = function () {
            this.context.push(tsTokenContext.tc_expr); // treat as beginning of
            // JSX expression
            this.context.push(tsTokenContext.tc_oTag); // start opening tag context
            this.exprAllowed = false;
        };
        tsTokenType.jsxTagEnd.updateContext = function (prevType) {
            let out = this.context.pop();
            if (out === tsTokenContext.tc_oTag && prevType === tokTypes.slash || out === tsTokenContext.tc_cTag) {
                this.context.pop();
                this.exprAllowed = this.curContext() === tsTokenContext.tc_expr;
            }
            else {
                this.exprAllowed = true;
            }
        };
        function tokenIsLiteralPropertyName(token) {
            return [
                ...[tokTypes.name, tokTypes.string, tokTypes.num],
                ...Object.values(keywordTypes),
                ...Object.values(tsKwTokenType)
            ].includes(token);
        }
        function tokenIsKeywordOrIdentifier(token) {
            return [
                ...[tokTypes.name],
                ...Object.values(keywordTypes),
                ...Object.values(tsKwTokenType)
            ].includes(token);
        }
        function tokenIsIdentifier(token) {
            return [...Object.values(tsKwTokenType), tokTypes.name].includes(token);
        }
        function tokenIsTSDeclarationStart(token) {
            return [
                tsKwTokenType.abstract,
                tsKwTokenType.declare,
                tsKwTokenType.enum,
                tsKwTokenType.module,
                tsKwTokenType.namespace,
                tsKwTokenType.interface,
                tsKwTokenType.type
            ].includes(token);
        }
        function tokenIsTSTypeOperator(token) {
            return [
                tsKwTokenType.keyof,
                tsKwTokenType.readonly,
                tsKwTokenType.unique
            ].includes(token);
        }
        function tokenIsTemplate(token) {
            return token === tokTypes.invalidTemplate;
        }
        acornTypeScript = {
            tokTypes: Object.assign(Object.assign({}, tsKwTokenType), tsTokenType),
            tokContexts: Object.assign({}, tsTokenContext),
            keywordsRegExp: tsKeywordsRegExp,
            tokenIsLiteralPropertyName,
            tokenIsKeywordOrIdentifier,
            tokenIsIdentifier,
            tokenIsTSDeclarationStart,
            tokenIsTSTypeOperator,
            tokenIsTemplate
        };
    }
    return acornTypeScript;
}
function generateTsTokenContext() {
    return {
        tc_oTag: new TokContext('<tag', false, false),
        tc_cTag: new TokContext('</tag', false, false),
        tc_expr: new TokContext('<tag>...</tag>', true, true)
    };
}
function generateTsTokenType() {
    return {
        at: new TokenType('@'),
        jsxName: new TokenType('jsxName'),
        jsxText: new TokenType('jsxText', { beforeExpr: true }),
        jsxTagStart: new TokenType('jsxTagStart', { startsExpr: true }),
        jsxTagEnd: new TokenType('jsxTagEnd')
    };
}
function generateTsKwTokenType() {
    return {
        assert: kwLike('assert', { startsExpr }),
        asserts: kwLike('asserts', { startsExpr }),
        global: kwLike('global', { startsExpr }),
        keyof: kwLike('keyof', { startsExpr }),
        readonly: kwLike('readonly', { startsExpr }),
        unique: kwLike('unique', { startsExpr }),
        abstract: kwLike('abstract', { startsExpr }),
        declare: kwLike('declare', { startsExpr }),
        enum: kwLike('enum', { startsExpr }),
        module: kwLike('module', { startsExpr }),
        namespace: kwLike('namespace', { startsExpr }),
        interface: kwLike('interface', { startsExpr }),
        type: kwLike('type', { startsExpr })
    };
}

// Each scope gets a bitset that may contain these flags
// prettier-ignore
const 
// Up to 0b00100000000 is reserved in acorn.
TS_SCOPE_OTHER = 0b01000000000, TS_SCOPE_TS_MODULE = 0b10000000000;
// These flags are meant to be _only_ used inside the Scope class (or subclasses).
// prettier-ignore
const BIND_KIND_VALUE = 1, BIND_KIND_TYPE = 2, 
BIND_SCOPE_LEXICAL = 8, // Let- or const-style binding
// bound inside the function
// Misc flags
BIND_FLAGS_NONE = 64, BIND_FLAGS_CLASS = 128, BIND_FLAGS_TS_EXPORT_ONLY = 1024;
// These flags are meant to be _only_ used by Scope consumers
// prettier-ignore
/*                              =    is value?    |    is type?    |      scope          |    misc flags    */
const BIND_LEXICAL = BIND_KIND_VALUE | 0 | BIND_SCOPE_LEXICAL | 0, BIND_TS_INTERFACE = 0 | BIND_KIND_TYPE | 0 | BIND_FLAGS_CLASS, BIND_TS_TYPE = 0 | BIND_KIND_TYPE | 0 | 0, // These bindings don't introduce anything in the scope. They are used for assignments and
// function expressions IDs.
BIND_NONE = 0 | 0 | 0 | BIND_FLAGS_NONE, BIND_TS_NAMESPACE = 0 | 0 | 0 | BIND_FLAGS_TS_EXPORT_ONLY;
const SCOPE_ARROW = 16;

const skipWhiteSpaceInLine = /(?:[^\S\n\r\u2028\u2029]|\/\/.*|\/\*.*?\*\/)*/y;
// Skip whitespace and single-line comments, including /* no newline here */.
// After this RegExp matches, its lastIndex points to a line terminator, or
// the start of multi-line comment (which is effectively a line terminator),
// or the end of string.
const skipWhiteSpaceToLineBreak = new RegExp(
// Unfortunately JS doesn't support Perl's atomic /(?>pattern)/ or
// possessive quantifiers, so we use a trick to prevent backtracking
// when the look-ahead for line terminator fails.
'(?=(' +
    // Capture the whitespace and comments that should be skipped inside
    // a look-ahead assertion, and then re-match the group as a unit.
    skipWhiteSpaceInLine.source +
    '))\\1' +
    // Look-ahead for either line terminator, start of multi-line comment,
    // or end of string.
    /(?=[\n\r\u2028\u2029]|\/\*(?!.*?\*\/)|$)/.source, 'y' // sticky
);

class DestructuringErrors {
    constructor() {
        this.shorthandAssign =
            this.trailingComma =
                this.parenthesizedAssign =
                    this.parenthesizedBind =
                        this.doubleProto = -1;
    }
}
function isPrivateNameConflicted(privateNameMap, element) {
    const name = element.key.name;
    const curr = privateNameMap[name];
    let next = "true";
    if (element.type === "MethodDefinition" && (element.kind === "get" || element.kind === "set")) {
        next = (element.static ? "s" : "i") + element.kind;
    }
    // `class { get #a(){}; static set #a(_){} }` is also conflict.
    if (curr === "iget" && next === "iset" ||
        curr === "iset" && next === "iget" ||
        curr === "sget" && next === "sset" ||
        curr === "sset" && next === "sget") {
        privateNameMap[name] = "true";
        return false;
    }
    else if (!curr) {
        privateNameMap[name] = next;
        return false;
    }
    else {
        return true;
    }
}
function checkKeyName(node, name) {
    const { computed, key } = node;
    return !computed && (key.type === "Identifier" && key.name === name ||
        key.type === "Literal" && key.value === name);
}

const TypeScriptError = {
    AbstractMethodHasImplementation: ({ methodName }) => `Method '${methodName}' cannot have an implementation because it is marked abstract.`,
    AbstractPropertyHasInitializer: ({ propertyName }) => `Property '${propertyName}' cannot have an initializer because it is marked abstract.`,
    AccesorCannotDeclareThisParameter: '\'get\' and \'set\' accessors cannot declare \'this\' parameters.',
    AccesorCannotHaveTypeParameters: 'An accessor cannot have type parameters.',
    CannotFindName: ({ name }) => `Cannot find name '${name}'.`,
    ClassMethodHasDeclare: 'Class methods cannot have the \'declare\' modifier.',
    ClassMethodHasReadonly: 'Class methods cannot have the \'readonly\' modifier.',
    ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference: 'A \'const\' initializer in an ambient context must be a string or numeric literal or literal enum reference.',
    ConstructorHasTypeParameters: 'Type parameters cannot appear on a constructor declaration.',
    DeclareAccessor: ({ kind }) => `'declare' is not allowed in ${kind}ters.`,
    DeclareClassFieldHasInitializer: 'Initializers are not allowed in ambient contexts.',
    DeclareFunctionHasImplementation: 'An implementation cannot be declared in ambient contexts.',
    DuplicateAccessibilityModifier: 
    // `Accessibility modifier already seen: ${modifier}` would be more helpful.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    () => `Accessibility modifier already seen.`,
    DuplicateModifier: ({ modifier }) => `Duplicate modifier: '${modifier}'.`,
    // `token` matches the terminology used by typescript:
    // https://github.com/microsoft/TypeScript/blob/main/src/compiler/types.ts#L2915
    EmptyHeritageClauseType: ({ token }) => `'${token}' list cannot be empty.`,
    EmptyTypeArguments: 'Type argument list cannot be empty.',
    EmptyTypeParameters: 'Type parameter list cannot be empty.',
    ExpectedAmbientAfterExportDeclare: '\'export declare\' must be followed by an ambient declaration.',
    ImportAliasHasImportType: 'An import alias can not use \'import type\'.',
    IncompatibleModifiers: ({ modifiers }) => `'${modifiers[0]}' modifier cannot be used with '${modifiers[1]}' modifier.`,
    IndexSignatureHasAbstract: 'Index signatures cannot have the \'abstract\' modifier.',
    IndexSignatureHasAccessibility: ({ modifier }) => `Index signatures cannot have an accessibility modifier ('${modifier}').`,
    IndexSignatureHasDeclare: 'Index signatures cannot have the \'declare\' modifier.',
    IndexSignatureHasOverride: '\'override\' modifier cannot appear on an index signature.',
    IndexSignatureHasStatic: 'Index signatures cannot have the \'static\' modifier.',
    InitializerNotAllowedInAmbientContext: 'Initializers are not allowed in ambient contexts.',
    InvalidModifierOnTypeMember: ({ modifier }) => `'${modifier}' modifier cannot appear on a type member.`,
    InvalidModifierOnTypeParameter: ({ modifier }) => `'${modifier}' modifier cannot appear on a type parameter.`,
    InvalidModifierOnTypeParameterPositions: ({ modifier }) => `'${modifier}' modifier can only appear on a type parameter of a class, interface or type alias.`,
    InvalidModifiersOrder: ({ orderedModifiers }) => `'${orderedModifiers[0]}' modifier must precede '${orderedModifiers[1]}' modifier.`,
    InvalidPropertyAccessAfterInstantiationExpression: 'Invalid property access after an instantiation expression. ' +
        'You can either wrap the instantiation expression in parentheses, or delete the type arguments.',
    InvalidTupleMemberLabel: 'Tuple members must be labeled with a simple identifier.',
    MissingInterfaceName: '\'interface\' declarations must be followed by an identifier.',
    MixedLabeledAndUnlabeledElements: 'Tuple members must all have names or all not have names.',
    NonAbstractClassHasAbstractMethod: 'Abstract methods can only appear within an abstract class.',
    NonClassMethodPropertyHasAbstractModifer: '\'abstract\' modifier can only appear on a class, method, or property declaration.',
    OptionalTypeBeforeRequired: 'A required element cannot follow an optional element.',
    OverrideNotInSubClass: 'This member cannot have an \'override\' modifier because its containing class does not extend another class.',
    PatternIsOptional: 'A binding pattern parameter cannot be optional in an implementation signature.',
    PrivateElementHasAbstract: 'Private elements cannot have the \'abstract\' modifier.',
    PrivateElementHasAccessibility: ({ modifier }) => `Private elements cannot have an accessibility modifier ('${modifier}').`,
    PrivateMethodsHasAccessibility: ({ modifier }) => `Private methods cannot have an accessibility modifier ('${modifier}').`,
    ReadonlyForMethodSignature: '\'readonly\' modifier can only appear on a property declaration or index signature.',
    ReservedArrowTypeParam: 'This syntax is reserved in files with the .mts or .cts extension. Add a trailing comma, as in `<T,>() => ...`.',
    ReservedTypeAssertion: 'This syntax is reserved in files with the .mts or .cts extension. Use an `as` expression instead.',
    SetAccesorCannotHaveOptionalParameter: 'A \'set\' accessor cannot have an optional parameter.',
    SetAccesorCannotHaveRestParameter: 'A \'set\' accessor cannot have rest parameter.',
    SetAccesorCannotHaveReturnType: 'A \'set\' accessor cannot have a return type annotation.',
    SingleTypeParameterWithoutTrailingComma: ({ typeParameterName }) => `Single type parameter ${typeParameterName} should have a trailing comma. Example usage: <${typeParameterName},>.`,
    StaticBlockCannotHaveModifier: 'Static class blocks cannot have any modifier.',
    TypeAnnotationAfterAssign: 'Type annotations must come before default assignments, e.g. instead of `age = 25: number` use `age: number = 25`.',
    TypeImportCannotSpecifyDefaultAndNamed: 'A type-only import can specify a default import or named bindings, but not both.',
    TypeModifierIsUsedInTypeExports: 'The \'type\' modifier cannot be used on a named export when \'export type\' is used on its export statement.',
    TypeModifierIsUsedInTypeImports: 'The \'type\' modifier cannot be used on a named import when \'import type\' is used on its import statement.',
    UnexpectedParameterModifier: 'A parameter property is only allowed in a constructor implementation.',
    UnexpectedReadonly: '\'readonly\' type modifier is only permitted on array and tuple literal types.',
    GenericsEndWithComma: `Trailing comma is not allowed at the end of generics.`,
    UnexpectedTypeAnnotation: 'Did not expect a type annotation here.',
    UnexpectedTypeCastInParameter: 'Unexpected type cast in parameter position.',
    UnsupportedImportTypeArgument: 'Argument in a type import must be a string literal.',
    UnsupportedParameterPropertyKind: 'A parameter property may not be declared using a binding pattern.',
    UnsupportedSignatureParameterKind: ({ type }) => `Name in a signature must be an Identifier, ObjectPattern or ArrayPattern, instead got ${type}.`,
    LetInLexicalBinding: '\'let\' is not allowed to be used as a name in \'let\' or \'const\' declarations.'
};
const DecoratorsError = {
    UnexpectedLeadingDecorator: 'Leading decorators must be attached to a class declaration.',
    DecoratorConstructor: 'Decorators can\'t be used with a constructor. Did you mean \'@dec class { ... }\'?',
    TrailingDecorator: 'Decorators must be attached to a class element.',
    SpreadElementDecorator: `Decorators can't be used with SpreadElement`
};

function generateParseDecorators(Parse, acornTypeScript, acorn) {
    const { tokTypes: tt } = acorn;
    const { tokTypes } = acornTypeScript;
    return class ParseDecorators extends Parse {
        takeDecorators(node) {
            const decorators = this.decoratorStack[this.decoratorStack.length - 1];
            if (decorators.length) {
                node.decorators = decorators;
                this.resetStartLocationFromNode(node, decorators[0]);
                this.decoratorStack[this.decoratorStack.length - 1] = [];
            }
        }
        parseDecorators(allowExport) {
            const currentContextDecorators = this.decoratorStack[this.decoratorStack.length - 1];
            while (this.match(tokTypes.at)) {
                const decorator = this.parseDecorator();
                currentContextDecorators.push(decorator);
            }
            if (this.match(tt._export)) {
                if (!allowExport) {
                    this.unexpected();
                }
            }
            else if (!this.canHaveLeadingDecorator()) {
                this.raise(this.start, DecoratorsError.UnexpectedLeadingDecorator);
            }
        }
        parseDecorator() {
            const node = this.startNode();
            this.next();
            // Every time a decorator class expression is evaluated, a new empty array is pushed onto the stack
            // So that the decorators of any nested class expressions will be dealt with separately
            this.decoratorStack.push([]);
            const startPos = this.start;
            const startLoc = this.startLoc;
            let expr;
            if (this.match(tt.parenL)) {
                const startPos = this.start;
                const startLoc = this.startLoc;
                this.next(); // eat '('
                expr = this.parseExpression();
                this.expect(tt.parenR);
                if (this.options.preserveParens) {
                    let par = this.startNodeAt(startPos, startLoc);
                    par.expression = expr;
                    expr = this.finishNode(par, 'ParenthesizedExpression');
                }
            }
            else {
                expr = this.parseIdent(false);
                while (this.eat(tt.dot)) {
                    const node = this.startNodeAt(startPos, startLoc);
                    node.object = expr;
                    node.property = this.parseIdent(true);
                    node.computed = false;
                    expr = this.finishNode(node, 'MemberExpression');
                }
            }
            node.expression = this.parseMaybeDecoratorArguments(expr);
            this.decoratorStack.pop();
            return this.finishNode(node, 'Decorator');
        }
        parseMaybeDecoratorArguments(expr) {
            if (this.eat(tt.parenL)) {
                const node = this.startNodeAtNode(expr);
                node.callee = expr;
                node.arguments = this.parseExprList(tt.parenR, false);
                return this.finishNode(node, 'CallExpression');
            }
            return expr;
        }
    };
}

var XHTMLEntities = {
    quot: '\u0022',
    amp: '&',
    apos: '\u0027',
    lt: '<',
    gt: '>',
    nbsp: '\u00A0',
    iexcl: '\u00A1',
    cent: '\u00A2',
    pound: '\u00A3',
    curren: '\u00A4',
    yen: '\u00A5',
    brvbar: '\u00A6',
    sect: '\u00A7',
    uml: '\u00A8',
    copy: '\u00A9',
    ordf: '\u00AA',
    laquo: '\u00AB',
    not: '\u00AC',
    shy: '\u00AD',
    reg: '\u00AE',
    macr: '\u00AF',
    deg: '\u00B0',
    plusmn: '\u00B1',
    sup2: '\u00B2',
    sup3: '\u00B3',
    acute: '\u00B4',
    micro: '\u00B5',
    para: '\u00B6',
    middot: '\u00B7',
    cedil: '\u00B8',
    sup1: '\u00B9',
    ordm: '\u00BA',
    raquo: '\u00BB',
    frac14: '\u00BC',
    frac12: '\u00BD',
    frac34: '\u00BE',
    iquest: '\u00BF',
    Agrave: '\u00C0',
    Aacute: '\u00C1',
    Acirc: '\u00C2',
    Atilde: '\u00C3',
    Auml: '\u00C4',
    Aring: '\u00C5',
    AElig: '\u00C6',
    Ccedil: '\u00C7',
    Egrave: '\u00C8',
    Eacute: '\u00C9',
    Ecirc: '\u00CA',
    Euml: '\u00CB',
    Igrave: '\u00CC',
    Iacute: '\u00CD',
    Icirc: '\u00CE',
    Iuml: '\u00CF',
    ETH: '\u00D0',
    Ntilde: '\u00D1',
    Ograve: '\u00D2',
    Oacute: '\u00D3',
    Ocirc: '\u00D4',
    Otilde: '\u00D5',
    Ouml: '\u00D6',
    times: '\u00D7',
    Oslash: '\u00D8',
    Ugrave: '\u00D9',
    Uacute: '\u00DA',
    Ucirc: '\u00DB',
    Uuml: '\u00DC',
    Yacute: '\u00DD',
    THORN: '\u00DE',
    szlig: '\u00DF',
    agrave: '\u00E0',
    aacute: '\u00E1',
    acirc: '\u00E2',
    atilde: '\u00E3',
    auml: '\u00E4',
    aring: '\u00E5',
    aelig: '\u00E6',
    ccedil: '\u00E7',
    egrave: '\u00E8',
    eacute: '\u00E9',
    ecirc: '\u00EA',
    euml: '\u00EB',
    igrave: '\u00EC',
    iacute: '\u00ED',
    icirc: '\u00EE',
    iuml: '\u00EF',
    eth: '\u00F0',
    ntilde: '\u00F1',
    ograve: '\u00F2',
    oacute: '\u00F3',
    ocirc: '\u00F4',
    otilde: '\u00F5',
    ouml: '\u00F6',
    divide: '\u00F7',
    oslash: '\u00F8',
    ugrave: '\u00F9',
    uacute: '\u00FA',
    ucirc: '\u00FB',
    uuml: '\u00FC',
    yacute: '\u00FD',
    thorn: '\u00FE',
    yuml: '\u00FF',
    OElig: '\u0152',
    oelig: '\u0153',
    Scaron: '\u0160',
    scaron: '\u0161',
    Yuml: '\u0178',
    fnof: '\u0192',
    circ: '\u02C6',
    tilde: '\u02DC',
    Alpha: '\u0391',
    Beta: '\u0392',
    Gamma: '\u0393',
    Delta: '\u0394',
    Epsilon: '\u0395',
    Zeta: '\u0396',
    Eta: '\u0397',
    Theta: '\u0398',
    Iota: '\u0399',
    Kappa: '\u039A',
    Lambda: '\u039B',
    Mu: '\u039C',
    Nu: '\u039D',
    Xi: '\u039E',
    Omicron: '\u039F',
    Pi: '\u03A0',
    Rho: '\u03A1',
    Sigma: '\u03A3',
    Tau: '\u03A4',
    Upsilon: '\u03A5',
    Phi: '\u03A6',
    Chi: '\u03A7',
    Psi: '\u03A8',
    Omega: '\u03A9',
    alpha: '\u03B1',
    beta: '\u03B2',
    gamma: '\u03B3',
    delta: '\u03B4',
    epsilon: '\u03B5',
    zeta: '\u03B6',
    eta: '\u03B7',
    theta: '\u03B8',
    iota: '\u03B9',
    kappa: '\u03BA',
    lambda: '\u03BB',
    mu: '\u03BC',
    nu: '\u03BD',
    xi: '\u03BE',
    omicron: '\u03BF',
    pi: '\u03C0',
    rho: '\u03C1',
    sigmaf: '\u03C2',
    sigma: '\u03C3',
    tau: '\u03C4',
    upsilon: '\u03C5',
    phi: '\u03C6',
    chi: '\u03C7',
    psi: '\u03C8',
    omega: '\u03C9',
    thetasym: '\u03D1',
    upsih: '\u03D2',
    piv: '\u03D6',
    ensp: '\u2002',
    emsp: '\u2003',
    thinsp: '\u2009',
    zwnj: '\u200C',
    zwj: '\u200D',
    lrm: '\u200E',
    rlm: '\u200F',
    ndash: '\u2013',
    mdash: '\u2014',
    lsquo: '\u2018',
    rsquo: '\u2019',
    sbquo: '\u201A',
    ldquo: '\u201C',
    rdquo: '\u201D',
    bdquo: '\u201E',
    dagger: '\u2020',
    Dagger: '\u2021',
    bull: '\u2022',
    hellip: '\u2026',
    permil: '\u2030',
    prime: '\u2032',
    Prime: '\u2033',
    lsaquo: '\u2039',
    rsaquo: '\u203A',
    oline: '\u203E',
    frasl: '\u2044',
    euro: '\u20AC',
    image: '\u2111',
    weierp: '\u2118',
    real: '\u211C',
    trade: '\u2122',
    alefsym: '\u2135',
    larr: '\u2190',
    uarr: '\u2191',
    rarr: '\u2192',
    darr: '\u2193',
    harr: '\u2194',
    crarr: '\u21B5',
    lArr: '\u21D0',
    uArr: '\u21D1',
    rArr: '\u21D2',
    dArr: '\u21D3',
    hArr: '\u21D4',
    forall: '\u2200',
    part: '\u2202',
    exist: '\u2203',
    empty: '\u2205',
    nabla: '\u2207',
    isin: '\u2208',
    notin: '\u2209',
    ni: '\u220B',
    prod: '\u220F',
    sum: '\u2211',
    minus: '\u2212',
    lowast: '\u2217',
    radic: '\u221A',
    prop: '\u221D',
    infin: '\u221E',
    ang: '\u2220',
    and: '\u2227',
    or: '\u2228',
    cap: '\u2229',
    cup: '\u222A',
    'int': '\u222B',
    there4: '\u2234',
    sim: '\u223C',
    cong: '\u2245',
    asymp: '\u2248',
    ne: '\u2260',
    equiv: '\u2261',
    le: '\u2264',
    ge: '\u2265',
    sub: '\u2282',
    sup: '\u2283',
    nsub: '\u2284',
    sube: '\u2286',
    supe: '\u2287',
    oplus: '\u2295',
    otimes: '\u2297',
    perp: '\u22A5',
    sdot: '\u22C5',
    lceil: '\u2308',
    rceil: '\u2309',
    lfloor: '\u230A',
    rfloor: '\u230B',
    lang: '\u2329',
    rang: '\u232A',
    loz: '\u25CA',
    spades: '\u2660',
    clubs: '\u2663',
    hearts: '\u2665',
    diams: '\u2666'
};

const hexNumber = /^[\da-fA-F]+$/;
const decimalNumber = /^\d+$/;
// Transforms JSX element name to string.
function getQualifiedJSXName(object) {
    if (!object)
        return object;
    if (object.type === 'JSXIdentifier')
        return object.name;
    if (object.type === 'JSXNamespacedName')
        return object.namespace.name + ':' + object.name.name;
    if (object.type === 'JSXMemberExpression')
        return getQualifiedJSXName(object.object) + '.' +
            getQualifiedJSXName(object.property);
}
/**
 *
 * {
 *       allowNamespaces: options.allowNamespaces !== false,
 *       allowNamespacedObjects: !!options.allowNamespacedObjects
 *     }
 * */
function generateJsxParser(acorn, acornTypeScript, Parser, jsxOptions) {
    const tt = acorn.tokTypes;
    const tok = acornTypeScript.tokTypes;
    const isNewLine = acorn.isNewLine;
    const isIdentifierChar = acorn.isIdentifierChar;
    const options = {
        allowNamespaces: (Boolean(jsxOptions === null || jsxOptions === void 0 ? void 0 : jsxOptions.allowNamespaces)) !== false,
        allowNamespacedObjects: !!(jsxOptions === null || jsxOptions === void 0 ? void 0 : jsxOptions.allowNamespacedObjects)
    };
    return class JsxParser extends Parser {
        // Reads inline JSX contents token.
        jsx_readToken() {
            let out = '', chunkStart = this.pos;
            for (;;) {
                if (this.pos >= this.input.length)
                    this.raise(this.start, 'Unterminated JSX contents');
                let ch = this.input.charCodeAt(this.pos);
                switch (ch) {
                    case 60: // '<'
                    case 123: // '{'
                        if (this.pos === this.start) {
                            if (ch === 60 && this.exprAllowed) {
                                ++this.pos;
                                return this.finishToken(tok.jsxTagStart);
                            }
                            return this.getTokenFromCode(ch);
                        }
                        out += this.input.slice(chunkStart, this.pos);
                        return this.finishToken(tok.jsxText, out);
                    case 38: // '&'
                        out += this.input.slice(chunkStart, this.pos);
                        out += this.jsx_readEntity();
                        chunkStart = this.pos;
                        break;
                    case 62: // '>'
                    case 125: // '}'
                        this.raise(this.pos, 'Unexpected token `' + this.input[this.pos] + '`. Did you mean `' +
                            (ch === 62 ? '&gt;' : '&rbrace;') + '` or ' + '`{"' + this.input[this.pos] + '"}' + '`?');
                    default:
                        if (isNewLine(ch)) {
                            out += this.input.slice(chunkStart, this.pos);
                            out += this.jsx_readNewLine(true);
                            chunkStart = this.pos;
                        }
                        else {
                            ++this.pos;
                        }
                }
            }
        }
        jsx_readNewLine(normalizeCRLF) {
            let ch = this.input.charCodeAt(this.pos);
            let out;
            ++this.pos;
            if (ch === 13 && this.input.charCodeAt(this.pos) === 10) {
                ++this.pos;
                out = normalizeCRLF ? '\n' : '\r\n';
            }
            else {
                out = String.fromCharCode(ch);
            }
            if (this.options.locations) {
                ++this.curLine;
                this.lineStart = this.pos;
            }
            return out;
        }
        jsx_readString(quote) {
            let out = '', chunkStart = ++this.pos;
            for (;;) {
                if (this.pos >= this.input.length)
                    this.raise(this.start, 'Unterminated string constant');
                let ch = this.input.charCodeAt(this.pos);
                if (ch === quote)
                    break;
                if (ch === 38) { // '&'
                    out += this.input.slice(chunkStart, this.pos);
                    out += this.jsx_readEntity();
                    chunkStart = this.pos;
                }
                else if (isNewLine(ch)) {
                    out += this.input.slice(chunkStart, this.pos);
                    out += this.jsx_readNewLine(false);
                    chunkStart = this.pos;
                }
                else {
                    ++this.pos;
                }
            }
            out += this.input.slice(chunkStart, this.pos++);
            return this.finishToken(tt.string, out);
        }
        jsx_readEntity() {
            let str = '', count = 0, entity;
            let ch = this.input[this.pos];
            if (ch !== '&')
                this.raise(this.pos, 'Entity must start with an ampersand');
            let startPos = ++this.pos;
            while (this.pos < this.input.length && count++ < 10) {
                ch = this.input[this.pos++];
                if (ch === ';') {
                    if (str[0] === '#') {
                        if (str[1] === 'x') {
                            str = str.substr(2);
                            if (hexNumber.test(str))
                                entity = String.fromCharCode(parseInt(str, 16));
                        }
                        else {
                            str = str.substr(1);
                            if (decimalNumber.test(str))
                                entity = String.fromCharCode(parseInt(str, 10));
                        }
                    }
                    else {
                        entity = XHTMLEntities[str];
                    }
                    break;
                }
                str += ch;
            }
            if (!entity) {
                this.pos = startPos;
                return '&';
            }
            return entity;
        }
        // Read a JSX identifier (valid tag or attribute name).
        //
        // Optimized version since JSX identifiers can't contain
        // escape characters and so can be read as single slice.
        // Also assumes that first character was already checked
        // by isIdentifierStart in readToken.
        jsx_readWord() {
            let ch, start = this.pos;
            do {
                ch = this.input.charCodeAt(++this.pos);
            } while (isIdentifierChar(ch) || ch === 45); // '-'
            return this.finishToken(tok.jsxName, this.input.slice(start, this.pos));
        }
        // Parse next token as JSX identifier
        jsx_parseIdentifier() {
            let node = this.startNode();
            if (this.type === tok.jsxName)
                node.name = this.value;
            else if (this.type.keyword)
                node.name = this.type.keyword;
            else
                this.unexpected();
            this.next();
            return this.finishNode(node, 'JSXIdentifier');
        }
        // Parse namespaced identifier.
        jsx_parseNamespacedName() {
            let startPos = this.start, startLoc = this.startLoc;
            let name = this.jsx_parseIdentifier();
            if (!options.allowNamespaces || !this.eat(tt.colon))
                return name;
            var node = this.startNodeAt(startPos, startLoc);
            node.namespace = name;
            node.name = this.jsx_parseIdentifier();
            return this.finishNode(node, 'JSXNamespacedName');
        }
        // Parses element name in any form - namespaced, member
        // or single identifier.
        jsx_parseElementName() {
            if (this.type === tok.jsxTagEnd)
                return '';
            let startPos = this.start, startLoc = this.startLoc;
            let node = this.jsx_parseNamespacedName();
            if (this.type === tt.dot && node.type === 'JSXNamespacedName' && !options.allowNamespacedObjects) {
                this.unexpected();
            }
            while (this.eat(tt.dot)) {
                let newNode = this.startNodeAt(startPos, startLoc);
                newNode.object = node;
                newNode.property = this.jsx_parseIdentifier();
                node = this.finishNode(newNode, 'JSXMemberExpression');
            }
            return node;
        }
        // Parses any type of JSX attribute value.
        jsx_parseAttributeValue() {
            switch (this.type) {
                case tt.braceL:
                    let node = this.jsx_parseExpressionContainer();
                    if (node.expression.type === 'JSXEmptyExpression')
                        this.raise(node.start, 'JSX attributes must only be assigned a non-empty expression');
                    return node;
                case tok.jsxTagStart:
                case tt.string:
                    return this.parseExprAtom();
                default:
                    this.raise(this.start, 'JSX value should be either an expression or a quoted JSX text');
            }
        }
        // JSXEmptyExpression is unique type since it doesn't actually parse anything,
        // and so it should start at the end of last read token (left brace) and finish
        // at the beginning of the next one (right brace).
        jsx_parseEmptyExpression() {
            let node = this.startNodeAt(this.lastTokEnd, this.lastTokEndLoc);
            return this.finishNodeAt(node, 'JSXEmptyExpression', this.start, this.startLoc);
        }
        // Parses JSX expression enclosed into curly brackets.
        jsx_parseExpressionContainer() {
            let node = this.startNode();
            this.next();
            node.expression = this.type === tt.braceR
                ? this.jsx_parseEmptyExpression()
                : this.parseExpression();
            this.expect(tt.braceR);
            return this.finishNode(node, 'JSXExpressionContainer');
        }
        // Parses following JSX attribute name-value pair.
        jsx_parseAttribute() {
            let node = this.startNode();
            if (this.eat(tt.braceL)) {
                this.expect(tt.ellipsis);
                node.argument = this.parseMaybeAssign();
                this.expect(tt.braceR);
                return this.finishNode(node, 'JSXSpreadAttribute');
            }
            node.name = this.jsx_parseNamespacedName();
            node.value = this.eat(tt.eq) ? this.jsx_parseAttributeValue() : null;
            return this.finishNode(node, 'JSXAttribute');
        }
        // Parses JSX opening tag starting after '<'.
        jsx_parseOpeningElementAt(startPos, startLoc) {
            let node = this.startNodeAt(startPos, startLoc);
            node.attributes = [];
            let nodeName = this.jsx_parseElementName();
            if (nodeName)
                node.name = nodeName;
            while (this.type !== tt.slash && this.type !== tok.jsxTagEnd)
                node.attributes.push(this.jsx_parseAttribute());
            node.selfClosing = this.eat(tt.slash);
            this.expect(tok.jsxTagEnd);
            return this.finishNode(node, nodeName ? 'JSXOpeningElement' : 'JSXOpeningFragment');
        }
        // Parses JSX closing tag starting after '</'.
        jsx_parseClosingElementAt(startPos, startLoc) {
            let node = this.startNodeAt(startPos, startLoc);
            let nodeName = this.jsx_parseElementName();
            if (nodeName)
                node.name = nodeName;
            this.expect(tok.jsxTagEnd);
            return this.finishNode(node, nodeName ? 'JSXClosingElement' : 'JSXClosingFragment');
        }
        // Parses entire JSX element, including it's opening tag
        // (starting after '<'), attributes, contents and closing tag.
        jsx_parseElementAt(startPos, startLoc) {
            let node = this.startNodeAt(startPos, startLoc);
            let children = [];
            let openingElement = this.jsx_parseOpeningElementAt(startPos, startLoc);
            let closingElement = null;
            if (!openingElement.selfClosing) {
                contents: for (;;) {
                    switch (this.type) {
                        case tok.jsxTagStart:
                            startPos = this.start;
                            startLoc = this.startLoc;
                            this.next();
                            if (this.eat(tt.slash)) {
                                closingElement = this.jsx_parseClosingElementAt(startPos, startLoc);
                                break contents;
                            }
                            children.push(this.jsx_parseElementAt(startPos, startLoc));
                            break;
                        case tok.jsxText:
                            children.push(this.parseExprAtom());
                            break;
                        case tt.braceL:
                            children.push(this.jsx_parseExpressionContainer());
                            break;
                        default:
                            this.unexpected();
                    }
                }
                if (getQualifiedJSXName(closingElement.name) !== getQualifiedJSXName(openingElement.name)) {
                    this.raise(closingElement.start, 'Expected corresponding JSX closing tag for <' + getQualifiedJSXName(openingElement.name) + '>');
                }
            }
            let fragmentOrElement = openingElement.name ? 'Element' : 'Fragment';
            node['opening' + fragmentOrElement] = openingElement;
            node['closing' + fragmentOrElement] = closingElement;
            node.children = children;
            if (this.type === tt.relational && this.value === '<') {
                this.raise(this.start, 'Adjacent JSX elements must be wrapped in an enclosing tag');
            }
            return this.finishNode(node, 'JSX' + fragmentOrElement);
        }
        // Parse JSX text
        jsx_parseText() {
            let node = this.parseLiteral(this.value);
            node.type = 'JSXText';
            return node;
        }
        // Parses entire JSX element from current position.
        jsx_parseElement() {
            let startPos = this.start, startLoc = this.startLoc;
            this.next();
            return this.jsx_parseElementAt(startPos, startLoc);
        }
    };
}

function generateParseImportAssertions(Parse, acornTypeScript, acorn) {
    const { tokTypes } = acornTypeScript;
    const { tokTypes: tt } = acorn;
    return class ImportAttributes extends Parse {
        parseMaybeImportAttributes(node) {
            // import assertions
            if (this.type === tt._with || this.type === tokTypes.assert) {
                this.next();
                const attributes = this.parseImportAttributes();
                if (attributes) {
                    node.attributes = attributes;
                }
            }
        }
        parseImportAttributes() {
            this.expect(tt.braceL);
            const attrs = this.parseWithEntries();
            this.expect(tt.braceR);
            return attrs;
        }
        parseWithEntries() {
            const attrs = [];
            const attrNames = new Set();
            do {
                if (this.type === tt.braceR) {
                    break;
                }
                const node = this.startNode();
                // parse withionKey : IdentifierName, StringLiteral
                let withionKeyNode;
                if (this.type === tt.string) {
                    withionKeyNode = this.parseLiteral(this.value);
                }
                else {
                    withionKeyNode = this.parseIdent(true);
                }
                this.next();
                node.key = withionKeyNode;
                // check if we already have an entry for an attribute
                // if a duplicate entry is found, throw an error
                // for now this logic will come into play only when someone declares `type` twice
                if (attrNames.has(node.key.name)) {
                    this.raise(this.pos, 'Duplicated key in attributes');
                }
                attrNames.add(node.key.name);
                if (this.type !== tt.string) {
                    this.raise(this.pos, 'Only string is supported as an attribute value');
                }
                node.value = this.parseLiteral(this.value);
                attrs.push(this.finishNode(node, 'ImportAttribute'));
            } while (this.eat(tt.comma));
            return attrs;
        }
    };
}

const skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
function assert(x) {
    if (!x) {
        throw new Error('Assert fail');
    }
}
function tsIsClassAccessor(modifier) {
    return modifier === 'accessor';
}
function tsIsVarianceAnnotations(modifier) {
    return modifier === 'in' || modifier === 'out';
}
const FUNC_STATEMENT = 1, FUNC_HANGING_STATEMENT = 2, FUNC_NULLABLE_ID = 4;
const acornScope = {
    SCOPE_TOP: 1,
    SCOPE_FUNCTION: 2,
    SCOPE_ASYNC: 4,
    SCOPE_GENERATOR: 8,
    SCOPE_ARROW: 16,
    SCOPE_SIMPLE_CATCH: 32,
    SCOPE_SUPER: 64,
    SCOPE_DIRECT_SUPER: 128,
    SCOPE_CLASS_STATIC_BLOCK: 256,
    SCOPE_VAR: 256,
    BIND_NONE: 0,
    BIND_VAR: 1,
    BIND_LEXICAL: 2,
    BIND_FUNCTION: 3,
    BIND_SIMPLE_CATCH: 4,
    BIND_OUTSIDE: 5 // Special case for function names as bound inside the
    // function
};
function functionFlags(async, generator) {
    return acornScope.SCOPE_FUNCTION | (async ? acornScope.SCOPE_ASYNC : 0) | (generator ? acornScope.SCOPE_GENERATOR : 0);
}
function isPossiblyLiteralEnum(expression) {
    if (expression.type !== 'MemberExpression')
        return false;
    const { computed, property } = expression;
    if (computed &&
        (property.type !== 'TemplateLiteral' || property.expressions.length > 0)) {
        return false;
    }
    return isUncomputedMemberExpressionChain(expression.object);
}
function isUncomputedMemberExpressionChain(expression) {
    if (expression.type === 'Identifier')
        return true;
    if (expression.type !== 'MemberExpression')
        return false;
    if (expression.computed)
        return false;
    return isUncomputedMemberExpressionChain(expression.object);
}
function tsIsAccessModifier(modifier) {
    return (modifier === 'private' || modifier === 'public' || modifier === 'protected');
}
function tokenCanStartExpression(token) {
    return Boolean(token.startsExpr);
}
function nonNull(x) {
    if (x == null) {
        throw new Error(`Unexpected ${x} value.`);
    }
    return x;
}
// Doesn't handle "void" or "null" because those are keywords, not identifiers.
// It also doesn't handle "intrinsic", since usually it's not a keyword.
function keywordTypeFromName(value) {
    switch (value) {
        case 'any':
            return 'TSAnyKeyword';
        case 'boolean':
            return 'TSBooleanKeyword';
        case 'bigint':
            return 'TSBigIntKeyword';
        case 'never':
            return 'TSNeverKeyword';
        case 'number':
            return 'TSNumberKeyword';
        case 'object':
            return 'TSObjectKeyword';
        case 'string':
            return 'TSStringKeyword';
        case 'symbol':
            return 'TSSymbolKeyword';
        case 'undefined':
            return 'TSUndefinedKeyword';
        case 'unknown':
            return 'TSUnknownKeyword';
        default:
            return undefined;
    }
}
function tsPlugin(options) {
    const { dts = false } = options || {};
    const disallowAmbiguousJSXLike = false;
    return function (Parser) {
        const _acorn = Parser.acorn || acornNamespace;
        const acornTypeScript = generateAcornTypeScript(_acorn);
        const tt = _acorn.tokTypes;
        // @ts-ignore
        const keywordTypes = _acorn.keywordTypes;
        const isIdentifierStart = _acorn.isIdentifierStart;
        const lineBreak = _acorn.lineBreak;
        const isNewLine = _acorn.isNewLine;
        const tokContexts = _acorn.tokContexts;
        const isIdentifierChar = _acorn.isIdentifierChar;
        const { tokTypes, tokContexts: tsTokContexts, keywordsRegExp, tokenIsLiteralPropertyName, tokenIsTemplate, tokenIsTSDeclarationStart, tokenIsIdentifier, tokenIsKeywordOrIdentifier, tokenIsTSTypeOperator } = acornTypeScript;
        function nextLineBreak(code, from, end = code.length) {
            for (let i = from; i < end; i++) {
                let next = code.charCodeAt(i);
                if (isNewLine(next))
                    return i < end - 1 && next === 13 && code.charCodeAt(i + 1) === 10 ? i + 2 : i + 1;
            }
            return -1;
        }
        // extend decorators
        Parser = generateParseDecorators(Parser, acornTypeScript, _acorn);
        // extend jsx
        Parser = generateJsxParser(_acorn, acornTypeScript, Parser, options === null || options === void 0 ? void 0 : options.jsx);
        // extend import asset
        Parser = generateParseImportAssertions(Parser, acornTypeScript, _acorn);
        class TypeScriptParser extends Parser {
            constructor(options, input, startPos) {
                super(options, input, startPos);
                this.preValue = null;
                this.preToken = null;
                this.isLookahead = false;
                this.isAmbientContext = false;
                this.inAbstractClass = false;
                this.inType = false;
                this.inDisallowConditionalTypesContext = false;
                this.maybeInArrowParameters = false;
                this.shouldParseArrowReturnType = undefined;
                this.shouldParseAsyncArrowReturnType = undefined;
                this.decoratorStack = [[]];
                /**
                 * we will only parse one import node or export node at same time.
                 * default kind is undefined
                 * */
                this.importOrExportOuterKind = undefined;
                this.tsParseConstModifier = this.tsParseModifiers.bind(this, {
                    allowedModifiers: ['const'],
                    // for better error recovery
                    disallowedModifiers: ['in', 'out'],
                    errorTemplate: TypeScriptError.InvalidModifierOnTypeParameterPositions
                });
            }
            // support in Class static
            static get acornTypeScript() {
                return acornTypeScript;
            }
            // support in runtime, get acornTypeScript be this
            get acornTypeScript() {
                return acornTypeScript;
            }
            getTokenFromCodeInType(code) {
                if (code === 62) {
                    return this.finishOp(tt.relational, 1);
                }
                if (code === 60) {
                    return this.finishOp(tt.relational, 1);
                }
                return super.getTokenFromCode(code);
            }
            readToken(code) {
                if (!this.inType) {
                    let context = this.curContext();
                    if (context === tsTokContexts.tc_expr)
                        return this.jsx_readToken();
                    if (context === tsTokContexts.tc_oTag || context === tsTokContexts.tc_cTag) {
                        if (isIdentifierStart(code))
                            return this.jsx_readWord();
                        if (code == 62) {
                            ++this.pos;
                            return this.finishToken(tokTypes.jsxTagEnd);
                        }
                        if ((code === 34 || code === 39) && context == tsTokContexts.tc_oTag)
                            return this.jsx_readString(code);
                    }
                    if (code === 60 && this.exprAllowed && this.input.charCodeAt(this.pos + 1) !== 33) {
                        ++this.pos;
                        return this.finishToken(tokTypes.jsxTagStart);
                    }
                }
                return super.readToken(code);
            }
            getTokenFromCode(code) {
                if (this.inType) {
                    return this.getTokenFromCodeInType(code);
                }
                if (code === 64) {
                    ++this.pos;
                    return this.finishToken(tokTypes.at);
                }
                return super.getTokenFromCode(code);
            }
            isAbstractClass() {
                return (this.ts_isContextual(tokTypes.abstract) && this.lookahead().type === tt._class);
            }
            finishNode(node, type) {
                if (node.type !== '' && node.end !== 0) {
                    return node;
                }
                return super.finishNode(node, type);
            }
            // tryParse will clone parser state.
            // It is expensive and should be used with cautions
            tryParse(fn, oldState = this.cloneCurLookaheadState()) {
                const abortSignal = { node: null };
                try {
                    const node = fn((node = null) => {
                        abortSignal.node = node;
                        throw abortSignal;
                    });
                    return {
                        node,
                        error: null,
                        thrown: false,
                        aborted: false,
                        failState: null
                    };
                }
                catch (error) {
                    const failState = this.getCurLookaheadState();
                    this.setLookaheadState(oldState);
                    if (error instanceof SyntaxError) {
                        return {
                            node: null,
                            error,
                            thrown: true,
                            aborted: false,
                            failState
                        };
                    }
                    if (error === abortSignal) {
                        return {
                            node: abortSignal.node,
                            error: null,
                            thrown: false,
                            aborted: true,
                            failState
                        };
                    }
                    throw error;
                }
            }
            setOptionalParametersError(refExpressionErrors, resultError) {
                var _a;
                refExpressionErrors.optionalParametersLoc =
                    (_a = resultError === null || resultError === void 0 ? void 0 : resultError.loc) !== null && _a !== void 0 ? _a : this.startLoc;
            }
            // used after we have finished parsing types
            reScan_lt_gt() {
                if (this.type === tt.relational) {
                    this.pos -= 1;
                    this.readToken_lt_gt(this.fullCharCodeAtPos());
                }
            }
            reScan_lt() {
                const { type } = this;
                if (type === tt.bitShift) {
                    this.pos -= 2;
                    this.finishOp(tt.relational, 1);
                    return tt.relational;
                }
                return type;
            }
            resetEndLocation(node, endLoc = this.lastTokEndLoc) {
                node.end = endLoc.column;
                node.loc.end = endLoc;
                if (this.options.ranges)
                    node.range[1] = endLoc.column;
            }
            startNodeAtNode(type) {
                return super.startNodeAt(type.start, type.loc.start);
            }
            nextTokenStart() {
                return this.nextTokenStartSince(this.pos);
            }
            tsHasSomeModifiers(member, modifiers) {
                return modifiers.some(modifier => {
                    if (tsIsAccessModifier(modifier)) {
                        return member.accessibility === modifier;
                    }
                    return !!member[modifier];
                });
            }
            tsIsStartOfStaticBlocks() {
                return (this.isContextual('static') &&
                    this.lookaheadCharCode() === 123);
            }
            tsCheckForInvalidTypeCasts(items) {
                items.forEach(node => {
                    if ((node === null || node === void 0 ? void 0 : node.type) === 'TSTypeCastExpression') {
                        this.raise(node.typeAnnotation.start, TypeScriptError.UnexpectedTypeAnnotation);
                    }
                });
            }
            atPossibleAsyncArrow(base) {
                return (base.type === 'Identifier' &&
                    base.name === 'async' &&
                    this.lastTokEndLoc.column === base.end &&
                    !this.canInsertSemicolon() &&
                    base.end - base.start === 5 &&
                    base.start === this.potentialArrowAt);
            }
            tsIsIdentifier() {
                // TODO: actually a bit more complex in TypeScript, but shouldn't matter.
                // See https://github.com/Microsoft/TypeScript/issues/15008
                return tokenIsIdentifier(this.type);
            }
            tsTryParseTypeOrTypePredicateAnnotation() {
                return this.match(tt.colon)
                    ? this.tsParseTypeOrTypePredicateAnnotation(tt.colon)
                    : undefined;
            }
            tsTryParseGenericAsyncArrowFunction(startPos, startLoc, forInit) {
                if (!this.match(tt.relational)) {
                    return undefined;
                }
                const oldMaybeInArrowParameters = this.maybeInArrowParameters;
                this.maybeInArrowParameters = true;
                const res = this.tsTryParseAndCatch(() => {
                    const node = this.startNodeAt(startPos, startLoc);
                    node.typeParameters = this.tsParseTypeParameters();
                    // Don't use overloaded parseFunctionParams which would look for "<" again.
                    super.parseFunctionParams(node);
                    node.returnType = this.tsTryParseTypeOrTypePredicateAnnotation();
                    this.expect(tt.arrow);
                    return node;
                });
                this.maybeInArrowParameters = oldMaybeInArrowParameters;
                if (!res) {
                    return undefined;
                }
                return super.parseArrowExpression(res, 
                /* params are already set */ null, 
                /* async */ true, 
                /* forInit */ forInit);
            }
            // Used when parsing type arguments from ES productions, where the first token
            // has been created without state.inType. Thus we need to rescan the lt token.
            tsParseTypeArgumentsInExpression() {
                if (this.reScan_lt() !== tt.relational) {
                    return undefined;
                }
                return this.tsParseTypeArguments();
            }
            tsInNoContext(cb) {
                const oldContext = this.context;
                this.context = [oldContext[0]];
                try {
                    return cb();
                }
                finally {
                    this.context = oldContext;
                }
            }
            tsTryParseTypeAnnotation() {
                return this.match(tt.colon) ? this.tsParseTypeAnnotation() : undefined;
            }
            isUnparsedContextual(nameStart, name) {
                const nameEnd = nameStart + name.length;
                if (this.input.slice(nameStart, nameEnd) === name) {
                    const nextCh = this.input.charCodeAt(nameEnd);
                    return !(isIdentifierChar(nextCh) ||
                        // check if `nextCh is between 0xd800 - 0xdbff,
                        // if `nextCh` is NaN, `NaN & 0xfc00` is 0, the function
                        // returns true
                        (nextCh & 0xfc00) === 0xd800);
                }
                return false;
            }
            isAbstractConstructorSignature() {
                return (this.ts_isContextual(tokTypes.abstract) && this.lookahead().type === tt._new);
            }
            nextTokenStartSince(pos) {
                skipWhiteSpace.lastIndex = pos;
                return skipWhiteSpace.test(this.input) ? skipWhiteSpace.lastIndex : pos;
            }
            lookaheadCharCode() {
                return this.input.charCodeAt(this.nextTokenStart());
            }
            compareLookaheadState(state, state2) {
                for (const key of Object.keys(state)) {
                    if (state[key] !== state2[key])
                        return false;
                }
                return true;
            }
            createLookaheadState() {
                this.value = null;
                this.context = [this.curContext()];
            }
            getCurLookaheadState() {
                return {
                    endLoc: this.endLoc,
                    lastTokEnd: this.lastTokEnd,
                    lastTokStart: this.lastTokStart,
                    lastTokStartLoc: this.lastTokStartLoc,
                    pos: this.pos,
                    value: this.value,
                    type: this.type,
                    start: this.start,
                    end: this.end,
                    context: this.context,
                    startLoc: this.startLoc,
                    lastTokEndLoc: this.lastTokEndLoc,
                    curLine: this.curLine,
                    lineStart: this.lineStart,
                    curPosition: this.curPosition,
                    containsEsc: this.containsEsc
                };
            }
            cloneCurLookaheadState() {
                return {
                    pos: this.pos,
                    value: this.value,
                    type: this.type,
                    start: this.start,
                    end: this.end,
                    context: this.context && this.context.slice(),
                    startLoc: this.startLoc,
                    lastTokEndLoc: this.lastTokEndLoc,
                    endLoc: this.endLoc,
                    lastTokEnd: this.lastTokEnd,
                    lastTokStart: this.lastTokStart,
                    lastTokStartLoc: this.lastTokStartLoc,
                    curLine: this.curLine,
                    lineStart: this.lineStart,
                    curPosition: this.curPosition,
                    containsEsc: this.containsEsc
                };
            }
            setLookaheadState(state) {
                this.pos = state.pos;
                this.value = state.value;
                this.endLoc = state.endLoc;
                this.lastTokEnd = state.lastTokEnd;
                this.lastTokStart = state.lastTokStart;
                this.lastTokStartLoc = state.lastTokStartLoc;
                this.type = state.type;
                this.start = state.start;
                this.end = state.end;
                this.context = state.context;
                this.startLoc = state.startLoc;
                this.lastTokEndLoc = state.lastTokEndLoc;
                this.curLine = state.curLine;
                this.lineStart = state.lineStart;
                this.curPosition = state.curPosition;
                this.containsEsc = state.containsEsc;
            }
            // Utilities
            tsLookAhead(f) {
                const state = this.getCurLookaheadState();
                const res = f();
                this.setLookaheadState(state);
                return res;
            }
            lookahead(number) {
                const oldState = this.getCurLookaheadState();
                this.createLookaheadState();
                this.isLookahead = true;
                if (number !== undefined) {
                    for (let i = 0; i < number; i++) {
                        this.nextToken();
                    }
                }
                else {
                    this.nextToken();
                }
                this.isLookahead = false;
                const curState = this.getCurLookaheadState();
                this.setLookaheadState(oldState);
                return curState;
            }
            readWord() {
                let word = this.readWord1();
                let type = tt.name;
                if (this.keywords.test(word)) {
                    type = keywordTypes[word];
                }
                else if (new RegExp(keywordsRegExp).test(word)) {
                    type = tokTypes[word];
                }
                return this.finishToken(type, word);
            }
            skipBlockComment() {
                let startLoc;
                if (!this.isLookahead)
                    startLoc = this.options.onComment && this.curPosition();
                let start = this.pos, end = this.input.indexOf('*/', this.pos += 2);
                if (end === -1)
                    this.raise(this.pos - 2, 'Unterminated comment');
                this.pos = end + 2;
                if (this.options.locations) {
                    for (let nextBreak, pos = start; (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1;) {
                        ++this.curLine;
                        pos = this.lineStart = nextBreak;
                    }
                }
                if (this.isLookahead)
                    return;
                if (this.options.onComment) {
                    this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos, startLoc, this.curPosition());
                }
            }
            skipLineComment(startSkip) {
                let start = this.pos;
                let startLoc;
                if (!this.isLookahead)
                    startLoc = this.options.onComment && this.curPosition();
                let ch = this.input.charCodeAt(this.pos += startSkip);
                while (this.pos < this.input.length && !isNewLine(ch)) {
                    ch = this.input.charCodeAt(++this.pos);
                }
                if (this.isLookahead)
                    return;
                if (this.options.onComment)
                    this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos, startLoc, this.curPosition());
            }
            finishToken(type, val) {
                this.preValue = this.value;
                this.preToken = this.type;
                this.end = this.pos;
                if (this.options.locations)
                    this.endLoc = this.curPosition();
                let prevType = this.type;
                this.type = type;
                this.value = val;
                if (!this.isLookahead) {
                    this.updateContext(prevType);
                }
            }
            resetStartLocation(node, start, startLoc) {
                node.start = start;
                node.loc.start = startLoc;
                if (this.options.ranges)
                    node.range[0] = start;
            }
            isLineTerminator() {
                return this.eat(tt.semi) || super.canInsertSemicolon();
            }
            hasFollowingLineBreak() {
                skipWhiteSpaceToLineBreak.lastIndex = this.end;
                return skipWhiteSpaceToLineBreak.test(this.input);
            }
            addExtra(node, key, value, enumerable = true) {
                if (!node)
                    return;
                const extra = (node.extra = node.extra || {});
                if (enumerable) {
                    extra[key] = value;
                }
                else {
                    Object.defineProperty(extra, key, { enumerable, value });
                }
            }
            /**
             * Test if current token is a literal property name
             * https://tc39.es/ecma262/#prod-LiteralPropertyName
             * LiteralPropertyName:
             *   IdentifierName
             *   StringLiteral
             *   NumericLiteral
             *   BigIntLiteral
             */
            isLiteralPropertyName() {
                return tokenIsLiteralPropertyName(this.type);
            }
            hasPrecedingLineBreak() {
                return lineBreak.test(this.input.slice(this.lastTokEndLoc.index, this.start));
            }
            createIdentifier(node, name) {
                node.name = name;
                return this.finishNode(node, 'Identifier');
            }
            /**
             * Reset the start location of node to the start location of locationNode
             */
            resetStartLocationFromNode(node, locationNode) {
                this.resetStartLocation(node, locationNode.start, locationNode.loc.start);
            }
            // This is used in flow and typescript plugin
            // Determine whether a parameter is a this param
            isThisParam(param) {
                return param.type === 'Identifier' && param.name === 'this';
            }
            isLookaheadContextual(name) {
                const next = this.nextTokenStart();
                return this.isUnparsedContextual(next, name);
            }
            /**
             * ts type isContextual
             * @param {TokenType} type
             * @param {TokenType} token
             * @returns {boolean}
             * */
            ts_type_isContextual(type, token) {
                return type === token && !this.containsEsc;
            }
            /**
             * ts isContextual
             * @param {TokenType} token
             * @returns {boolean}
             * */
            ts_isContextual(token) {
                return this.type === token && !this.containsEsc;
            }
            ts_isContextualWithState(state, token) {
                return state.type === token && !state.containsEsc;
            }
            isContextualWithState(keyword, state) {
                return state.type === tt.name && state.value === keyword && !state.containsEsc;
            }
            tsIsStartOfMappedType() {
                this.next();
                if (this.eat(tt.plusMin)) {
                    return this.ts_isContextual(tokTypes.readonly);
                }
                if (this.ts_isContextual(tokTypes.readonly)) {
                    this.next();
                }
                if (!this.match(tt.bracketL)) {
                    return false;
                }
                this.next();
                if (!this.tsIsIdentifier()) {
                    return false;
                }
                this.next();
                return this.match(tt._in);
            }
            tsInDisallowConditionalTypesContext(cb) {
                const oldInDisallowConditionalTypesContext = this.inDisallowConditionalTypesContext;
                this.inDisallowConditionalTypesContext = true;
                try {
                    return cb();
                }
                finally {
                    this.inDisallowConditionalTypesContext =
                        oldInDisallowConditionalTypesContext;
                }
            }
            tsTryParseType() {
                return this.tsEatThenParseType(tt.colon);
            }
            /**
             * Whether current token matches given type
             *
             * @param {TokenType} type
             * @returns {boolean}
             * @memberof Tokenizer
             */
            match(type) {
                return this.type === type;
            }
            matchJsx(type) {
                return this.type === acornTypeScript.tokTypes[type];
            }
            ts_eatWithState(type, nextCount, state) {
                const targetType = state.type;
                if (type === targetType) {
                    for (let i = 0; i < nextCount; i++) {
                        this.next();
                    }
                    return true;
                }
                else {
                    return false;
                }
            }
            ts_eatContextualWithState(name, nextCount, state) {
                if (keywordsRegExp.test(name)) {
                    if (this.ts_isContextualWithState(state, tokTypes[name])) {
                        for (let i = 0; i < nextCount; i++) {
                            this.next();
                        }
                        return true;
                    }
                    return false;
                }
                else {
                    if (!this.isContextualWithState(name, state))
                        return false;
                    for (let i = 0; i < nextCount; i++) {
                        this.next();
                    }
                    return true;
                }
            }
            canHaveLeadingDecorator() {
                return this.match(tt._class);
            }
            eatContextual(name) {
                if (keywordsRegExp.test(name)) {
                    if (this.ts_isContextual(tokTypes[name])) {
                        this.next();
                        return true;
                    }
                    return false;
                }
                else {
                    return super.eatContextual(name);
                }
            }
            tsIsExternalModuleReference() {
                return (this.isContextual('require') &&
                    this.lookaheadCharCode() === 40);
            }
            tsParseExternalModuleReference() {
                const node = this.startNode();
                this.expectContextual('require');
                this.expect(tt.parenL);
                if (!this.match(tt.string)) {
                    this.unexpected();
                }
                // For compatibility to estree we cannot call parseLiteral directly here
                node.expression = this.parseExprAtom();
                this.expect(tt.parenR);
                return this.finishNode(node, 'TSExternalModuleReference');
            }
            tsParseEntityName(allowReservedWords = true) {
                let entity = this.parseIdent(allowReservedWords);
                while (this.eat(tt.dot)) {
                    const node = this.startNodeAtNode(entity);
                    node.left = entity;
                    node.right = this.parseIdent(allowReservedWords);
                    entity = this.finishNode(node, 'TSQualifiedName');
                }
                return entity;
            }
            tsParseEnumMember() {
                const node = this.startNode();
                // Computed property names are grammar errors in an enum, so accept just string literal or identifier.
                node.id = this.match(tt.string)
                    ? this.parseLiteral(this.value)
                    : this.parseIdent(/* liberal */ true);
                if (this.eat(tt.eq)) {
                    node.initializer = this.parseMaybeAssign();
                }
                return this.finishNode(node, 'TSEnumMember');
            }
            tsParseEnumDeclaration(node, properties = {}) {
                if (properties.const)
                    node.const = true;
                if (properties.declare)
                    node.declare = true;
                this.expectContextual('enum');
                node.id = this.parseIdent();
                this.checkLValSimple(node.id);
                this.expect(tt.braceL);
                node.members = this.tsParseDelimitedList('EnumMembers', this.tsParseEnumMember.bind(this));
                this.expect(tt.braceR);
                return this.finishNode(node, 'TSEnumDeclaration');
            }
            tsParseModuleBlock() {
                const node = this.startNode();
                super.enterScope(TS_SCOPE_OTHER);
                this.expect(tt.braceL);
                // Inside of a module block is considered "top-level", meaning it can have imports and exports.
                node.body = [];
                while (this.type !== tt.braceR) {
                    let stmt = this.parseStatement(null, true);
                    node.body.push(stmt);
                }
                this.next();
                super.exitScope();
                return this.finishNode(node, 'TSModuleBlock');
            }
            tsParseAmbientExternalModuleDeclaration(node) {
                if (this.ts_isContextual(tokTypes.global)) {
                    node.global = true;
                    node.id = this.parseIdent();
                }
                else if (this.match(tt.string)) {
                    node.id = this.parseLiteral(this.value);
                }
                else {
                    this.unexpected();
                }
                if (this.match(tt.braceL)) {
                    super.enterScope(TS_SCOPE_TS_MODULE);
                    node.body = this.tsParseModuleBlock();
                    super.exitScope();
                }
                else {
                    super.semicolon();
                }
                return this.finishNode(node, 'TSModuleDeclaration');
            }
            tsTryParseDeclare(nany) {
                if (this.isLineTerminator()) {
                    return;
                }
                let starttype = this.type;
                let kind;
                if (this.isContextual('let')) {
                    starttype = tt._var;
                    kind = 'let';
                }
                return this.tsInAmbientContext(() => {
                    if (starttype === tt._function) {
                        nany.declare = true;
                        return this.parseFunctionStatement(nany, 
                        /* async */ false, 
                        /* declarationPosition */ true);
                    }
                    if (starttype === tt._class) {
                        // While this is also set by tsParseExpressionStatement, we need to set it
                        // before parsing the class declaration to know how to register it in the scope.
                        nany.declare = true;
                        return this.parseClass(nany, true);
                    }
                    if (starttype === tokTypes.enum) {
                        return this.tsParseEnumDeclaration(nany, { declare: true });
                    }
                    if (starttype === tokTypes.global) {
                        return this.tsParseAmbientExternalModuleDeclaration(nany);
                    }
                    if (starttype === tt._const || starttype === tt._var) {
                        if (!this.match(tt._const) || !this.isLookaheadContextual('enum')) {
                            nany.declare = true;
                            return this.parseVarStatement(nany, kind || this.value, true);
                        }
                        // `const enum = 0;` not allowed because "enum" is a strict mode reserved word.
                        this.expect(tt._const);
                        return this.tsParseEnumDeclaration(nany, {
                            const: true,
                            declare: true
                        });
                    }
                    if (starttype === tokTypes.interface) {
                        const result = this.tsParseInterfaceDeclaration(nany, {
                            declare: true
                        });
                        if (result)
                            return result;
                    }
                    if (tokenIsIdentifier(starttype)) {
                        return this.tsParseDeclaration(nany, this.value, 
                        /* next */ true);
                    }
                });
            }
            tsIsListTerminator(kind) {
                switch (kind) {
                    case 'EnumMembers':
                    case 'TypeMembers':
                        return this.match(tt.braceR);
                    case 'HeritageClauseElement':
                        return this.match(tt.braceL);
                    case 'TupleElementTypes':
                        return this.match(tt.bracketR);
                    case 'TypeParametersOrArguments':
                        return this.match(tt.relational) && this.value === '>';
                }
            }
            /**
             * If !expectSuccess, returns undefined instead of failing to parse.
             * If expectSuccess, parseElement should always return a defined value.
             */
            tsParseDelimitedListWorker(kind, parseElement, expectSuccess, refTrailingCommaPos) {
                const result = [];
                let trailingCommaPos = -1;
                for (;;) {
                    if (this.tsIsListTerminator(kind)) {
                        break;
                    }
                    trailingCommaPos = -1;
                    const element = parseElement();
                    if (element == null) {
                        return undefined;
                    }
                    result.push(element);
                    if (this.eat(tt.comma)) {
                        trailingCommaPos = this.lastTokStart;
                        continue;
                    }
                    if (this.tsIsListTerminator(kind)) {
                        break;
                    }
                    if (expectSuccess) {
                        // This will fail with an error about a missing comma
                        this.expect(tt.comma);
                    }
                    return undefined;
                }
                if (refTrailingCommaPos) {
                    refTrailingCommaPos.value = trailingCommaPos;
                }
                return result;
            }
            tsParseDelimitedList(kind, parseElement, refTrailingCommaPos) {
                return nonNull(this.tsParseDelimitedListWorker(kind, parseElement, 
                /* expectSuccess */ true, refTrailingCommaPos));
            }
            tsParseBracketedList(kind, parseElement, bracket, skipFirstToken, refTrailingCommaPos) {
                if (!skipFirstToken) {
                    if (bracket) {
                        this.expect(tt.bracketL);
                    }
                    else {
                        this.expect(tt.relational);
                    }
                }
                const result = this.tsParseDelimitedList(kind, parseElement, refTrailingCommaPos);
                if (bracket) {
                    this.expect(tt.bracketR);
                }
                else {
                    this.expect(tt.relational);
                }
                return result;
            }
            tsParseTypeParameterName() {
                const typeName = this.parseIdent();
                return typeName.name;
            }
            tsEatThenParseType(token) {
                return !this.match(token) ? undefined : this.tsNextThenParseType();
            }
            tsExpectThenParseType(token) {
                return this.tsDoThenParseType(() => this.expect(token));
            }
            tsNextThenParseType() {
                return this.tsDoThenParseType(() => this.next());
            }
            tsDoThenParseType(cb) {
                return this.tsInType(() => {
                    cb();
                    return this.tsParseType();
                });
            }
            tsSkipParameterStart() {
                if (tokenIsIdentifier(this.type) || this.match(tt._this)) {
                    this.next();
                    return true;
                }
                if (this.match(tt.braceL)) {
                    // Return true if we can parse an object pattern without errors
                    try {
                        this.parseObj(true);
                        return true;
                    }
                    catch (_a) {
                        return false;
                    }
                }
                if (this.match(tt.bracketL)) {
                    this.next();
                    try {
                        this.parseBindingList(tt.bracketR, true, true);
                        return true;
                    }
                    catch (_b) {
                        return false;
                    }
                }
                return false;
            }
            tsIsUnambiguouslyStartOfFunctionType() {
                this.next();
                if (this.match(tt.parenR) || this.match(tt.ellipsis)) {
                    // ( )
                    // ( ...
                    return true;
                }
                if (this.tsSkipParameterStart()) {
                    if (this.match(tt.colon) ||
                        this.match(tt.comma) ||
                        this.match(tt.question) ||
                        this.match(tt.eq)) {
                        // ( xxx :
                        // ( xxx ,
                        // ( xxx ?
                        // ( xxx =
                        return true;
                    }
                    if (this.match(tt.parenR)) {
                        this.next();
                        if (this.match(tt.arrow)) {
                            // ( xxx ) =>
                            return true;
                        }
                    }
                }
                return false;
            }
            tsIsStartOfFunctionType() {
                if (this.match(tt.relational)) {
                    return true;
                }
                return (this.match(tt.parenL) &&
                    this.tsLookAhead(this.tsIsUnambiguouslyStartOfFunctionType.bind(this)));
            }
            tsInAllowConditionalTypesContext(cb) {
                const oldInDisallowConditionalTypesContext = this.inDisallowConditionalTypesContext;
                this.inDisallowConditionalTypesContext = false;
                try {
                    return cb();
                }
                finally {
                    this.inDisallowConditionalTypesContext =
                        oldInDisallowConditionalTypesContext;
                }
            }
            tsParseBindingListForSignature() {
                return super.parseBindingList(tt.parenR, true, true)
                    .map(pattern => {
                    if (pattern.type !== 'Identifier' &&
                        pattern.type !== 'RestElement' &&
                        pattern.type !== 'ObjectPattern' &&
                        pattern.type !== 'ArrayPattern') {
                        this.raise(pattern.start, TypeScriptError.UnsupportedSignatureParameterKind(pattern.type));
                    }
                    return pattern;
                });
            }
            tsParseTypePredicateAsserts() {
                if (this.type !== tokTypes.asserts) {
                    return false;
                }
                const containsEsc = this.containsEsc;
                this.next();
                if (!tokenIsIdentifier(this.type) && !this.match(tt._this)) {
                    return false;
                }
                if (containsEsc) {
                    this.raise(this.lastTokStart, 'Escape sequence in keyword'
                        + ' asserts');
                }
                return true;
            }
            tsParseThisTypeNode() {
                const node = this.startNode();
                this.next();
                return this.finishNode(node, 'TSThisType');
            }
            tsParseTypeAnnotation(eatColon = true, t = this.startNode()) {
                this.tsInType(() => {
                    if (eatColon)
                        this.expect(tt.colon);
                    t.typeAnnotation = this.tsParseType();
                });
                return this.finishNode(t, 'TSTypeAnnotation');
            }
            tsParseThisTypePredicate(lhs) {
                this.next();
                const node = this.startNodeAtNode(lhs);
                node.parameterName = lhs;
                node.typeAnnotation = this.tsParseTypeAnnotation(/* eatColon */ false);
                node.asserts = false;
                return this.finishNode(node, 'TSTypePredicate');
            }
            tsParseThisTypeOrThisTypePredicate() {
                const thisKeyword = this.tsParseThisTypeNode();
                if (this.isContextual('is') && !this.hasPrecedingLineBreak()) {
                    return this.tsParseThisTypePredicate(thisKeyword);
                }
                else {
                    return thisKeyword;
                }
            }
            tsParseTypePredicatePrefix() {
                const id = this.parseIdent();
                if (this.isContextual('is') && !this.hasPrecedingLineBreak()) {
                    this.next();
                    return id;
                }
            }
            tsParseTypeOrTypePredicateAnnotation(returnToken) {
                return this.tsInType(() => {
                    const t = this.startNode();
                    this.expect(returnToken);
                    const node = this.startNode();
                    const asserts = !!this.tsTryParse(this.tsParseTypePredicateAsserts.bind(this));
                    if (asserts && this.match(tt._this)) {
                        // When asserts is false, thisKeyword is handled by tsParseNonArrayType
                        // : asserts this is type
                        let thisTypePredicate = this.tsParseThisTypeOrThisTypePredicate();
                        // if it turns out to be a `TSThisType`, wrap it with `TSTypePredicate`
                        // : asserts this
                        if (thisTypePredicate.type === 'TSThisType') {
                            node.parameterName = thisTypePredicate;
                            node.asserts = true;
                            node.typeAnnotation = null;
                            thisTypePredicate = this.finishNode(node, 'TSTypePredicate');
                        }
                        else {
                            this.resetStartLocationFromNode(thisTypePredicate, node);
                            thisTypePredicate.asserts = true;
                        }
                        t.typeAnnotation = thisTypePredicate;
                        return this.finishNode(t, 'TSTypeAnnotation');
                    }
                    const typePredicateVariable = this.tsIsIdentifier() &&
                        this.tsTryParse(this.tsParseTypePredicatePrefix.bind(this));
                    if (!typePredicateVariable) {
                        if (!asserts) {
                            // : type
                            return this.tsParseTypeAnnotation(/* eatColon */ false, t);
                        }
                        // : asserts foo
                        node.parameterName = this.parseIdent();
                        node.asserts = asserts;
                        node.typeAnnotation = null;
                        t.typeAnnotation = this.finishNode(node, 'TSTypePredicate');
                        return this.finishNode(t, 'TSTypeAnnotation');
                    }
                    // : asserts foo is type
                    const type = this.tsParseTypeAnnotation(/* eatColon */ false);
                    node.parameterName = typePredicateVariable;
                    node.typeAnnotation = type;
                    node.asserts = asserts;
                    t.typeAnnotation = this.finishNode(node, 'TSTypePredicate');
                    return this.finishNode(t, 'TSTypeAnnotation');
                });
            }
            // Note: In TypeScript implementation we must provide `yieldContext` and `awaitContext`,
            // but here it's always false, because this is only used for types.
            tsFillSignature(returnToken, signature) {
                // Arrow fns *must* have return token (`=>`). Normal functions can omit it.
                const returnTokenRequired = returnToken === tt.arrow;
                // https://github.com/babel/babel/issues/9231
                const paramsKey = 'parameters';
                const returnTypeKey = 'typeAnnotation';
                signature.typeParameters = this.tsTryParseTypeParameters();
                this.expect(tt.parenL);
                signature[paramsKey] = this.tsParseBindingListForSignature();
                if (returnTokenRequired) {
                    signature[returnTypeKey] =
                        this.tsParseTypeOrTypePredicateAnnotation(returnToken);
                }
                else if (this.match(returnToken)) {
                    signature[returnTypeKey] =
                        this.tsParseTypeOrTypePredicateAnnotation(returnToken);
                }
            }
            tsTryNextParseConstantContext() {
                if (this.lookahead().type !== tt._const)
                    return null;
                this.next();
                const typeReference = this.tsParseTypeReference();
                // If the type reference has type parameters, then you are using it as a
                // type and not as a const signifier. We'll *never* be able to find this
                // name, since const isn't allowed as a type name. So in this instance we
                // get to pretend we're the type checker.
                if (typeReference.typeParameters) {
                    this.raise(typeReference.typeName.start, TypeScriptError.CannotFindName({
                        name: 'const'
                    }));
                }
                return typeReference;
            }
            tsParseFunctionOrConstructorType(type, abstract) {
                const node = this.startNode();
                if (type === 'TSConstructorType') {
                    node.abstract = !!abstract;
                    if (abstract)
                        this.next();
                    this.next(); // eat `new`
                }
                this.tsInAllowConditionalTypesContext(() => this.tsFillSignature(tt.arrow, node));
                return this.finishNode(node, type);
            }
            tsParseUnionOrIntersectionType(kind, parseConstituentType, operator) {
                const node = this.startNode();
                const hasLeadingOperator = this.eat(operator);
                const types = [];
                do {
                    types.push(parseConstituentType());
                } while (this.eat(operator));
                if (types.length === 1 && !hasLeadingOperator) {
                    return types[0];
                }
                node.types = types;
                return this.finishNode(node, kind);
            }
            tsCheckTypeAnnotationForReadOnly(node) {
                switch (node.typeAnnotation.type) {
                    case 'TSTupleType':
                    case 'TSArrayType':
                        return;
                    default:
                        this.raise(node.start, TypeScriptError.UnexpectedReadonly);
                }
            }
            tsParseTypeOperator() {
                const node = this.startNode();
                const operator = this.value;
                this.next(); // eat operator
                node.operator = operator;
                node.typeAnnotation = this.tsParseTypeOperatorOrHigher();
                if (operator === 'readonly') {
                    this.tsCheckTypeAnnotationForReadOnly(node);
                }
                return this.finishNode(node, 'TSTypeOperator');
            }
            tsParseConstraintForInferType() {
                if (this.eat(tt._extends)) {
                    const constraint = this.tsInDisallowConditionalTypesContext(() => this.tsParseType());
                    if (this.inDisallowConditionalTypesContext ||
                        !this.match(tt.question)) {
                        return constraint;
                    }
                }
            }
            tsParseInferType() {
                const node = this.startNode();
                this.expectContextual('infer');
                const typeParameter = this.startNode();
                typeParameter.name = this.tsParseTypeParameterName();
                typeParameter.constraint = this.tsTryParse(() => this.tsParseConstraintForInferType());
                node.typeParameter = this.finishNode(typeParameter, 'TSTypeParameter');
                return this.finishNode(node, 'TSInferType');
            }
            tsParseLiteralTypeNode() {
                const node = this.startNode();
                node.literal = (() => {
                    switch (this.type) {
                        case tt.num:
                        // we don't need bigint type here
                        // case tt.bigint:
                        case tt.string:
                        case tt._true:
                        case tt._false:
                            // For compatibility to estree we cannot call parseLiteral directly here
                            return this.parseExprAtom();
                        default:
                            this.unexpected();
                    }
                })();
                return this.finishNode(node, 'TSLiteralType');
            }
            tsParseImportType() {
                const node = this.startNode();
                this.expect(tt._import);
                this.expect(tt.parenL);
                if (!this.match(tt.string)) {
                    this.raise(this.start, TypeScriptError.UnsupportedImportTypeArgument);
                }
                // For compatibility to estree we cannot call parseLiteral directly here
                node.argument = this.parseExprAtom();
                this.expect(tt.parenR);
                if (this.eat(tt.dot)) {
                    // In this instance, the entity name will actually itself be a
                    // qualifier, so allow it to be a reserved word as well.
                    node.qualifier = this.tsParseEntityName();
                }
                if (this.match(tt.relational)) {
                    node.typeParameters = this.tsParseTypeArguments();
                }
                return this.finishNode(node, 'TSImportType');
            }
            tsParseTypeQuery() {
                const node = this.startNode();
                this.expect(tt._typeof);
                if (this.match(tt._import)) {
                    node.exprName = this.tsParseImportType();
                }
                else {
                    node.exprName = this.tsParseEntityName();
                }
                if (!this.hasPrecedingLineBreak() && this.match(tt.relational)) {
                    node.typeParameters = this.tsParseTypeArguments();
                }
                return this.finishNode(node, 'TSTypeQuery');
            }
            tsParseMappedTypeParameter() {
                const node = this.startNode();
                node.name = this.tsParseTypeParameterName();
                node.constraint = this.tsExpectThenParseType(tt._in);
                return this.finishNode(node, 'TSTypeParameter');
            }
            tsParseMappedType() {
                const node = this.startNode();
                this.expect(tt.braceL);
                if (this.match(tt.plusMin)) {
                    node.readonly = this.value;
                    this.next();
                    this.expectContextual('readonly');
                }
                else if (this.eatContextual('readonly')) {
                    node.readonly = true;
                }
                this.expect(tt.bracketL);
                node.typeParameter = this.tsParseMappedTypeParameter();
                node.nameType = this.eatContextual('as') ? this.tsParseType() : null;
                this.expect(tt.bracketR);
                if (this.match(tt.plusMin)) {
                    node.optional = this.value;
                    this.next();
                    this.expect(tt.question);
                }
                else if (this.eat(tt.question)) {
                    node.optional = true;
                }
                node.typeAnnotation = this.tsTryParseType();
                this.semicolon();
                this.expect(tt.braceR);
                return this.finishNode(node, 'TSMappedType');
            }
            tsParseTypeLiteral() {
                const node = this.startNode();
                node.members = this.tsParseObjectTypeMembers();
                return this.finishNode(node, 'TSTypeLiteral');
            }
            tsParseTupleElementType() {
                // parses `...TsType[]`
                const startLoc = this.startLoc;
                const startPos = this['start'];
                const rest = this.eat(tt.ellipsis);
                let type = this.tsParseType();
                const optional = this.eat(tt.question);
                const labeled = this.eat(tt.colon);
                if (labeled) {
                    const labeledNode = this.startNodeAtNode(type);
                    labeledNode.optional = optional;
                    if (type.type === 'TSTypeReference' &&
                        !type.typeParameters &&
                        type.typeName.type === 'Identifier') {
                        labeledNode.label = type.typeName;
                    }
                    else {
                        this.raise(type.start, TypeScriptError.InvalidTupleMemberLabel);
                        // nodes representing the invalid source.
                        labeledNode.label = type;
                    }
                    labeledNode.elementType = this.tsParseType();
                    type = this.finishNode(labeledNode, 'TSNamedTupleMember');
                }
                else if (optional) {
                    const optionalTypeNode = this.startNodeAtNode(type);
                    optionalTypeNode.typeAnnotation = type;
                    type = this.finishNode(optionalTypeNode, 'TSOptionalType');
                }
                if (rest) {
                    const restNode = this.startNodeAt(startPos, startLoc);
                    restNode.typeAnnotation = type;
                    type = this.finishNode(restNode, 'TSRestType');
                }
                return type;
            }
            tsParseTupleType() {
                const node = this.startNode();
                node.elementTypes = this.tsParseBracketedList('TupleElementTypes', this.tsParseTupleElementType.bind(this), 
                /* bracket */ true, 
                /* skipFirstToken */ false);
                // Validate the elementTypes to ensure that no mandatory elements
                // follow optional elements
                let seenOptionalElement = false;
                let labeledElements = null;
                node.elementTypes.forEach(elementNode => {
                    const { type } = elementNode;
                    if (seenOptionalElement &&
                        type !== 'TSRestType' &&
                        type !== 'TSOptionalType' &&
                        !(type === 'TSNamedTupleMember' && elementNode.optional)) {
                        this.raise(elementNode.start, TypeScriptError.OptionalTypeBeforeRequired);
                    }
                    seenOptionalElement || (seenOptionalElement = (type === 'TSNamedTupleMember' && elementNode.optional) ||
                        type === 'TSOptionalType');
                    // When checking labels, check the argument of the spread operator
                    let checkType = type;
                    if (type === 'TSRestType') {
                        elementNode = elementNode.typeAnnotation;
                        checkType = elementNode.type;
                    }
                    const isLabeled = checkType === 'TSNamedTupleMember';
                    labeledElements !== null && labeledElements !== void 0 ? labeledElements : (labeledElements = isLabeled);
                    if (labeledElements !== isLabeled) {
                        this.raise(elementNode.start, TypeScriptError.MixedLabeledAndUnlabeledElements);
                    }
                });
                return this.finishNode(node, 'TSTupleType');
            }
            tsParseTemplateLiteralType() {
                const node = this.startNode();
                node.literal = this.parseTemplate({ isTagged: false });
                return this.finishNode(node, 'TSLiteralType');
            }
            tsParseTypeReference() {
                const node = this.startNode();
                node.typeName = this.tsParseEntityName();
                if (!this.hasPrecedingLineBreak() && this.match(tt.relational) && this.value === '<') {
                    node.typeParameters = this.tsParseTypeArguments();
                }
                return this.finishNode(node, 'TSTypeReference');
            }
            tsParseParenthesizedType() {
                const node = this.startNode();
                this.expect(tt.parenL);
                node.typeAnnotation = this.tsParseType();
                this.expect(tt.parenR);
                return this.finishNode(node, 'TSParenthesizedType');
            }
            tsParseNonArrayType() {
                switch (this.type) {
                    case tt.string:
                    case tt.num:
                    // we don't need bigint type here
                    // case tt.bigint:
                    case tt._true:
                    case tt._false:
                        return this.tsParseLiteralTypeNode();
                    case tt.plusMin:
                        if (this.value === '-') {
                            const node = this.startNode();
                            const nextToken = this.lookahead();
                            if (nextToken.type !== tt.num
                            // && nextToken.type !== tokTypes.bigint
                            ) {
                                this.unexpected();
                            }
                            node.literal = this.parseMaybeUnary();
                            return this.finishNode(node, 'TSLiteralType');
                        }
                        break;
                    case tt._this:
                        return this.tsParseThisTypeOrThisTypePredicate();
                    case tt._typeof:
                        return this.tsParseTypeQuery();
                    case tt._import:
                        return this.tsParseImportType();
                    case tt.braceL:
                        return this.tsLookAhead(this.tsIsStartOfMappedType.bind(this))
                            ? this.tsParseMappedType()
                            : this.tsParseTypeLiteral();
                    case tt.bracketL:
                        return this.tsParseTupleType();
                    case tt.parenL:
                        // the following line will always be false
                        // if (!this.options.createParenthesizedExpressions) {
                        // const startPos = this.start
                        // this.next()
                        // const type = this.tsParseType()
                        // this.expect(tt.parenR)
                        // this.addExtra(type, 'parenthesized', true)
                        // this.addExtra(type, 'parenStart', startPos)
                        // return type
                        // }
                        return this.tsParseParenthesizedType();
                    // parse template string here
                    case tt.backQuote:
                    case tt.dollarBraceL:
                        return this.tsParseTemplateLiteralType();
                    default: {
                        const { type } = this;
                        if (tokenIsIdentifier(type) ||
                            type === tt._void ||
                            type === tt._null) {
                            const nodeType = type === tt._void
                                ? 'TSVoidKeyword'
                                : type === tt._null
                                    ? 'TSNullKeyword'
                                    : keywordTypeFromName(this.value);
                            if (nodeType !== undefined &&
                                this.lookaheadCharCode() !== 46) {
                                const node = this.startNode();
                                this.next();
                                return this.finishNode(node, nodeType);
                            }
                            return this.tsParseTypeReference();
                        }
                    }
                }
                this.unexpected();
            }
            tsParseArrayTypeOrHigher() {
                let type = this.tsParseNonArrayType();
                while (!this.hasPrecedingLineBreak() && this.eat(tt.bracketL)) {
                    if (this.match(tt.bracketR)) {
                        const node = this.startNodeAtNode(type);
                        node.elementType = type;
                        this.expect(tt.bracketR);
                        type = this.finishNode(node, 'TSArrayType');
                    }
                    else {
                        const node = this.startNodeAtNode(type);
                        node.objectType = type;
                        node.indexType = this.tsParseType();
                        this.expect(tt.bracketR);
                        type = this.finishNode(node, 'TSIndexedAccessType');
                    }
                }
                return type;
            }
            tsParseTypeOperatorOrHigher() {
                const isTypeOperator = tokenIsTSTypeOperator(this.type) && !this.containsEsc;
                return isTypeOperator
                    ? this.tsParseTypeOperator()
                    : this.isContextual('infer')
                        ? this.tsParseInferType()
                        : this.tsInAllowConditionalTypesContext(() => this.tsParseArrayTypeOrHigher());
            }
            tsParseIntersectionTypeOrHigher() {
                return this.tsParseUnionOrIntersectionType('TSIntersectionType', this.tsParseTypeOperatorOrHigher.bind(this), tt.bitwiseAND);
            }
            tsParseUnionTypeOrHigher() {
                return this.tsParseUnionOrIntersectionType('TSUnionType', this.tsParseIntersectionTypeOrHigher.bind(this), tt.bitwiseOR);
            }
            tsParseNonConditionalType() {
                if (this.tsIsStartOfFunctionType()) {
                    return this.tsParseFunctionOrConstructorType('TSFunctionType');
                }
                if (this.match(tt._new)) {
                    // As in `new () => Date`
                    return this.tsParseFunctionOrConstructorType('TSConstructorType');
                }
                else if (this.isAbstractConstructorSignature()) {
                    // As in `abstract new () => Date`
                    return this.tsParseFunctionOrConstructorType('TSConstructorType', 
                    /* abstract */ true);
                }
                return this.tsParseUnionTypeOrHigher();
            }
            /** Be sure to be in a type context before calling this, using `tsInType`. */
            tsParseType() {
                // Need to set `state.inType` so that we don't parse JSX in a type context.
                assert(this.inType);
                const type = this.tsParseNonConditionalType();
                if (this.inDisallowConditionalTypesContext ||
                    this.hasPrecedingLineBreak() ||
                    !this.eat(tt._extends)) {
                    return type;
                }
                const node = this.startNodeAtNode(type);
                node.checkType = type;
                node.extendsType = this.tsInDisallowConditionalTypesContext(() => this.tsParseNonConditionalType());
                this.expect(tt.question);
                node.trueType = this.tsInAllowConditionalTypesContext(() => this.tsParseType());
                this.expect(tt.colon);
                node.falseType = this.tsInAllowConditionalTypesContext(() => this.tsParseType());
                return this.finishNode(node, 'TSConditionalType');
            }
            tsIsUnambiguouslyIndexSignature() {
                this.next(); // Skip '{'
                if (tokenIsIdentifier(this.type)) {
                    this.next();
                    return this.match(tt.colon);
                }
                return false;
            }
            /**
             * Runs `cb` in a type context.
             * This should be called one token *before* the first type token,
             * so that the call to `next()` is run in type context.
             */
            tsInType(cb) {
                const oldInType = this.inType;
                this.inType = true;
                try {
                    return cb();
                }
                finally {
                    this.inType = oldInType;
                }
            }
            tsTryParseIndexSignature(node) {
                if (!(this.match(tt.bracketL) &&
                    this.tsLookAhead(this.tsIsUnambiguouslyIndexSignature.bind(this)))) {
                    return undefined;
                }
                this.expect(tt.bracketL);
                const id = this.parseIdent();
                id.typeAnnotation = this.tsParseTypeAnnotation();
                this.resetEndLocation(id); // set end position to end of type
                this.expect(tt.bracketR);
                node.parameters = [id];
                const type = this.tsTryParseTypeAnnotation();
                if (type)
                    node.typeAnnotation = type;
                this.tsParseTypeMemberSemicolon();
                return this.finishNode(node, 'TSIndexSignature');
            }
            // for better error recover
            tsParseNoneModifiers(node) {
                this.tsParseModifiers({
                    modified: node,
                    allowedModifiers: [],
                    disallowedModifiers: ['in', 'out'],
                    errorTemplate: TypeScriptError.InvalidModifierOnTypeParameterPositions
                });
            }
            tsParseTypeParameter(parseModifiers = this.tsParseNoneModifiers.bind(this)) {
                const node = this.startNode();
                parseModifiers(node);
                node.name = this.tsParseTypeParameterName();
                node.constraint = this.tsEatThenParseType(tt._extends);
                node.default = this.tsEatThenParseType(tt.eq);
                return this.finishNode(node, 'TSTypeParameter');
            }
            tsParseTypeParameters(parseModifiers) {
                const node = this.startNode();
                if (this.match(tt.relational) || this.matchJsx('jsxTagStart')) {
                    this.next();
                }
                else {
                    this.unexpected();
                }
                const refTrailingCommaPos = { value: -1 };
                node.params = this.tsParseBracketedList('TypeParametersOrArguments', this.tsParseTypeParameter.bind(this, parseModifiers), 
                /* bracket */ false, 
                /* skipFirstToken */ true, refTrailingCommaPos);
                if (node.params.length === 0) {
                    this.raise(this.start, TypeScriptError.EmptyTypeParameters);
                }
                if (refTrailingCommaPos.value !== -1) {
                    this.addExtra(node, 'trailingComma', refTrailingCommaPos.value);
                }
                return this.finishNode(node, 'TSTypeParameterDeclaration');
            }
            tsTryParseTypeParameters(parseModifiers) {
                if (this.match(tt.relational)) {
                    return this.tsParseTypeParameters(parseModifiers);
                }
            }
            tsTryParse(f) {
                const state = this.getCurLookaheadState();
                const result = f();
                if (result !== undefined && result !== false) {
                    return result;
                }
                else {
                    this.setLookaheadState(state);
                    return undefined;
                }
            }
            tsTokenCanFollowModifier() {
                return ((this.match(tt.bracketL) ||
                    this.match(tt.braceL) ||
                    this.match(tt.star) ||
                    this.match(tt.ellipsis) ||
                    this.match(tt.privateId) ||
                    this.isLiteralPropertyName()) &&
                    !this.hasPrecedingLineBreak());
            }
            tsNextTokenCanFollowModifier() {
                // Note: TypeScript's implementation is much more complicated because
                // more things are considered modifiers there.
                // This implementation only handles modifiers not handled by @babel/parser itself. And "static".
                // TODO: Would be nice to avoid lookahead. Want a hasLineBreakUpNext() method...
                this.next(true);
                return this.tsTokenCanFollowModifier();
            }
            /** Parses a modifier matching one the given modifier names. */
            tsParseModifier(allowedModifiers, stopOnStartOfClassStaticBlock) {
                if (!tokenIsIdentifier(this.type) && this.type !== tt._in) {
                    return undefined;
                }
                const modifier = this.value;
                if (allowedModifiers.indexOf(modifier) !== -1 && !this.containsEsc) {
                    if (stopOnStartOfClassStaticBlock && this.tsIsStartOfStaticBlocks()) {
                        return undefined;
                    }
                    if (this.tsTryParse(this.tsNextTokenCanFollowModifier.bind(this))) {
                        return modifier;
                    }
                }
                return undefined;
            }
            tsParseModifiersByMap({ modified, map }) {
                for (const key of Object.keys(map)) {
                    modified[key] = map[key];
                }
            }
            /** Parses a list of modifiers, in any order.
             *  If you need a specific order, you must call this function multiple times:
             *    this.tsParseModifiers({ modified: node, allowedModifiers: ['public'] });
             *    this.tsParseModifiers({ modified: node, allowedModifiers: ["abstract", "readonly"] });
             */
            tsParseModifiers({ modified, allowedModifiers, disallowedModifiers, stopOnStartOfClassStaticBlock, errorTemplate = TypeScriptError.InvalidModifierOnTypeMember }) {
                const modifiedMap = {};
                const enforceOrder = (loc, modifier, before, after) => {
                    if (modifier === before && modified[after]) {
                        this.raise(loc.column, TypeScriptError.InvalidModifiersOrder({ orderedModifiers: [before, after] }));
                    }
                };
                const incompatible = (loc, modifier, mod1, mod2) => {
                    if ((modified[mod1] && modifier === mod2) ||
                        (modified[mod2] && modifier === mod1)) {
                        this.raise(loc.column, TypeScriptError.IncompatibleModifiers({ modifiers: [mod1, mod2] }));
                    }
                };
                for (;;) {
                    const startLoc = this.startLoc;
                    const modifier = this.tsParseModifier(allowedModifiers.concat(disallowedModifiers !== null && disallowedModifiers !== void 0 ? disallowedModifiers : []), stopOnStartOfClassStaticBlock);
                    if (!modifier)
                        break;
                    if (tsIsAccessModifier(modifier)) {
                        if (modified.accessibility) {
                            this.raise(this.start, TypeScriptError.DuplicateAccessibilityModifier());
                        }
                        else {
                            enforceOrder(startLoc, modifier, modifier, 'override');
                            enforceOrder(startLoc, modifier, modifier, 'static');
                            enforceOrder(startLoc, modifier, modifier, 'readonly');
                            enforceOrder(startLoc, modifier, modifier, 'accessor');
                            modifiedMap.accessibility = modifier;
                            modified['accessibility'] = modifier;
                        }
                    }
                    else if (tsIsVarianceAnnotations(modifier)) {
                        if (modified[modifier]) {
                            this.raise(this.start, TypeScriptError.DuplicateModifier({ modifier }));
                        }
                        else {
                            enforceOrder(startLoc, modifier, 'in', 'out');
                            modifiedMap[modifier] = modifier;
                            modified[modifier] = true;
                        }
                    }
                    else if (tsIsClassAccessor(modifier)) {
                        if (modified[modifier]) {
                            this.raise(this.start, TypeScriptError.DuplicateModifier({ modifier }));
                        }
                        else {
                            incompatible(startLoc, modifier, 'accessor', 'readonly');
                            incompatible(startLoc, modifier, 'accessor', 'static');
                            incompatible(startLoc, modifier, 'accessor', 'override');
                            modifiedMap[modifier] = modifier;
                            modified[modifier] = true;
                        }
                    }
                    else {
                        if (Object.hasOwnProperty.call(modified, modifier)) {
                            this.raise(this.start, TypeScriptError.DuplicateModifier({ modifier }));
                        }
                        else {
                            enforceOrder(startLoc, modifier, 'static', 'readonly');
                            enforceOrder(startLoc, modifier, 'static', 'override');
                            enforceOrder(startLoc, modifier, 'override', 'readonly');
                            enforceOrder(startLoc, modifier, 'abstract', 'override');
                            incompatible(startLoc, modifier, 'declare', 'override');
                            incompatible(startLoc, modifier, 'static', 'abstract');
                            modifiedMap[modifier] = modifier;
                            modified[modifier] = true;
                        }
                    }
                    if (disallowedModifiers === null || disallowedModifiers === void 0 ? void 0 : disallowedModifiers.includes(modifier)) {
                        this.raise(this.start, errorTemplate);
                    }
                }
                return modifiedMap;
            }
            tsParseInOutModifiers(node) {
                this.tsParseModifiers({
                    modified: node,
                    allowedModifiers: ['in', 'out'],
                    disallowedModifiers: [
                        'public',
                        'private',
                        'protected',
                        'readonly',
                        'declare',
                        'abstract',
                        'override'
                    ],
                    errorTemplate: TypeScriptError.InvalidModifierOnTypeParameter
                });
            }
            // tsParseTypeAssertion(): any {
            //   if (disallowAmbiguousJSXLike) {
            //     this.raise(this.start, TypeScriptError.ReservedTypeAssertion)
            //   }
            //
            //   const node = this.startNode()
            //   const _const = this.tsTryNextParseConstantContext()
            //   node.typeAnnotation = _const || this.tsNextThenParseType()
            //   this.expect(tt.relational)
            //   node.expression = this.parseMaybeUnary()
            //   return this.finishNode(node, 'TSTypeAssertion')
            // }
            tsParseTypeArguments() {
                const node = this.startNode();
                node.params = this.tsInType(() => 
                // Temporarily remove a JSX parsing context, which makes us scan different tokens.
                this.tsInNoContext(() => {
                    this.expect(tt.relational);
                    return this.tsParseDelimitedList('TypeParametersOrArguments', this.tsParseType.bind(this));
                }));
                if (node.params.length === 0) {
                    this.raise(this.start, TypeScriptError.EmptyTypeArguments);
                }
                this.exprAllowed = false;
                this.expect(tt.relational);
                return this.finishNode(node, 'TSTypeParameterInstantiation');
            }
            tsParseHeritageClause(token) {
                const originalStart = this.start;
                const delimitedList = this.tsParseDelimitedList('HeritageClauseElement', () => {
                    const node = this.startNode();
                    node.expression = this.tsParseEntityName();
                    if (this.match(tt.relational)) {
                        node.typeParameters = this.tsParseTypeArguments();
                    }
                    return this.finishNode(node, 'TSExpressionWithTypeArguments');
                });
                if (!delimitedList.length) {
                    this.raise(originalStart, TypeScriptError.EmptyHeritageClauseType({ token }));
                }
                return delimitedList;
            }
            tsParseTypeMemberSemicolon() {
                if (!this.eat(tt.comma) && !this.isLineTerminator()) {
                    this.expect(tt.semi);
                }
            }
            tsTryParseAndCatch(f) {
                const result = this.tryParse(abort => 
                // @ts-expect-error todo(flow->ts)
                f() || abort());
                if (result.aborted || !result.node)
                    return undefined;
                if (result.error)
                    this.setLookaheadState(result.failState);
                // @ts-expect-error refine typings
                return result.node;
            }
            tsParseSignatureMember(kind, node) {
                this.tsFillSignature(tt.colon, node);
                this.tsParseTypeMemberSemicolon();
                return this.finishNode(node, kind);
            }
            tsParsePropertyOrMethodSignature(node, readonly) {
                if (this.eat(tt.question))
                    node.optional = true;
                const nodeAny = node;
                if (this.match(tt.parenL) || this.match(tt.relational)) {
                    if (readonly) {
                        this.raise(node.start, TypeScriptError.ReadonlyForMethodSignature);
                    }
                    const method = nodeAny;
                    if (method.kind && this.match(tt.relational)) {
                        this.raise(this.start, TypeScriptError.AccesorCannotHaveTypeParameters);
                    }
                    this.tsFillSignature(tt.colon, method);
                    this.tsParseTypeMemberSemicolon();
                    const paramsKey = 'parameters';
                    const returnTypeKey = 'typeAnnotation';
                    if (method.kind === 'get') {
                        if (method[paramsKey].length > 0) {
                            this.raise(this.start, 'A \'get\' accesor must not have any formal parameters.');
                            if (this.isThisParam(method[paramsKey][0])) {
                                this.raise(this.start, TypeScriptError.AccesorCannotDeclareThisParameter);
                            }
                        }
                    }
                    else if (method.kind === 'set') {
                        if (method[paramsKey].length !== 1) {
                            this.raise(this.start, 'A \'get\' accesor must'
                                + ' not have any formal parameters.');
                        }
                        else {
                            const firstParameter = method[paramsKey][0];
                            if (this.isThisParam(firstParameter)) {
                                this.raise(this.start, TypeScriptError.AccesorCannotDeclareThisParameter);
                            }
                            if (firstParameter.type === 'Identifier' &&
                                firstParameter.optional) {
                                this.raise(this.start, TypeScriptError.SetAccesorCannotHaveOptionalParameter);
                            }
                            if (firstParameter.type === 'RestElement') {
                                this.raise(this.start, TypeScriptError.SetAccesorCannotHaveRestParameter);
                            }
                        }
                        if (method[returnTypeKey]) {
                            this.raise(method[returnTypeKey].start, TypeScriptError.SetAccesorCannotHaveReturnType);
                        }
                    }
                    else {
                        method.kind = 'method';
                    }
                    return this.finishNode(method, 'TSMethodSignature');
                }
                else {
                    const property = nodeAny;
                    if (readonly)
                        property.readonly = true;
                    const type = this.tsTryParseTypeAnnotation();
                    if (type)
                        property.typeAnnotation = type;
                    this.tsParseTypeMemberSemicolon();
                    return this.finishNode(property, 'TSPropertySignature');
                }
            }
            tsParseTypeMember() {
                const node = this.startNode();
                if (this.match(tt.parenL) || this.match(tt.relational)) {
                    return this.tsParseSignatureMember('TSCallSignatureDeclaration', node);
                }
                if (this.match(tt._new)) {
                    const id = this.startNode();
                    this.next();
                    if (this.match(tt.parenL) || this.match(tt.relational)) {
                        return this.tsParseSignatureMember('TSConstructSignatureDeclaration', node);
                    }
                    else {
                        node.key = this.createIdentifier(id, 'new');
                        return this.tsParsePropertyOrMethodSignature(node, false);
                    }
                }
                this.tsParseModifiers({
                    modified: node,
                    allowedModifiers: ['readonly'],
                    disallowedModifiers: [
                        'declare',
                        'abstract',
                        'private',
                        'protected',
                        'public',
                        'static',
                        'override'
                    ]
                });
                const idx = this.tsTryParseIndexSignature(node);
                if (idx) {
                    return idx;
                }
                this.parsePropertyName(node);
                if (!node.computed &&
                    node.key.type === 'Identifier' &&
                    (node.key.name === 'get' || node.key.name === 'set') &&
                    this.tsTokenCanFollowModifier()) {
                    node.kind = node.key.name;
                    this.parsePropertyName(node);
                }
                return this.tsParsePropertyOrMethodSignature(node, !!node.readonly);
            }
            tsParseList(kind, parseElement) {
                const result = [];
                while (!this.tsIsListTerminator(kind)) {
                    // Skipping "parseListElement" from the TS source since that's just for error handling.
                    result.push(parseElement());
                }
                return result;
            }
            tsParseObjectTypeMembers() {
                this.expect(tt.braceL);
                const members = this.tsParseList('TypeMembers', this.tsParseTypeMember.bind(this));
                this.expect(tt.braceR);
                return members;
            }
            tsParseInterfaceDeclaration(node, properties = {}) {
                if (this.hasFollowingLineBreak())
                    return null;
                this.expectContextual('interface');
                if (properties.declare)
                    node.declare = true;
                if (tokenIsIdentifier(this.type)) {
                    node.id = this.parseIdent();
                    this.checkLValSimple(node.id, BIND_TS_INTERFACE);
                }
                else {
                    node.id = null;
                    this.raise(this.start, TypeScriptError.MissingInterfaceName);
                }
                node.typeParameters = this.tsTryParseTypeParameters(this.tsParseInOutModifiers.bind(this));
                if (this.eat(tt._extends)) {
                    node.extends = this.tsParseHeritageClause('extends');
                }
                const body = this.startNode();
                body.body = this.tsInType(this.tsParseObjectTypeMembers.bind(this));
                node.body = this.finishNode(body, 'TSInterfaceBody');
                return this.finishNode(node, 'TSInterfaceDeclaration');
            }
            tsParseAbstractDeclaration(node) {
                if (this.match(tt._class)) {
                    node.abstract = true;
                    return this.parseClass(node, true);
                }
                else if (this.ts_isContextual(tokTypes.interface)) {
                    // for invalid abstract interface
                    // To avoid
                    //   abstract interface
                    //   Foo {}
                    if (!this.hasFollowingLineBreak()) {
                        node.abstract = true;
                        return this.tsParseInterfaceDeclaration(node);
                    }
                }
                else {
                    this.unexpected(node.start);
                }
            }
            tsIsDeclarationStart() {
                return tokenIsTSDeclarationStart(this.type);
            }
            tsParseExpressionStatement(node, expr) {
                switch (expr.name) {
                    case 'declare': {
                        const declaration = this.tsTryParseDeclare(node);
                        if (declaration) {
                            declaration.declare = true;
                            return declaration;
                        }
                        break;
                    }
                    case 'global':
                        // `global { }` (with no `declare`) may appear inside an ambient module declaration.
                        // Would like to use tsParseAmbientExternalModuleDeclaration here, but already ran past "global".
                        if (this.match(tt.braceL)) {
                            super.enterScope(TS_SCOPE_TS_MODULE);
                            const mod = node;
                            mod.global = true;
                            mod.id = expr;
                            mod.body = this.tsParseModuleBlock();
                            super.exitScope();
                            return this.finishNode(mod, 'TSModuleDeclaration');
                        }
                        break;
                    default:
                        return this.tsParseDeclaration(node, expr.name, /* next */ false);
                }
            }
            tsParseModuleReference() {
                return this.tsIsExternalModuleReference()
                    ? this.tsParseExternalModuleReference()
                    : this.tsParseEntityName(/* allowReservedWords */ false);
            }
            tsIsExportDefaultSpecifier() {
                const { type } = this;
                const isAsync = this.isAsyncFunction();
                const isLet = this.isLet();
                if (tokenIsIdentifier(type)) {
                    if ((isAsync && !this.containsEsc) || isLet) {
                        return false;
                    }
                    if ((type === tokTypes.type || type === tokTypes.interface) &&
                        !this.containsEsc) {
                        const ahead = this.lookahead();
                        // If we see any variable name other than `from` after `type` keyword,
                        // we consider it as flow/typescript type exports
                        // note that this approach may fail on some pedantic cases
                        // export type from = number
                        if ((tokenIsIdentifier(ahead.type) && !this.isContextualWithState('from', ahead)) ||
                            ahead.type === tt.braceL) {
                            return false;
                        }
                    }
                }
                else if (!this.match(tt._default)) {
                    return false;
                }
                const next = this.nextTokenStart();
                const hasFrom = this.isUnparsedContextual(next, 'from');
                if (this.input.charCodeAt(next) === 44 ||
                    (tokenIsIdentifier(this.type) && hasFrom)) {
                    return true;
                }
                // lookahead again when `export default from` is seen
                if (this.match(tt._default) && hasFrom) {
                    const nextAfterFrom = this.input.charCodeAt(this.nextTokenStartSince(next + 4));
                    return (nextAfterFrom === 34 ||
                        nextAfterFrom === 39);
                }
                return false;
            }
            tsInAmbientContext(cb) {
                const oldIsAmbientContext = this.isAmbientContext;
                this.isAmbientContext = true;
                try {
                    return cb();
                }
                finally {
                    this.isAmbientContext = oldIsAmbientContext;
                }
            }
            tsCheckLineTerminator(next) {
                if (next) {
                    if (this.hasFollowingLineBreak())
                        return false;
                    this.next();
                    return true;
                }
                return !this.isLineTerminator();
            }
            tsParseModuleOrNamespaceDeclaration(node, nested = false) {
                node.id = this.parseIdent();
                if (!nested) {
                    this.checkLValSimple(node.id, BIND_TS_NAMESPACE);
                }
                if (this.eat(tt.dot)) {
                    const inner = this.startNode();
                    this.tsParseModuleOrNamespaceDeclaration(inner, true);
                    node.body = inner;
                }
                else {
                    super.enterScope(TS_SCOPE_TS_MODULE);
                    node.body = this.tsParseModuleBlock();
                    super.exitScope();
                }
                return this.finishNode(node, 'TSModuleDeclaration');
            }
            tsParseTypeAliasDeclaration(node) {
                node.id = this.parseIdent();
                this.checkLValSimple(node.id, BIND_TS_TYPE);
                node.typeAnnotation = this.tsInType(() => {
                    node.typeParameters = this.tsTryParseTypeParameters(this.tsParseInOutModifiers.bind(this));
                    this.expect(tt.eq);
                    if (this.ts_isContextual(tokTypes.interface) &&
                        this.lookahead().type !== tt.dot) {
                        const node = this.startNode();
                        this.next();
                        return this.finishNode(node, 'TSIntrinsicKeyword');
                    }
                    return this.tsParseType();
                });
                this.semicolon();
                return this.finishNode(node, 'TSTypeAliasDeclaration');
            }
            // Common to tsTryParseDeclare, tsTryParseExportDeclaration, and tsParseExpressionStatement.
            tsParseDeclaration(node, value, next) {
                // no declaration apart from enum can be followed by a line break.
                switch (value) {
                    case 'abstract':
                        if (this.tsCheckLineTerminator(next) &&
                            (this.match(tt._class) || tokenIsIdentifier(this.type))) {
                            return this.tsParseAbstractDeclaration(node);
                        }
                        break;
                    case 'module':
                        if (this.tsCheckLineTerminator(next)) {
                            if (this.match(tt.string)) {
                                return this.tsParseAmbientExternalModuleDeclaration(node);
                            }
                            else if (tokenIsIdentifier(this.type)) {
                                return this.tsParseModuleOrNamespaceDeclaration(node);
                            }
                        }
                        break;
                    case 'namespace':
                        if (this.tsCheckLineTerminator(next) &&
                            tokenIsIdentifier(this.type)) {
                            return this.tsParseModuleOrNamespaceDeclaration(node);
                        }
                        break;
                    case 'type':
                        if (this.tsCheckLineTerminator(next) &&
                            tokenIsIdentifier(this.type)) {
                            return this.tsParseTypeAliasDeclaration(node);
                        }
                        break;
                }
            }
            // Note: this won't b·e called unless the keyword is allowed in
            // `shouldParseExportDeclaration`.
            tsTryParseExportDeclaration() {
                return this.tsParseDeclaration(this.startNode(), this.value, 
                /* next */ true);
            }
            tsParseImportEqualsDeclaration(node, isExport) {
                node.isExport = isExport || false;
                node.id = this.parseIdent();
                this.checkLValSimple(node.id, BIND_LEXICAL);
                super.expect(tt.eq);
                const moduleReference = this.tsParseModuleReference();
                if (node.importKind === 'type' &&
                    moduleReference.type !== 'TSExternalModuleReference') {
                    this.raise(moduleReference.start, TypeScriptError.ImportAliasHasImportType);
                }
                node.moduleReference = moduleReference;
                super.semicolon();
                return this.finishNode(node, 'TSImportEqualsDeclaration');
            }
            isExportDefaultSpecifier() {
                if (this.tsIsDeclarationStart())
                    return false;
                const { type } = this;
                if (tokenIsIdentifier(type)) {
                    if (this.isContextual('async') || this.isContextual('let')) {
                        return false;
                    }
                    if ((type === tokTypes.type || type === tokTypes.interface) &&
                        !this.containsEsc) {
                        const ahead = this.lookahead();
                        // If we see any variable name other than `from` after `type` keyword,
                        // we consider it as flow/typescript type exports
                        // note that this approach may fail on some pedantic cases
                        // export type from = number
                        if ((tokenIsIdentifier(ahead.type) && !this.isContextualWithState('from', ahead)) ||
                            ahead.type === tt.braceL) {
                            return false;
                        }
                    }
                }
                else if (!this.match(tt._default)) {
                    return false;
                }
                const next = this.nextTokenStart();
                const hasFrom = this.isUnparsedContextual(next, 'from');
                if (this.input.charCodeAt(next) === 44 ||
                    (tokenIsIdentifier(this.type) && hasFrom)) {
                    return true;
                }
                // lookahead again when `export default from` is seen
                if (this.match(tt._default) && hasFrom) {
                    const nextAfterFrom = this.input.charCodeAt(this.nextTokenStartSince(next + 4));
                    return (nextAfterFrom === 34 ||
                        nextAfterFrom === 39);
                }
                return false;
            }
            parseTemplate({ isTagged = false } = {}) {
                let node = this.startNode();
                this.next();
                node.expressions = [];
                let curElt = this.parseTemplateElement({ isTagged });
                node.quasis = [curElt];
                while (!curElt.tail) {
                    if (this.type === tt.eof)
                        this.raise(this.pos, 'Unterminated template literal');
                    this.expect(tt.dollarBraceL);
                    // NOTE: extend parseTemplateSubstitution
                    node.expressions.push(this.inType ? this.tsParseType() : this.parseExpression());
                    this.expect(tt.braceR);
                    node.quasis.push(curElt = this.parseTemplateElement({ isTagged }));
                }
                this.next();
                return this.finishNode(node, 'TemplateLiteral');
            }
            parseFunction(node, statement, allowExpressionBody, isAsync, forInit) {
                this.initFunction(node);
                if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
                    if (this.type === tt.star && (statement & FUNC_HANGING_STATEMENT)) {
                        this.unexpected();
                    }
                    node.generator = this.eat(tt.star);
                }
                if (this.options.ecmaVersion >= 8) {
                    node.async = !!isAsync;
                }
                if (statement & FUNC_STATEMENT) {
                    node.id = (statement & FUNC_NULLABLE_ID) && this.type !== tt.name ? null : this.parseIdent();
                }
                let oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
                const oldMaybeInArrowParameters = this.maybeInArrowParameters;
                this.maybeInArrowParameters = false;
                this.yieldPos = 0;
                this.awaitPos = 0;
                this.awaitIdentPos = 0;
                this.enterScope(functionFlags(node.async, node.generator));
                if (!(statement & FUNC_STATEMENT)) {
                    node.id = this.type === tt.name ? this.parseIdent() : null;
                }
                this.parseFunctionParams(node);
                const isDeclaration = (statement & FUNC_STATEMENT);
                this.parseFunctionBody(node, allowExpressionBody, false, forInit, {
                    isFunctionDeclaration: isDeclaration
                });
                this.yieldPos = oldYieldPos;
                this.awaitPos = oldAwaitPos;
                this.awaitIdentPos = oldAwaitIdentPos;
                if (statement & FUNC_STATEMENT && node.id && !(statement & FUNC_HANGING_STATEMENT)) {
                    // If it is a regular function declaration in sloppy mode, then it is
                    // subject to Annex B semantics (BIND_FUNCTION). Otherwise, the binding
                    // mode depends on properties of the current scope (see
                    // treatFunctionsAsVar).
                    if (node.body) {
                        this.checkLValSimple(node.id, (this.strict || node.generator || node.async) ?
                            this.treatFunctionsAsVar ?
                                acornScope.BIND_VAR : acornScope.BIND_LEXICAL : acornScope.BIND_FUNCTION);
                    }
                    else {
                        this.checkLValSimple(node.id, acornScope.BIND_NONE);
                    }
                }
                this.maybeInArrowParameters = oldMaybeInArrowParameters;
                return this.finishNode(node, isDeclaration ? 'FunctionDeclaration' : 'FunctionExpression');
            }
            parseFunctionBody(node, isArrowFunction = false, isMethod = false, forInit = false, tsConfig) {
                if (this.match(tt.colon)) {
                    node.returnType = this.tsParseTypeOrTypePredicateAnnotation(tt.colon);
                }
                const bodilessType = (tsConfig === null || tsConfig === void 0 ? void 0 : tsConfig.isFunctionDeclaration)
                    ? 'TSDeclareFunction'
                    : (tsConfig === null || tsConfig === void 0 ? void 0 : tsConfig.isClassMethod)
                        ? 'TSDeclareMethod'
                        : undefined;
                if (bodilessType && !this.match(tt.braceL) && this.isLineTerminator()) {
                    return this.finishNode(node, bodilessType);
                }
                if (bodilessType === 'TSDeclareFunction' && this.isAmbientContext) {
                    this.raise(node.start, TypeScriptError.DeclareFunctionHasImplementation);
                    if (node.declare) {
                        super.parseFunctionBody(node, isArrowFunction, isMethod, false);
                        return this.finishNode(node, bodilessType);
                    }
                }
                super.parseFunctionBody(node, isArrowFunction, isMethod, forInit);
                return node;
            }
            parseNew() {
                var _a;
                if (this.containsEsc)
                    this.raiseRecoverable(this.start, 'Escape sequence in keyword new');
                let node = this.startNode();
                let meta = this.parseIdent(true);
                if (this.options.ecmaVersion >= 6 && this.eat(tt.dot)) {
                    node.meta = meta;
                    let containsEsc = this.containsEsc;
                    node.property = this.parseIdent(true);
                    if (node.property.name !== 'target')
                        this.raiseRecoverable(node.property.start, 'The only valid meta property for new is \'new.target\'');
                    if (containsEsc)
                        this.raiseRecoverable(node.start, '\'new.target\' must not contain escaped characters');
                    if (!this['allowNewDotTarget'])
                        this.raiseRecoverable(node.start, '\'new.target\' can only be used in functions and class static block');
                    return this.finishNode(node, 'MetaProperty');
                }
                let startPos = this.start, startLoc = this.startLoc, isImport = this.type === tt._import;
                node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true, false);
                if (isImport && node.callee.type === 'ImportExpression') {
                    this.raise(startPos, 'Cannot use new with import()');
                }
                // ---start parseNewCallee extension
                const { callee } = node;
                if (callee.type === 'TSInstantiationExpression' &&
                    !((_a = callee.extra) === null || _a === void 0 ? void 0 : _a.parenthesized)) {
                    node.typeParameters = callee.typeParameters;
                    node.callee = callee.expression;
                }
                // ---end
                if (this.eat(tt.parenL))
                    node.arguments = this.parseExprList(tt.parenR, this.options.ecmaVersion >= 8, false);
                else
                    node.arguments = [];
                return this.finishNode(node, 'NewExpression');
            }
            parseExprOp(left, leftStartPos, leftStartLoc, minPrec, forInit) {
                if (tt._in.binop > minPrec &&
                    !this.hasPrecedingLineBreak() &&
                    this.isContextual('as')) {
                    const node = this.startNodeAt(leftStartPos, leftStartLoc);
                    node.expression = left;
                    const _const = this.tsTryNextParseConstantContext();
                    if (_const) {
                        node.typeAnnotation = _const;
                    }
                    else {
                        node.typeAnnotation = this.tsNextThenParseType();
                    }
                    this.finishNode(node, 'TSAsExpression');
                    // rescan `<`, `>` because they were scanned when this.state.inType was true
                    this.reScan_lt_gt();
                    return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, forInit);
                }
                return super.parseExprOp(left, leftStartPos, leftStartLoc, minPrec, forInit);
            }
            /**
             * @param {Node} node this may be ImportDeclaration |
             * TsImportEqualsDeclaration
             * @returns AnyImport
             * */
            parseImport(node) {
                let enterHead = this.lookahead();
                node.importKind = 'value';
                this.importOrExportOuterKind = 'value';
                if (tokenIsIdentifier(enterHead.type) ||
                    this.match(tt.star) ||
                    this.match(tt.braceL)) {
                    let ahead = this.lookahead(2);
                    if (
                    // import type, { a } from "b";
                    ahead.type !== tt.comma &&
                        // import type from "a";
                        !this.isContextualWithState('from', ahead) &&
                        // import type = require("a");
                        ahead.type !== tt.eq &&
                        this.ts_eatContextualWithState('type', 1, enterHead)) {
                        this.importOrExportOuterKind = 'type';
                        node.importKind = 'type';
                        enterHead = this.lookahead();
                        ahead = this.lookahead(2);
                    }
                    if (tokenIsIdentifier(enterHead.type) && ahead.type === tt.eq) {
                        this.next();
                        const importNode = this.tsParseImportEqualsDeclaration(node);
                        this.importOrExportOuterKind = 'value';
                        return importNode;
                    }
                }
                // parse import start
                this.next();
                // import '...'
                if (this.type === tt.string) {
                    node.specifiers = [];
                    node.source = this.parseExprAtom();
                }
                else {
                    node.specifiers = this.parseImportSpecifiers();
                    this.expectContextual('from');
                    node.source = this.type === tt.string ? this.parseExprAtom() : this.unexpected();
                }
                // import assertions
                this.parseMaybeImportAttributes(node);
                this.semicolon();
                this.finishNode(node, 'ImportDeclaration');
                // end
                this.importOrExportOuterKind = 'value';
                /*:: invariant(importNode.type !== "TSImportEqualsDeclaration") */
                // `import type` can only be used on imports with named imports or with a
                // default import - but not both
                if (node.importKind === 'type' &&
                    node.specifiers.length > 1 &&
                    node.specifiers[0].type === 'ImportDefaultSpecifier') {
                    this.raise(node.start, TypeScriptError.TypeImportCannotSpecifyDefaultAndNamed);
                }
                return node;
            }
            parseExportDefaultDeclaration() {
                // ---start ts extension
                if (this.isAbstractClass()) {
                    const cls = this.startNode();
                    this.next(); // Skip "abstract"
                    cls.abstract = true;
                    return this.parseClass(cls, true);
                }
                // export default interface allowed in:
                // https://github.com/Microsoft/TypeScript/pull/16040
                if (this.match(tokTypes.interface)) {
                    const result = this.tsParseInterfaceDeclaration(this.startNode());
                    if (result)
                        return result;
                }
                // ---end
                return super.parseExportDefaultDeclaration();
            }
            parseExportAllDeclaration(node, exports) {
                if (this.options.ecmaVersion >= 11) {
                    if (this.eatContextual("as")) {
                        node.exported = this.parseModuleExportName();
                        this.checkExport(exports, node.exported, this.lastTokStart);
                    }
                    else {
                        node.exported = null;
                    }
                }
                this.expectContextual("from");
                if (this.type !== tt.string)
                    this.unexpected();
                node.source = this.parseExprAtom();
                this.parseMaybeImportAttributes(node);
                this.semicolon();
                return this.finishNode(node, "ExportAllDeclaration");
            }
            parseDynamicImport(node) {
                this.next(); // skip `(`
                // Parse node.source.
                node.source = this.parseMaybeAssign();
                if (this.eat(tt.comma)) {
                    const expr = this.parseExpression();
                    node.arguments = [expr];
                }
                // Verify ending.
                if (!this.eat(tt.parenR)) {
                    const errorPos = this.start;
                    if (this.eat(tt.comma) && this.eat(tt.parenR)) {
                        this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
                    }
                    else {
                        this.unexpected(errorPos);
                    }
                }
                return this.finishNode(node, "ImportExpression");
            }
            parseExport(node, exports) {
                let enterHead = this.lookahead();
                if (this.ts_eatWithState(tt._import, 2, enterHead)) {
                    if (this.ts_isContextual(tokTypes.type) &&
                        this.lookaheadCharCode() !== 61) {
                        node.importKind = 'type';
                        this.importOrExportOuterKind = 'type';
                        this.next(); // eat "type"
                    }
                    else {
                        node.importKind = 'value';
                        this.importOrExportOuterKind = 'value';
                    }
                    const exportEqualsNode = this.tsParseImportEqualsDeclaration(node, 
                    /* isExport */ true);
                    this.importOrExportOuterKind = undefined;
                    return exportEqualsNode;
                }
                else if (this.ts_eatWithState(tt.eq, 2, enterHead)) {
                    // `export = x;`
                    const assign = node;
                    assign.expression = this.parseExpression();
                    this.semicolon();
                    this.importOrExportOuterKind = undefined;
                    return this.finishNode(assign, 'TSExportAssignment');
                }
                else if (this.ts_eatContextualWithState('as', 2, enterHead)) {
                    // `export as namespace A;`
                    const decl = node;
                    // See `parseNamespaceExportDeclaration` in TypeScript's own parser
                    this.expectContextual('namespace');
                    decl.id = this.parseIdent();
                    this.semicolon();
                    this.importOrExportOuterKind = undefined;
                    return this.finishNode(decl, 'TSNamespaceExportDeclaration');
                }
                else {
                    if (this.ts_isContextualWithState(enterHead, tokTypes.type) &&
                        this.lookahead(2).type === tt.braceL) {
                        this.next();
                        this.importOrExportOuterKind = 'type';
                        node.exportKind = 'type';
                    }
                    else {
                        this.importOrExportOuterKind = 'value';
                        node.exportKind = 'value';
                    }
                    // start parse export
                    this.next();
                    // export * from '...'
                    if (this.eat(tt.star)) {
                        return this.parseExportAllDeclaration(node, exports);
                    }
                    if (this.eat(tt._default)) { // export default ...
                        this.checkExport(exports, "default", this.lastTokStart);
                        node.declaration = this.parseExportDefaultDeclaration();
                        return this.finishNode(node, "ExportDefaultDeclaration");
                    }
                    // export var|const|let|function|class ...
                    if (this.shouldParseExportStatement()) {
                        node.declaration = this.parseExportDeclaration(node);
                        if (node.declaration.type === "VariableDeclaration")
                            this.checkVariableExport(exports, node.declaration.declarations);
                        else
                            this.checkExport(exports, node.declaration.id, node.declaration.id.start);
                        node.specifiers = [];
                        node.source = null;
                    }
                    else { // export { x, y as z } [from '...']
                        node.declaration = null;
                        node.specifiers = this.parseExportSpecifiers(exports);
                        if (this.eatContextual("from")) {
                            if (this.type !== tt.string)
                                this.unexpected();
                            node.source = this.parseExprAtom();
                            this.parseMaybeImportAttributes(node);
                        }
                        else {
                            for (let spec of node.specifiers) {
                                // check for keywords used as local names
                                this.checkUnreserved(spec.local);
                                // check if export is defined
                                this.checkLocalExport(spec.local);
                                if (spec.local.type === "Literal") {
                                    this.raise(spec.local.start, "A string literal cannot be used as an exported binding without `from`.");
                                }
                            }
                            node.source = null;
                        }
                        this.semicolon();
                    }
                    return this.finishNode(node, "ExportNamedDeclaration");
                    // end
                }
            }
            checkExport(exports, name, _) {
                if (!exports) {
                    return;
                }
                if (typeof name !== 'string') {
                    name = name.type === 'Identifier' ? name.name : name.value;
                }
                // we won't check export in ts file
                // if (Object.hasOwnProperty.call(exports, name)) {
                //   this.raiseRecoverable(pos, "Duplicate export '" + name + "'");
                // }
                exports[name] = true;
            }
            ;
            parseMaybeDefault(startPos, startLoc, left) {
                const node = super.parseMaybeDefault(startPos, startLoc, left);
                if (node.type === 'AssignmentPattern' &&
                    node.typeAnnotation &&
                    node.right.start < node.typeAnnotation.start) {
                    this.raise(node.typeAnnotation.start, TypeScriptError.TypeAnnotationAfterAssign);
                }
                return node;
            }
            typeCastToParameter(node) {
                node.expression.typeAnnotation = node.typeAnnotation;
                this.resetEndLocation(node.expression, node.typeAnnotation.end);
                return node.expression;
            }
            toAssignableList(exprList, isBinding) {
                for (let i = 0; i < exprList.length; i++) {
                    const expr = exprList[i];
                    if ((expr === null || expr === void 0 ? void 0 : expr.type) === 'TSTypeCastExpression') {
                        exprList[i] = this.typeCastToParameter(expr);
                    }
                }
                return super.toAssignableList(exprList, isBinding);
            }
            reportReservedArrowTypeParam(node) {
                var _a;
                if (node.params.length === 1 &&
                    !((_a = node.extra) === null || _a === void 0 ? void 0 : _a.trailingComma) &&
                    disallowAmbiguousJSXLike) {
                    this.raise(node.start, TypeScriptError.ReservedArrowTypeParam);
                }
            }
            parseExprAtom(refDestructuringErrors, forInit, forNew) {
                if (this.type === tokTypes.jsxText) {
                    return this.jsx_parseText();
                }
                else if (this.type === tokTypes.jsxTagStart) {
                    return this.jsx_parseElement();
                }
                else if (this.type === tokTypes.at) {
                    this.parseDecorators();
                    return this.parseExprAtom();
                }
                else if (tokenIsIdentifier(this.type)) {
                    let canBeArrow = this.potentialArrowAt === this.start;
                    let startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
                    let id = this.parseIdent(false);
                    if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === 'async' && !this.canInsertSemicolon() && this.eat(tt._function)) {
                        this.overrideContext(tokContexts.f_expr);
                        return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true, forInit);
                    }
                    if (canBeArrow && !this.canInsertSemicolon()) {
                        if (this.eat(tt.arrow))
                            return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false, forInit);
                        if (this.options.ecmaVersion >= 8 && id.name === 'async' && this.type === tt.name && !containsEsc &&
                            (!this.potentialArrowInForAwait || this.value !== 'of' || this.containsEsc)) {
                            id = this.parseIdent(false);
                            if (this.canInsertSemicolon() || !this.eat(tt.arrow))
                                this.unexpected();
                            return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true, forInit);
                        }
                    }
                    return id;
                }
                else {
                    return super.parseExprAtom(refDestructuringErrors, forInit, forNew);
                }
            }
            parseExprAtomDefault() {
                if (tokenIsIdentifier(this.type)) {
                    const canBeArrow = this['potentialArrowAt'] === this.start;
                    const containsEsc = this.containsEsc;
                    const id = this.parseIdent();
                    if (!containsEsc &&
                        id.name === 'async' &&
                        !this.canInsertSemicolon()) {
                        const { type } = this;
                        if (type === tt._function) {
                            this.next();
                            return this.parseFunction(this.startNodeAtNode(id), undefined, true, true);
                        }
                        else if (tokenIsIdentifier(type)) {
                            // If the next token begins with "=", commit to parsing an async
                            // arrow function. (Peeking ahead for "=" lets us avoid a more
                            // expensive full-token lookahead on this common path.)
                            if (this.lookaheadCharCode() === 61) {
                                // although `id` is not used in async arrow unary function,
                                // we don't need to reset `async`'s trailing comments because
                                // it will be attached to the upcoming async arrow binding identifier
                                const paramId = this.parseIdent(false);
                                if (this.canInsertSemicolon() || !this.eat(tt.arrow))
                                    this.unexpected();
                                return this.parseArrowExpression(this.startNodeAtNode(id), [paramId], true);
                            }
                            else {
                                return id;
                            }
                        }
                    }
                    if (canBeArrow &&
                        this.match(tt.arrow) &&
                        !this.canInsertSemicolon()) {
                        this.next();
                        return this.parseArrowExpression(this.startNodeAtNode(id), [id], false);
                    }
                    return id;
                }
                else {
                    this.unexpected();
                }
            }
            parseIdentNode() {
                let node = this.startNode();
                if (tokenIsKeywordOrIdentifier(this.type)) {
                    node.name = this.value;
                }
                else {
                    return super.parseIdentNode();
                }
                return node;
            }
            parseVarStatement(node, kind, allowMissingInitializer = false) {
                const { isAmbientContext } = this;
                // ---start origin parseVarStatement
                this.next();
                super.parseVar(node, false, kind, allowMissingInitializer || isAmbientContext);
                this.semicolon();
                const declaration = this.finishNode(node, 'VariableDeclaration');
                // ---end
                if (!isAmbientContext)
                    return declaration;
                for (const { id, init } of declaration.declarations) {
                    // Empty initializer is the easy case that we want.
                    if (!init)
                        continue;
                    // var and let aren't ever allowed initializers.
                    //
                    // If a const declaration has no type annotation and is initiailized to
                    // a string literal, numeric literal, or enum reference, then it is
                    // allowed. In an ideal world, we'd check whether init was *actually* an
                    // enum reference, but we allow anything that "could be" a literal enum
                    // in `isPossiblyLiteralEnum` since we don't have all the information
                    // that the typescript compiler has.
                    if (kind !== 'const' || !!id.typeAnnotation) {
                        this.raise(init.start, TypeScriptError.InitializerNotAllowedInAmbientContext);
                    }
                    else if (init.type !== 'StringLiteral' &&
                        init.type !== 'BooleanLiteral' &&
                        init.type !== 'NumericLiteral' &&
                        init.type !== 'BigIntLiteral' &&
                        (init.type !== 'TemplateLiteral' || init.expressions.length > 0) &&
                        !isPossiblyLiteralEnum(init)) {
                        this.raise(init.start, TypeScriptError.ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference);
                    }
                }
                return declaration;
            }
            parseStatement(context, topLevel, exports) {
                if (this.match(tokTypes.at)) {
                    this.parseDecorators(true);
                }
                if (this.match(tt._const) && this.isLookaheadContextual('enum')) {
                    const node = this.startNode();
                    this.expect(tt._const); // eat 'const'
                    return this.tsParseEnumDeclaration(node, { const: true });
                }
                if (this.ts_isContextual(tokTypes.enum)) {
                    return this.tsParseEnumDeclaration(this.startNode());
                }
                if (this.ts_isContextual(tokTypes.interface)) {
                    const result = this.tsParseInterfaceDeclaration(this.startNode());
                    if (result)
                        return result;
                }
                return super.parseStatement(context, topLevel, exports);
            }
            // NOTE: unused function
            parseAccessModifier() {
                return this.tsParseModifier(['public', 'protected', 'private']);
            }
            parsePostMemberNameModifiers(methodOrProp) {
                const optional = this.eat(tt.question);
                if (optional)
                    methodOrProp.optional = true;
                if (methodOrProp.readonly && this.match(tt.parenL)) {
                    this.raise(methodOrProp.start, TypeScriptError.ClassMethodHasReadonly);
                }
                if (methodOrProp.declare && this.match(tt.parenL)) {
                    this.raise(methodOrProp.start, TypeScriptError.ClassMethodHasDeclare);
                }
            }
            // Note: The reason we do this in `parseExpressionStatement` and not `parseStatement`
            // is that e.g. `type()` is valid JS, so we must try parsing that first.
            // If it's really a type, we will parse `type` as the statement, and can correct it here
            // by parsing the rest.
            parseExpressionStatement(node, expr) {
                const decl = expr.type === 'Identifier'
                    ? this.tsParseExpressionStatement(node, expr)
                    : undefined;
                return decl || super.parseExpressionStatement(node, expr);
            }
            shouldParseExportStatement() {
                if (this.tsIsDeclarationStart())
                    return true;
                if (this.match(tokTypes.at)) {
                    return true;
                }
                return super.shouldParseExportStatement();
            }
            parseConditional(expr, startPos, startLoc, forInit, 
            // @ts-ignore
            refDestructuringErrors) {
                if (this.eat(tt.question)) {
                    let node = this.startNodeAt(startPos, startLoc);
                    node.test = expr;
                    node.consequent = this.parseMaybeAssign();
                    this.expect(tt.colon);
                    node.alternate = this.parseMaybeAssign(forInit);
                    return this.finishNode(node, 'ConditionalExpression');
                }
                return expr;
            }
            parseMaybeConditional(forInit, refDestructuringErrors) {
                let startPos = this.start, startLoc = this.startLoc;
                let expr = this.parseExprOps(forInit, refDestructuringErrors);
                if (this.checkExpressionErrors(refDestructuringErrors))
                    return expr;
                // todo parseConditional ts support
                if (!this.maybeInArrowParameters || !this.match(tt.question)) {
                    return this.parseConditional(expr, startPos, startLoc, forInit, refDestructuringErrors);
                }
                const result = this.tryParse(() => this.parseConditional(expr, startPos, startLoc, forInit, refDestructuringErrors));
                if (!result.node) {
                    if (result.error) {
                        /*:: invariant(refExpressionErrors != null) */
                        this.setOptionalParametersError(refDestructuringErrors, result.error);
                    }
                    return expr;
                }
                if (result.error)
                    this.setLookaheadState(result.failState);
                return result.node;
            }
            parseParenItem(node) {
                const startPos = this.start;
                const startLoc = this.startLoc;
                node = super.parseParenItem(node);
                if (this.eat(tt.question)) {
                    node.optional = true;
                    // Include questionmark in location of node
                    // Don't use this.finishNode() as otherwise we might process comments twice and
                    // include already consumed parens
                    this.resetEndLocation(node);
                }
                if (this.match(tt.colon)) {
                    const typeCastNode = this.startNodeAt(startPos, startLoc);
                    typeCastNode.expression = node;
                    typeCastNode.typeAnnotation = this.tsParseTypeAnnotation();
                    return this.finishNode(typeCastNode, 'TSTypeCastExpression');
                }
                return node;
            }
            parseExportDeclaration(node) {
                if (!this.isAmbientContext && this.ts_isContextual(tokTypes.declare)) {
                    return this.tsInAmbientContext(() => this.parseExportDeclaration(node));
                }
                // Store original location/position
                const startPos = this.start;
                const startLoc = this.startLoc;
                const isDeclare = this.eatContextual('declare');
                if (isDeclare &&
                    (this.ts_isContextual(tokTypes.declare) || !this.shouldParseExportStatement())) {
                    this.raise(this.start, TypeScriptError.ExpectedAmbientAfterExportDeclare);
                }
                const isIdentifier = tokenIsIdentifier(this.type);
                const declaration = (isIdentifier && this.tsTryParseExportDeclaration()) ||
                    this.parseStatement(null);
                if (!declaration)
                    return null;
                if (declaration.type === 'TSInterfaceDeclaration' ||
                    declaration.type === 'TSTypeAliasDeclaration' ||
                    isDeclare) {
                    node.exportKind = 'type';
                }
                if (isDeclare) {
                    // Reset location to include `declare` in range
                    this.resetStartLocation(declaration, startPos, startLoc);
                    declaration.declare = true;
                }
                return declaration;
            }
            parseClassId(node, isStatement) {
                if ((!isStatement) && this.isContextual('implements')) {
                    return;
                }
                super.parseClassId(node, isStatement);
                const typeParameters = this.tsTryParseTypeParameters(this.tsParseInOutModifiers.bind(this));
                if (typeParameters)
                    node.typeParameters = typeParameters;
            }
            parseClassPropertyAnnotation(node) {
                if (!node.optional) {
                    if (this.value === '!' && this.eat(tt.prefix)) {
                        node.definite = true;
                    }
                    else if (this.eat(tt.question)) {
                        node.optional = true;
                    }
                }
                const type = this.tsTryParseTypeAnnotation();
                if (type)
                    node.typeAnnotation = type;
            }
            parseClassField(field) {
                const isPrivate = field.key.type === 'PrivateIdentifier';
                if (isPrivate) {
                    if (field.abstract) {
                        this.raise(field.start, TypeScriptError.PrivateElementHasAbstract);
                    }
                    if (field.accessibility) {
                        this.raise(field.start, TypeScriptError.PrivateElementHasAccessibility({
                            modifier: field.accessibility
                        }));
                    }
                    this.parseClassPropertyAnnotation(field);
                }
                else {
                    this.parseClassPropertyAnnotation(field);
                    if (this.isAmbientContext &&
                        !(field.readonly && !field.typeAnnotation) &&
                        this.match(tt.eq)) {
                        this.raise(this.start, TypeScriptError.DeclareClassFieldHasInitializer);
                    }
                    if (field.abstract && this.match(tt.eq)) {
                        const { key } = field;
                        this.raise(this.start, TypeScriptError.AbstractPropertyHasInitializer({
                            propertyName: key.type === 'Identifier' && !field.computed
                                ? key.name
                                : `[${this.input.slice(key.start, key.end)}]`
                        }));
                    }
                }
                return super.parseClassField(field);
            }
            parseClassMethod(method, isGenerator, isAsync, allowsDirectSuper) {
                const isConstructor = method.kind === 'constructor';
                const isPrivate = method.key.type === 'PrivateIdentifier';
                const typeParameters = this.tsTryParseTypeParameters();
                // start typescript parse class method
                if (isPrivate) {
                    if (typeParameters)
                        method.typeParameters = typeParameters;
                    if (method.accessibility) {
                        this.raise(method.start, TypeScriptError.PrivateMethodsHasAccessibility({
                            modifier: method.accessibility
                        }));
                    }
                }
                else {
                    if (typeParameters && isConstructor) {
                        this.raise(typeParameters.start, TypeScriptError.ConstructorHasTypeParameters);
                    }
                }
                const { declare = false, kind } = method;
                if (declare && (kind === 'get' || kind === 'set')) {
                    this.raise(method.start, TypeScriptError.DeclareAccessor({ kind }));
                }
                if (typeParameters)
                    method.typeParameters = typeParameters;
                // end
                // Check key and flags
                const key = method.key;
                if (method.kind === 'constructor') {
                    if (isGenerator)
                        this.raise(key.start, 'Constructor can\'t be a generator');
                    if (isAsync)
                        this.raise(key.start, 'Constructor can\'t be an async method');
                }
                else if (method.static && checkKeyName(method, 'prototype')) {
                    this.raise(key.start, 'Classes may not have a static property named prototype');
                }
                // Parse value
                const value = method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper, true, method);
                // Check value
                if (method.kind === 'get' && value['params'].length !== 0)
                    this.raiseRecoverable(value.start, 'getter should have no params');
                if (method.kind === 'set' && value['params'].length !== 1)
                    this.raiseRecoverable(value.start, 'setter should have exactly one param');
                if (method.kind === 'set' && value['params'][0].type === 'RestElement')
                    this.raiseRecoverable(value['params'][0].start, 'Setter cannot use rest params');
                return this.finishNode(method, 'MethodDefinition');
            }
            isClassMethod() {
                return this.match(tt.relational);
            }
            parseClassElement(constructorAllowsSuper) {
                if (this.eat(tt.semi))
                    return null;
                const ecmaVersion = this.options.ecmaVersion;
                let node = this.startNode();
                let keyName = '';
                let isGenerator = false;
                let isAsync = false;
                let kind = 'method';
                let isStatic = false;
                // todo parseClassMember
                // --- start parseClassMember extension
                const modifiers = [
                    'declare',
                    'private',
                    'public',
                    'protected',
                    'accessor',
                    'override',
                    'abstract',
                    'readonly',
                    'static'
                ];
                const modifierMap = this.tsParseModifiers({
                    modified: node,
                    allowedModifiers: modifiers,
                    disallowedModifiers: ['in', 'out'],
                    stopOnStartOfClassStaticBlock: true,
                    errorTemplate: TypeScriptError.InvalidModifierOnTypeParameterPositions
                });
                isStatic = Boolean(modifierMap.static);
                const callParseClassMemberWithIsStatic = () => {
                    if (this.tsIsStartOfStaticBlocks()) {
                        this.next(); // eat "static"
                        this.next(); // eat "{"
                        if (this.tsHasSomeModifiers(node, modifiers)) {
                            this.raise(this.start, TypeScriptError.StaticBlockCannotHaveModifier);
                        }
                        if (ecmaVersion >= 13) {
                            super.parseClassStaticBlock(node);
                            return node;
                        }
                    }
                    else {
                        // todo parseClassMemberWithIsStatic
                        // --- start ts extension
                        const idx = this.tsTryParseIndexSignature(node);
                        if (idx) {
                            if (node.abstract) {
                                this.raise(node.start, TypeScriptError.IndexSignatureHasAbstract);
                            }
                            if (node.accessibility) {
                                this.raise(node.start, TypeScriptError.IndexSignatureHasAccessibility({
                                    modifier: node.accessibility
                                }));
                            }
                            if (node.declare) {
                                this.raise(node.start, TypeScriptError.IndexSignatureHasDeclare);
                            }
                            if (node.override) {
                                this.raise(node.start, TypeScriptError.IndexSignatureHasOverride);
                            }
                            return idx;
                        }
                        if (!this.inAbstractClass && node.abstract) {
                            this.raise(node.start, TypeScriptError.NonAbstractClassHasAbstractMethod);
                        }
                        if (node.override) {
                            if (constructorAllowsSuper) {
                                this.raise(node.start, TypeScriptError.OverrideNotInSubClass);
                            }
                        }
                        // --- start
                        node.static = isStatic;
                        if (isStatic) {
                            if (!(this.isClassElementNameStart() || this.type === tt.star)) {
                                keyName = 'static';
                            }
                        }
                        if (!keyName && ecmaVersion >= 8 && this.eatContextual('async')) {
                            if ((this.isClassElementNameStart() || this.type === tt.star) && !this.canInsertSemicolon()) {
                                isAsync = true;
                            }
                            else {
                                keyName = 'async';
                            }
                        }
                        if (!keyName && (ecmaVersion >= 9 || !isAsync) && this.eat(tt.star)) {
                            isGenerator = true;
                        }
                        if (!keyName && !isAsync && !isGenerator) {
                            const lastValue = this.value;
                            if (this.eatContextual('get') || this.eatContextual('set')) {
                                if (this.isClassElementNameStart()) {
                                    kind = lastValue;
                                }
                                else {
                                    keyName = lastValue;
                                }
                            }
                        }
                        // Parse element name
                        if (keyName) {
                            // 'async', 'get', 'set', or 'static' were not a keyword contextually.
                            // The last token is any of those. Make it the element name.
                            node.computed = false;
                            node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc);
                            node.key.name = keyName;
                            this.finishNode(node.key, 'Identifier');
                        }
                        else {
                            this.parseClassElementName(node);
                        }
                        this.parsePostMemberNameModifiers(node);
                        // Parse element value
                        if (this.isClassMethod() || ecmaVersion < 13 || this.type === tt.parenL || kind !== 'method' || isGenerator || isAsync) {
                            const isConstructor = !node.static && checkKeyName(node, 'constructor');
                            const allowsDirectSuper = isConstructor && constructorAllowsSuper;
                            // Couldn't move this check into the 'parseClassMethod' method for backward compatibility.
                            if (isConstructor && kind !== 'method')
                                this.raise(node.key.start, 'Constructor can\'t have get/set modifier');
                            node.kind = isConstructor ? 'constructor' : kind;
                            this.parseClassMethod(node, isGenerator, isAsync, allowsDirectSuper);
                        }
                        else {
                            this.parseClassField(node);
                        }
                        return node;
                    }
                };
                if (node.declare) {
                    this.tsInAmbientContext(callParseClassMemberWithIsStatic);
                }
                else {
                    callParseClassMemberWithIsStatic();
                }
                // --- end
                return node;
            }
            isClassElementNameStart() {
                if (this.tsIsIdentifier()) {
                    return true;
                }
                return super.isClassElementNameStart();
            }
            parseClassSuper(node) {
                super.parseClassSuper(node);
                // handle `extends f<<T>
                if (node.superClass && (this.match(tt.relational) || this.match(tt.bitShift))) {
                    node.superTypeParameters = this.tsParseTypeArgumentsInExpression();
                }
                if (this.eatContextual('implements')) {
                    node.implements = this.tsParseHeritageClause('implements');
                }
            }
            parseFunctionParams(node) {
                const typeParameters = this.tsTryParseTypeParameters();
                if (typeParameters)
                    node.typeParameters = typeParameters;
                super.parseFunctionParams(node);
            }
            // `let x: number;`
            parseVarId(decl, kind) {
                super.parseVarId(decl, kind);
                if (decl.id.type === 'Identifier' &&
                    !this.hasPrecedingLineBreak() &&
                    this.value === '!' &&
                    this.eat(tt.prefix)) {
                    decl.definite = true;
                }
                const type = this.tsTryParseTypeAnnotation();
                if (type) {
                    decl.id.typeAnnotation = type;
                    this.resetEndLocation(decl.id); // set end position to end of type
                }
            }
            // parse the return type of an async arrow function - let foo = (async (): number => {});
            parseArrowExpression(node, params, isAsync, forInit) {
                if (this.match(tt.colon)) {
                    node.returnType = this.tsParseTypeAnnotation();
                }
                // origin parseArrowExpression
                let oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
                this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
                this.initFunction(node);
                const oldMaybeInArrowParameters = this.maybeInArrowParameters;
                if (this.options.ecmaVersion >= 8)
                    node.async = !!isAsync;
                this.yieldPos = 0;
                this.awaitPos = 0;
                this.awaitIdentPos = 0;
                this.maybeInArrowParameters = true;
                node.params = this.toAssignableList(params, true);
                this.maybeInArrowParameters = false;
                this.parseFunctionBody(node, true, false, forInit);
                this.yieldPos = oldYieldPos;
                this.awaitPos = oldAwaitPos;
                this.awaitIdentPos = oldAwaitIdentPos;
                this.maybeInArrowParameters = oldMaybeInArrowParameters;
                return this.finishNode(node, 'ArrowFunctionExpression');
                // end
            }
            parseMaybeAssignOrigin(forInit, refDestructuringErrors, afterLeftParse) {
                if (this.isContextual('yield')) {
                    if (this.inGenerator)
                        return this.parseYield(forInit);
                    // The tokenizer will assume an expression is allowed after
                    // `yield`, but this isn't that kind of yield
                    else
                        this.exprAllowed = false;
                }
                let ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1, oldDoubleProto = -1;
                if (refDestructuringErrors) {
                    oldParenAssign = refDestructuringErrors.parenthesizedAssign;
                    oldTrailingComma = refDestructuringErrors.trailingComma;
                    oldDoubleProto = refDestructuringErrors.doubleProto;
                    refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
                }
                else {
                    refDestructuringErrors = new DestructuringErrors;
                    ownDestructuringErrors = true;
                }
                let startPos = this.start, startLoc = this.startLoc;
                if (this.type === tt.parenL || tokenIsIdentifier(this.type)) {
                    this.potentialArrowAt = this.start;
                    this.potentialArrowInForAwait = forInit === 'await';
                }
                let left = this.parseMaybeConditional(forInit, refDestructuringErrors);
                if (afterLeftParse)
                    left = afterLeftParse.call(this, left, startPos, startLoc);
                if (this.type.isAssign) {
                    let node = this.startNodeAt(startPos, startLoc);
                    node.operator = this.value;
                    if (this.type === tt.eq)
                        left = this.toAssignable(left, true, refDestructuringErrors);
                    if (!ownDestructuringErrors) {
                        refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
                    }
                    if (refDestructuringErrors.shorthandAssign >= left.start)
                        refDestructuringErrors.shorthandAssign = -1; // reset because shorthand default was used correctly
                    if (this.type === tt.eq)
                        this.checkLValPattern(left);
                    else
                        this.checkLValSimple(left);
                    node.left = left;
                    this.next();
                    node.right = this.parseMaybeAssign(forInit);
                    if (oldDoubleProto > -1)
                        refDestructuringErrors.doubleProto = oldDoubleProto;
                    return this.finishNode(node, 'AssignmentExpression');
                }
                else {
                    if (ownDestructuringErrors)
                        this.checkExpressionErrors(refDestructuringErrors, true);
                }
                if (oldParenAssign > -1)
                    refDestructuringErrors.parenthesizedAssign = oldParenAssign;
                if (oldTrailingComma > -1)
                    refDestructuringErrors.trailingComma = oldTrailingComma;
                return left;
            }
            parseMaybeAssign(forInit, refExpressionErrors, afterLeftParse) {
                // Note: When the JSX plugin is on, type assertions (`<T> x`) aren't valid syntax.
                let state;
                let jsx;
                let typeCast;
                if (this.matchJsx('jsxTagStart') || this.match(tt.relational)) {
                    // Prefer to parse JSX if possible. But may be an arrow fn.
                    state = this.cloneCurLookaheadState();
                    jsx = this.tryParse(() => this.parseMaybeAssignOrigin(forInit, refExpressionErrors, afterLeftParse), state);
                    /*:: invariant(!jsx.aborted) */
                    /*:: invariant(jsx.node != null) */
                    if (!jsx.error)
                        return jsx.node;
                    // Remove `tc.j_expr` or `tc.j_oTag` from context added
                    // by parsing `jsxTagStart` to stop the JSX plugin from
                    // messing with the tokens
                    const context = this.context;
                    const currentContext = context[context.length - 1];
                    const lastCurrentContext = context[context.length - 2];
                    if (currentContext === acornTypeScript.tokContexts.tc_oTag && lastCurrentContext === acornTypeScript.tokContexts.tc_expr) {
                        context.pop();
                        context.pop();
                    }
                    else if (currentContext === acornTypeScript.tokContexts.tc_oTag || currentContext === acornTypeScript.tokContexts.tc_expr) {
                        context.pop();
                    }
                }
                if (!(jsx === null || jsx === void 0 ? void 0 : jsx.error) && !this.match(tt.relational)) {
                    return this.parseMaybeAssignOrigin(forInit, refExpressionErrors, afterLeftParse);
                }
                // Either way, we're looking at a '<': tt.jsxTagStart or relational.
                // If the state was cloned in the JSX parsing branch above but there
                // have been any error in the tryParse call, this.state is set to state
                // so we still need to clone it.
                if (!state || this.compareLookaheadState(state, this.getCurLookaheadState())) {
                    state = this.cloneCurLookaheadState();
                }
                let typeParameters;
                const arrow = this.tryParse(abort => {
                    var _a;
                    // This is similar to TypeScript's `tryParseParenthesizedArrowFunctionExpression`.
                    typeParameters = this.tsParseTypeParameters();
                    const expr = this.parseMaybeAssignOrigin(forInit, refExpressionErrors, afterLeftParse);
                    if (expr.type !== 'ArrowFunctionExpression' ||
                        ((_a = expr.extra) === null || _a === void 0 ? void 0 : _a.parenthesized)) {
                        abort();
                    }
                    // Correct TypeScript code should have at least 1 type parameter, but don't crash on bad code.
                    if ((typeParameters === null || typeParameters === void 0 ? void 0 : typeParameters.params.length) !== 0) {
                        this.resetStartLocationFromNode(expr, typeParameters);
                    }
                    expr.typeParameters = typeParameters;
                    return expr;
                }, state);
                /*:: invariant(arrow.node != null) */
                if (!arrow.error && !arrow.aborted) {
                    // This error is reported outside of the this.tryParse call so that
                    // in case of <T>(x) => 2, we don't consider <T>(x) as a type assertion
                    // because of this error.
                    if (typeParameters)
                        this.reportReservedArrowTypeParam(typeParameters);
                    return arrow.node;
                }
                if (!jsx) {
                    // Try parsing a type cast instead of an arrow function.
                    // This will never happen outside of JSX.
                    // (Because in JSX the '<' should be a jsxTagStart and not a relational.
                    // this will always be true
                    // assert(!this.hasPlugin('jsx'))
                    assert(true);
                    // This will start with a type assertion (via parseMaybeUnary).
                    // But don't directly call `this.tsParseTypeAssertion` because we want to handle any binary after it.
                    typeCast = this.tryParse(() => this.parseMaybeAssignOrigin(forInit, refExpressionErrors, afterLeftParse), state);
                    /*:: invariant(!typeCast.aborted) */
                    /*:: invariant(typeCast.node != null) */
                    if (!typeCast.error)
                        return typeCast.node;
                }
                if (jsx === null || jsx === void 0 ? void 0 : jsx.node) {
                    /*:: invariant(jsx.failState) */
                    this.setLookaheadState(jsx.failState);
                    return jsx.node;
                }
                if (arrow.node) {
                    /*:: invariant(arrow.failState) */
                    this.setLookaheadState(arrow.failState);
                    if (typeParameters)
                        this.reportReservedArrowTypeParam(typeParameters);
                    return arrow.node;
                }
                if (typeCast === null || typeCast === void 0 ? void 0 : typeCast.node) {
                    /*:: invariant(typeCast.failState) */
                    this.setLookaheadState(typeCast.failState);
                    return typeCast.node;
                }
                if (jsx === null || jsx === void 0 ? void 0 : jsx.thrown)
                    throw jsx.error;
                if (arrow.thrown)
                    throw arrow.error;
                if (typeCast === null || typeCast === void 0 ? void 0 : typeCast.thrown)
                    throw typeCast.error;
                throw (jsx === null || jsx === void 0 ? void 0 : jsx.error) || arrow.error || (typeCast === null || typeCast === void 0 ? void 0 : typeCast.error);
            }
            parseAssignableListItem(allowModifiers) {
                const decorators = [];
                while (this.match(tokTypes.at)) {
                    decorators.push(this.parseDecorator());
                }
                // Store original location/position to include modifiers in range
                const startPos = this.start;
                const startLoc = this.startLoc;
                let accessibility;
                let readonly = false;
                let override = false;
                if (allowModifiers !== undefined) {
                    const modified = {};
                    this.tsParseModifiers({
                        modified,
                        allowedModifiers: [
                            'public',
                            'private',
                            'protected',
                            'override',
                            'readonly'
                        ]
                    });
                    accessibility = modified.accessibility;
                    override = modified.override;
                    readonly = modified.readonly;
                    if (allowModifiers === false &&
                        (accessibility || readonly || override)) {
                        this.raise(startLoc.start, TypeScriptError.UnexpectedParameterModifier);
                    }
                }
                const left = this.parseMaybeDefault(startPos, startLoc);
                this.parseBindingListItem(left);
                const elt = this.parseMaybeDefault(left['start'], left['loc'], left);
                if (decorators.length) {
                    elt.decorators = decorators;
                }
                if (accessibility || readonly || override) {
                    const pp = this.startNodeAt(startPos, startLoc);
                    if (accessibility)
                        pp.accessibility = accessibility;
                    if (readonly)
                        pp.readonly = readonly;
                    if (override)
                        pp.override = override;
                    if (elt.type !== 'Identifier' && elt.type !== 'AssignmentPattern') {
                        this.raise(pp.start, TypeScriptError.UnsupportedParameterPropertyKind);
                    }
                    pp.parameter = elt;
                    return this.finishNode(pp, 'TSParameterProperty');
                }
                return elt;
            } // AssignmentPattern
            checkLValInnerPattern(expr, bindingType = BIND_NONE, checkClashes) {
                switch (expr.type) {
                    case 'TSParameterProperty':
                        this.checkLValInnerPattern(expr.parameter, bindingType, checkClashes);
                        break;
                    default: {
                        super.checkLValInnerPattern(expr, bindingType, checkClashes);
                        break;
                    }
                }
            }
            // Allow type annotations inside of a parameter list.
            parseBindingListItem(param) {
                if (this.eat(tt.question)) {
                    if (param.type !== 'Identifier' &&
                        !this.isAmbientContext &&
                        !this.inType) {
                        this.raise(param.start, TypeScriptError.PatternIsOptional);
                    }
                    param.optional = true;
                }
                const type = this.tsTryParseTypeAnnotation();
                if (type)
                    param.typeAnnotation = type;
                this.resetEndLocation(param);
                return param;
            }
            isAssignable(node, isBinding) {
                switch (node.type) {
                    case 'TSTypeCastExpression':
                        return this.isAssignable(node.expression, isBinding);
                    case 'TSParameterProperty':
                        return true;
                    case 'Identifier':
                    case 'ObjectPattern':
                    case 'ArrayPattern':
                    case 'AssignmentPattern':
                    case 'RestElement':
                        return true;
                    case 'ObjectExpression': {
                        const last = node.properties.length - 1;
                        return node.properties.every((prop, i) => {
                            return (prop.type !== 'ObjectMethod' &&
                                (i === last || prop.type !== 'SpreadElement') &&
                                this.isAssignable(prop));
                        });
                    }
                    case 'Property':
                    case 'ObjectProperty':
                        return this.isAssignable(node.value);
                    case 'SpreadElement':
                        return this.isAssignable(node.argument);
                    case 'ArrayExpression':
                        return node.elements.every(element => element === null || this.isAssignable(element));
                    case 'AssignmentExpression':
                        return node.operator === '=';
                    case 'ParenthesizedExpression':
                        return this.isAssignable(node.expression);
                    case 'MemberExpression':
                    case 'OptionalMemberExpression':
                        return !isBinding;
                    default:
                        return false;
                }
            }
            toAssignable(node, isBinding = false, refDestructuringErrors = new DestructuringErrors()) {
                switch (node.type) {
                    case 'ParenthesizedExpression':
                        return this.toAssignableParenthesizedExpression(node, isBinding, refDestructuringErrors);
                    case 'TSAsExpression':
                    case 'TSNonNullExpression':
                    case 'TSTypeAssertion':
                        if (isBinding) ;
                        else {
                            this.raise(node.start, TypeScriptError.UnexpectedTypeCastInParameter);
                        }
                        return this.toAssignable(node.expression, isBinding, refDestructuringErrors);
                    case 'MemberExpression':
                        // we just break member expression check here
                        break;
                    case 'AssignmentExpression':
                        if (!isBinding && node.left.type === 'TSTypeCastExpression') {
                            node.left = this.typeCastToParameter(node.left);
                        }
                        return super.toAssignable(node, isBinding, refDestructuringErrors);
                    case 'TSTypeCastExpression': {
                        return this.typeCastToParameter(node);
                    }
                    default:
                        return super.toAssignable(node, isBinding, refDestructuringErrors);
                }
                return node;
            }
            toAssignableParenthesizedExpression(node, isBinding, refDestructuringErrors) {
                switch (node.expression.type) {
                    case 'TSAsExpression':
                    case 'TSNonNullExpression':
                    case 'TSTypeAssertion':
                    case 'ParenthesizedExpression':
                        return this.toAssignable(node.expression, isBinding, refDestructuringErrors);
                    default:
                        return super.toAssignable(node, isBinding, refDestructuringErrors);
                }
            }
            curPosition() {
                if (this.options.locations) {
                    const position = super.curPosition();
                    Object.defineProperty(position, 'offset', {
                        get() {
                            return function (n) {
                                const np = new _acorn.Position(this.line, this.column + n);
                                np['index'] = this['index'] + n;
                                return np;
                            };
                        }
                    });
                    position['index'] = this.pos;
                    return position;
                }
            }
            parseBindingAtom() {
                switch (this.type) {
                    case tt._this:
                        // "this" may be the name of a parameter, so allow it.
                        return this.parseIdent(/* liberal */ true);
                    default:
                        return super.parseBindingAtom();
                }
            }
            shouldParseArrow(exprList) {
                let shouldParseArrowRes;
                if (this.match(tt.colon)) {
                    shouldParseArrowRes = exprList.every(expr => this.isAssignable(expr, true));
                }
                else {
                    shouldParseArrowRes = !this.canInsertSemicolon();
                }
                if (shouldParseArrowRes) {
                    if (this.match(tt.colon)) {
                        const result = this.tryParse(abort => {
                            const returnType = this.tsParseTypeOrTypePredicateAnnotation(tt.colon);
                            if (this.canInsertSemicolon() || !this.match(tt.arrow))
                                abort();
                            return returnType;
                        });
                        if (result.aborted) {
                            this.shouldParseArrowReturnType = undefined;
                            return false;
                        }
                        if (!result.thrown) {
                            if (result.error)
                                this.setLookaheadState(result.failState);
                            this.shouldParseArrowReturnType = result.node;
                        }
                    }
                    if (!this.match(tt.arrow)) {
                        // this will be useless if it's not arrow token here
                        this.shouldParseArrowReturnType = undefined;
                        return false;
                    }
                    return true;
                }
                this.shouldParseArrowReturnType = undefined;
                return shouldParseArrowRes;
            }
            parseParenArrowList(startPos, startLoc, exprList, forInit) {
                const node = this.startNodeAt(startPos, startLoc);
                node.returnType = this.shouldParseArrowReturnType;
                this.shouldParseArrowReturnType = undefined;
                return this.parseArrowExpression(node, exprList, false, forInit);
            }
            parseParenAndDistinguishExpression(canBeArrow, forInit) {
                let startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
                if (this.options.ecmaVersion >= 6) {
                    const oldMaybeInArrowParameters = this.maybeInArrowParameters;
                    this.maybeInArrowParameters = true;
                    this.next();
                    let innerStartPos = this.start, innerStartLoc = this.startLoc;
                    let exprList = [], first = true, lastIsComma = false;
                    let refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
                    this.yieldPos = 0;
                    this.awaitPos = 0;
                    // Do not save awaitIdentPos to allow checking awaits nested in parameters
                    while (this.type !== tt.parenR) {
                        first ? first = false : this.expect(tt.comma);
                        if (allowTrailingComma && this.afterTrailingComma(tt.parenR, true)) {
                            lastIsComma = true;
                            break;
                        }
                        else if (this.type === tt.ellipsis) {
                            spreadStart = this.start;
                            exprList.push(this.parseParenItem(this.parseRestBinding()));
                            if (this.type === tt.comma) {
                                this.raise(this.start, 'Comma is not permitted after the rest element');
                            }
                            break;
                        }
                        else {
                            exprList.push(this.parseMaybeAssign(forInit, refDestructuringErrors, this.parseParenItem));
                        }
                    }
                    let innerEndPos = this.lastTokEnd, innerEndLoc = this.lastTokEndLoc;
                    this.expect(tt.parenR);
                    this.maybeInArrowParameters = oldMaybeInArrowParameters;
                    if (canBeArrow &&
                        this.shouldParseArrow(exprList) &&
                        this.eat(tt.arrow)) {
                        this.checkPatternErrors(refDestructuringErrors, false);
                        this.checkYieldAwaitInDefaultParams();
                        this.yieldPos = oldYieldPos;
                        this.awaitPos = oldAwaitPos;
                        return this.parseParenArrowList(startPos, startLoc, exprList, forInit);
                    }
                    if (!exprList.length || lastIsComma)
                        this.unexpected(this.lastTokStart);
                    if (spreadStart)
                        this.unexpected(spreadStart);
                    this.checkExpressionErrors(refDestructuringErrors, true);
                    this.yieldPos = oldYieldPos || this.yieldPos;
                    this.awaitPos = oldAwaitPos || this.awaitPos;
                    if (exprList.length > 1) {
                        val = this.startNodeAt(innerStartPos, innerStartLoc);
                        val.expressions = exprList;
                        this.finishNodeAt(val, 'SequenceExpression', innerEndPos, innerEndLoc);
                    }
                    else {
                        val = exprList[0];
                    }
                }
                else {
                    val = this.parseParenExpression();
                }
                if (this.options.preserveParens) {
                    let par = this.startNodeAt(startPos, startLoc);
                    par.expression = val;
                    return this.finishNode(par, 'ParenthesizedExpression');
                }
                else {
                    return val;
                }
            }
            parseTaggedTemplateExpression(base, startPos, startLoc, optionalChainMember) {
                const node = this.startNodeAt(startPos, startLoc);
                node.tag = base;
                node.quasi = this.parseTemplate({ isTagged: true });
                if (optionalChainMember) {
                    this.raise(startPos, 'Tagged Template Literals are not allowed'
                        + ' in'
                        + ' optionalChain.');
                }
                return this.finishNode(node, 'TaggedTemplateExpression');
            }
            shouldParseAsyncArrow() {
                if (this.match(tt.colon)) {
                    const result = this.tryParse(abort => {
                        const returnType = this.tsParseTypeOrTypePredicateAnnotation(tt.colon);
                        if (this.canInsertSemicolon() || !this.match(tt.arrow))
                            abort();
                        return returnType;
                    });
                    if (result.aborted) {
                        this.shouldParseAsyncArrowReturnType = undefined;
                        return false;
                    }
                    if (!result.thrown) {
                        if (result.error)
                            this.setLookaheadState(result.failState);
                        this.shouldParseAsyncArrowReturnType = result.node;
                        return !this.canInsertSemicolon() && this.eat(tt.arrow);
                    }
                }
                else {
                    return !this.canInsertSemicolon() && this.eat(tt.arrow);
                }
            }
            parseSubscriptAsyncArrow(startPos, startLoc, exprList, forInit) {
                const arrN = this.startNodeAt(startPos, startLoc);
                arrN.returnType = this.shouldParseAsyncArrowReturnType;
                this.shouldParseAsyncArrowReturnType = undefined;
                return this.parseArrowExpression(arrN, exprList, true, forInit);
            }
            parseExprList(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
                let elts = [], first = true;
                while (!this.eat(close)) {
                    if (!first) {
                        this.expect(tt.comma);
                        if (allowTrailingComma && this.afterTrailingComma(close))
                            break;
                    }
                    else
                        first = false;
                    let elt;
                    if (allowEmpty && this.type === tt.comma)
                        elt = null;
                    else if (this.type === tt.ellipsis) {
                        elt = this.parseSpread(refDestructuringErrors);
                        if (refDestructuringErrors && this.type === tt.comma && refDestructuringErrors.trailingComma < 0)
                            refDestructuringErrors.trailingComma = this.start;
                    }
                    else {
                        elt = this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem);
                    }
                    elts.push(elt);
                }
                return elts;
            }
            parseSubscript(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit) {
                let _optionalChained = optionalChained;
                // --- start extend parseSubscript
                if (!this.hasPrecedingLineBreak() &&
                    // NODE: replace bang
                    this.value === '!' &&
                    this.match(tt.prefix)) {
                    // When ! is consumed as a postfix operator (non-null assertion),
                    // disallow JSX tag forming after. e.g. When parsing `p! < n.p!`
                    // `<n.p` can not be a start of JSX tag
                    this.exprAllowed = false;
                    this.next();
                    const nonNullExpression = this.startNodeAt(startPos, startLoc);
                    nonNullExpression.expression = base;
                    base = this.finishNode(nonNullExpression, 'TSNonNullExpression');
                    return base;
                }
                let isOptionalCall = false;
                if (this.match(tt.questionDot) &&
                    this.lookaheadCharCode() === 60) {
                    if (noCalls) {
                        // NODE: we don't need to change state's stop to false.
                        // state.stop = true
                        return base;
                    }
                    base.optional = true;
                    _optionalChained = isOptionalCall = true;
                    this.next();
                }
                // handles 'f<<T>'
                if (this.match(tt.relational) || this.match(tt.bitShift)) {
                    let missingParenErrorLoc;
                    // tsTryParseAndCatch is expensive, so avoid if not necessary.
                    // There are number of things we are going to "maybe" parse, like type arguments on
                    // tagged template expressions. If any of them fail, walk it back and continue.
                    const result = this.tsTryParseAndCatch(() => {
                        if (!noCalls && this.atPossibleAsyncArrow(base)) {
                            // Almost certainly this is a generic async function `async <T>() => ...
                            // But it might be a call with a type argument `async<T>();`
                            const asyncArrowFn = this.tsTryParseGenericAsyncArrowFunction(startPos, startLoc, forInit);
                            if (asyncArrowFn) {
                                base = asyncArrowFn;
                                return base;
                            }
                        }
                        const typeArguments = this.tsParseTypeArgumentsInExpression();
                        if (!typeArguments)
                            return base;
                        if (isOptionalCall && !this.match(tt.parenL)) {
                            missingParenErrorLoc = this.curPosition();
                            return base;
                        }
                        if (tokenIsTemplate(this.type)) {
                            const result = this.parseTaggedTemplateExpression(base, startPos, startLoc, _optionalChained);
                            result.typeParameters = typeArguments;
                            base = result;
                            return base;
                        }
                        if (!noCalls && this.eat(tt.parenL)) {
                            let refDestructuringErrors = new DestructuringErrors;
                            const node = this.startNodeAt(startPos, startLoc);
                            node.callee = base;
                            // possibleAsync always false here, because we would have handled it above.
                            node.arguments = this.parseExprList(tt.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
                            // Handles invalid case: `f<T>(a:b)`
                            this.tsCheckForInvalidTypeCasts(node.arguments);
                            node.typeParameters = typeArguments;
                            if (_optionalChained) {
                                node.optional = isOptionalCall;
                            }
                            this.checkExpressionErrors(refDestructuringErrors, true);
                            base = this.finishNode(node, 'CallExpression');
                            return base;
                        }
                        const tokenType = this.type;
                        if (
                        // a<b>>c is not (a<b>)>c, but a<(b>>c)
                        tokenType === tt.relational ||
                            // a<b>>>c is not (a<b>)>>c, but a<(b>>>c)
                            tokenType === tt.bitShift ||
                            // a<b>c is (a<b)>c
                            (tokenType !== tt.parenL &&
                                tokenCanStartExpression(tokenType) &&
                                !this.hasPrecedingLineBreak())) {
                            // Bail out.
                            return base;
                        }
                        const node = this.startNodeAt(startPos, startLoc);
                        node.expression = base;
                        node.typeParameters = typeArguments;
                        base = this.finishNode(node, 'TSInstantiationExpression');
                        return base;
                    });
                    if (missingParenErrorLoc) {
                        this.unexpected(missingParenErrorLoc);
                    }
                    if (result) {
                        if (result.type === 'TSInstantiationExpression' &&
                            (this.match(tt.dot) ||
                                (this.match(tt.questionDot) &&
                                    this.lookaheadCharCode() !== 40))) {
                            this.raise(this.start, TypeScriptError.InvalidPropertyAccessAfterInstantiationExpression);
                        }
                        base = result;
                        return base;
                    }
                }
                // --- end
                let optionalSupported = this.options.ecmaVersion >= 11;
                let optional = optionalSupported && this.eat(tt.questionDot);
                if (noCalls && optional)
                    this.raise(this.lastTokStart, 'Optional chaining cannot appear in the callee of new expressions');
                let computed = this.eat(tt.bracketL);
                if (computed || (optional && this.type !== tt.parenL && this.type !== tt.backQuote) || this.eat(tt.dot)) {
                    let node = this.startNodeAt(startPos, startLoc);
                    node.object = base;
                    if (computed) {
                        node.property = this.parseExpression();
                        this.expect(tt.bracketR);
                    }
                    else if (this.type === tt.privateId && base.type !== 'Super') {
                        node.property = this.parsePrivateIdent();
                    }
                    else {
                        node.property = this.parseIdent(this.options.allowReserved !== 'never');
                    }
                    node.computed = !!computed;
                    if (optionalSupported) {
                        node.optional = optional;
                    }
                    base = this.finishNode(node, 'MemberExpression');
                }
                else if (!noCalls && this.eat(tt.parenL)) {
                    const oldMaybeInArrowParameters = this.maybeInArrowParameters;
                    this.maybeInArrowParameters = true;
                    let refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
                    this.yieldPos = 0;
                    this.awaitPos = 0;
                    this.awaitIdentPos = 0;
                    let exprList = this.parseExprList(tt.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
                    if (maybeAsyncArrow && !optional && this.shouldParseAsyncArrow()) {
                        this.checkPatternErrors(refDestructuringErrors, false);
                        this.checkYieldAwaitInDefaultParams();
                        if (this.awaitIdentPos > 0)
                            this.raise(this.awaitIdentPos, 'Cannot use \'await\' as identifier inside an async function');
                        this.yieldPos = oldYieldPos;
                        this.awaitPos = oldAwaitPos;
                        this.awaitIdentPos = oldAwaitIdentPos;
                        base = this.parseSubscriptAsyncArrow(startPos, startLoc, exprList, forInit);
                    }
                    else {
                        this.checkExpressionErrors(refDestructuringErrors, true);
                        this.yieldPos = oldYieldPos || this.yieldPos;
                        this.awaitPos = oldAwaitPos || this.awaitPos;
                        this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
                        let node = this.startNodeAt(startPos, startLoc);
                        node.callee = base;
                        node.arguments = exprList;
                        if (optionalSupported) {
                            node.optional = optional;
                        }
                        base = this.finishNode(node, 'CallExpression');
                    }
                    this.maybeInArrowParameters = oldMaybeInArrowParameters;
                }
                else if (this.type === tt.backQuote) {
                    // NOTE: change to _optionalChained
                    if (optional || _optionalChained) {
                        this.raise(this.start, 'Optional chaining cannot appear in the tag of tagged template expressions');
                    }
                    let node = this.startNodeAt(startPos, startLoc);
                    node.tag = base;
                    node.quasi = this.parseTemplate({ isTagged: true });
                    base = this.finishNode(node, 'TaggedTemplateExpression');
                }
                return base;
            }
            parseGetterSetter(prop) {
                prop.kind = prop.key.name;
                this.parsePropertyName(prop);
                prop.value = this.parseMethod(false);
                // here is getGetterSetterExpectedParamCount
                let paramCount = prop.kind === 'get' ? 0 : 1;
                const firstParam = prop.value.params[0];
                const hasContextParam = firstParam && this.isThisParam(firstParam);
                paramCount = hasContextParam ? paramCount + 1 : paramCount;
                // end
                if (prop.value.params.length !== paramCount) {
                    let start = prop.value.start;
                    if (prop.kind === 'get')
                        this.raiseRecoverable(start, 'getter should have no params');
                    else
                        this.raiseRecoverable(start, 'setter should have exactly one param');
                }
                else {
                    if (prop.kind === 'set' && prop.value.params[0].type === 'RestElement')
                        this.raiseRecoverable(prop.value.params[0].start, 'Setter cannot use rest params');
                }
            }
            parseProperty(isPattern, refDestructuringErrors) {
                if (!isPattern) {
                    let decorators = [];
                    if (this.match(tokTypes.at)) {
                        while (this.match(tokTypes.at)) {
                            decorators.push(this.parseDecorator());
                        }
                    }
                    const property = super.parseProperty(isPattern, refDestructuringErrors);
                    if (property.type === 'SpreadElement') {
                        if (decorators.length)
                            this.raise(property.start, DecoratorsError.SpreadElementDecorator);
                    }
                    if (decorators.length) {
                        property.decorators = decorators;
                        decorators = [];
                    }
                    return property;
                }
                return super.parseProperty(isPattern, refDestructuringErrors);
            }
            parseCatchClauseParam() {
                const param = this.parseBindingAtom();
                let simple = param.type === 'Identifier';
                this.enterScope(simple ? acornScope.SCOPE_SIMPLE_CATCH : 0);
                this.checkLValPattern(param, simple ? acornScope.BIND_SIMPLE_CATCH : acornScope.BIND_LEXICAL);
                // start add ts support
                const type = this.tsTryParseTypeAnnotation();
                if (type) {
                    param.typeAnnotation = type;
                    this.resetEndLocation(param);
                }
                this.expect(tt.parenR);
                return param;
            }
            parseClass(node, isStatement) {
                const oldInAbstractClass = this.inAbstractClass;
                this.inAbstractClass = !!node.abstract;
                try {
                    this.next();
                    this.takeDecorators(node);
                    // ---start origin parseClass
                    // ecma-262 14.6 Class Definitions
                    // A class definition is always strict mode code.
                    const oldStrict = this.strict;
                    this.strict = true;
                    this.parseClassId(node, isStatement);
                    this.parseClassSuper(node);
                    const privateNameMap = this.enterClassBody();
                    const classBody = this.startNode();
                    let hadConstructor = false;
                    classBody.body = [];
                    let decorators = [];
                    this.expect(tt.braceL);
                    while (this.type !== tt.braceR) {
                        if (this.match(tokTypes.at)) {
                            decorators.push(this.parseDecorator());
                            continue;
                        }
                        const element = this.parseClassElement(node.superClass !== null);
                        if (decorators.length) {
                            element.decorators = decorators;
                            this.resetStartLocationFromNode(element, decorators[0]);
                            decorators = [];
                        }
                        if (element) {
                            classBody.body.push(element);
                            if (element.type === 'MethodDefinition' && element.kind === 'constructor' && element.value.type === 'FunctionExpression') {
                                if (hadConstructor) {
                                    this.raiseRecoverable(element.start, 'Duplicate constructor in the same class');
                                }
                                hadConstructor = true;
                                if (element.decorators && element.decorators.length > 0) {
                                    this.raise(element.start, DecoratorsError.DecoratorConstructor);
                                }
                            }
                            else if (element.key && element.key.type === 'PrivateIdentifier' && isPrivateNameConflicted(privateNameMap, element)) {
                                this.raiseRecoverable(element.key.start, `Identifier '#${element.key.name}' has already been declared`);
                            }
                        }
                    }
                    this.strict = oldStrict;
                    this.next();
                    if (decorators.length) {
                        this.raise(this.start, DecoratorsError.TrailingDecorator);
                    }
                    node.body = this.finishNode(classBody, 'ClassBody');
                    this.exitClassBody();
                    return this.finishNode(node, isStatement ? 'ClassDeclaration' : 'ClassExpression');
                    // ---end
                }
                finally {
                    this.inAbstractClass = oldInAbstractClass;
                }
            }
            parseClassFunctionParams() {
                const typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
                let params = this.parseBindingList(tt.parenR, false, this.options.ecmaVersion >= 8, true);
                if (typeParameters)
                    params.typeParameters = typeParameters;
                return params;
            }
            parseMethod(isGenerator, isAsync, allowDirectSuper, inClassScope, method) {
                let node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
                this.initFunction(node);
                if (this.options.ecmaVersion >= 6)
                    node.generator = isGenerator;
                if (this.options.ecmaVersion >= 8)
                    node.async = !!isAsync;
                this.yieldPos = 0;
                this.awaitPos = 0;
                this.awaitIdentPos = 0;
                this.enterScope(functionFlags(isAsync, node.generator) |
                    acornScope.SCOPE_SUPER |
                    (allowDirectSuper ? acornScope.SCOPE_DIRECT_SUPER : 0));
                this.expect(tt.parenL);
                node.params = this.parseClassFunctionParams();
                this.checkYieldAwaitInDefaultParams();
                this.parseFunctionBody(node, false, true, false, {
                    isClassMethod: inClassScope
                });
                this.yieldPos = oldYieldPos;
                this.awaitPos = oldAwaitPos;
                this.awaitIdentPos = oldAwaitIdentPos;
                if (method && method.abstract) {
                    const hasBody = !!node.body;
                    if (hasBody) {
                        const { key } = method;
                        this.raise(method.start, TypeScriptError.AbstractMethodHasImplementation({
                            methodName: key.type === 'Identifier' && !method.computed
                                ? key.name
                                : `[${this.input.slice(key.start, key.end)}]`
                        }));
                    }
                }
                return this.finishNode(node, 'FunctionExpression');
            }
            static parse(input, options) {
                if (options.locations === false) {
                    throw new Error(`You have to enable options.locations while using acorn-typescript`);
                }
                else {
                    options.locations = true;
                }
                const parser = new this(options, input);
                if (dts) {
                    parser.isAmbientContext = true;
                }
                return parser.parse();
            }
            static parseExpressionAt(input, pos, options) {
                if (options.locations === false) {
                    throw new Error(`You have to enable options.locations while using acorn-typescript`);
                }
                else {
                    options.locations = true;
                }
                const parser = new this(options, input, pos);
                if (dts) {
                    parser.isAmbientContext = true;
                }
                parser.nextToken();
                return parser.parseExpression();
            }
            parseImportSpecifier() {
                const isMaybeTypeOnly = this.ts_isContextual(tokTypes.type);
                if (isMaybeTypeOnly) {
                    let node = this.startNode();
                    node.imported = this.parseModuleExportName();
                    this.parseTypeOnlyImportExportSpecifier(node, 
                    /* isImport */ true, this.importOrExportOuterKind === 'type');
                    return this.finishNode(node, 'ImportSpecifier');
                }
                else {
                    const node = super.parseImportSpecifier();
                    node.importKind = 'value';
                    return node;
                }
            }
            parseExportSpecifier(exports) {
                const isMaybeTypeOnly = this.ts_isContextual(tokTypes.type);
                const isString = this.match(tt.string);
                if (!isString && isMaybeTypeOnly) {
                    let node = this.startNode();
                    node.local = this.parseModuleExportName();
                    this.parseTypeOnlyImportExportSpecifier(node, 
                    /* isImport */ false, this.importOrExportOuterKind === 'type');
                    this.finishNode(node, 'ExportSpecifier');
                    this.checkExport(exports, node.exported, node.exported.start);
                    return node;
                }
                else {
                    const node = super.parseExportSpecifier(exports);
                    node.exportKind = 'value';
                    return node;
                }
            }
            parseTypeOnlyImportExportSpecifier(node, isImport, isInTypeOnlyImportExport) {
                const leftOfAsKey = isImport ? 'imported' : 'local';
                const rightOfAsKey = isImport ? 'local' : 'exported';
                let leftOfAs = node[leftOfAsKey];
                let rightOfAs;
                let hasTypeSpecifier = false;
                let canParseAsKeyword = true;
                const loc = leftOfAs.start;
                if (this.isContextual('as')) {
                    // { type as ...? }
                    const firstAs = this.parseIdent();
                    if (this.isContextual('as')) {
                        // { type as as ...? }
                        const secondAs = this.parseIdent();
                        if (tokenIsKeywordOrIdentifier(this.type)) {
                            // { type as as something }
                            hasTypeSpecifier = true;
                            leftOfAs = firstAs;
                            rightOfAs = isImport
                                ? this.parseIdent()
                                : this.parseModuleExportName();
                            canParseAsKeyword = false;
                        }
                        else {
                            // { type as as }
                            rightOfAs = secondAs;
                            canParseAsKeyword = false;
                        }
                    }
                    else if (tokenIsKeywordOrIdentifier(this.type)) {
                        // { type as something }
                        canParseAsKeyword = false;
                        rightOfAs = isImport
                            ? this.parseIdent()
                            : this.parseModuleExportName();
                    }
                    else {
                        // { type as }
                        hasTypeSpecifier = true;
                        leftOfAs = firstAs;
                    }
                }
                else if (tokenIsKeywordOrIdentifier(this.type)) {
                    // { type something ...? }
                    hasTypeSpecifier = true;
                    if (isImport) {
                        leftOfAs = super.parseIdent(true);
                        if (!this.isContextual('as')) {
                            this.checkUnreserved(leftOfAs);
                        }
                    }
                    else {
                        leftOfAs = this.parseModuleExportName();
                    }
                }
                if (hasTypeSpecifier && isInTypeOnlyImportExport) {
                    this.raise(loc, isImport
                        ? TypeScriptError.TypeModifierIsUsedInTypeImports
                        : TypeScriptError.TypeModifierIsUsedInTypeExports);
                }
                node[leftOfAsKey] = leftOfAs;
                node[rightOfAsKey] = rightOfAs;
                const kindKey = isImport ? 'importKind' : 'exportKind';
                node[kindKey] = hasTypeSpecifier ? 'type' : 'value';
                if (canParseAsKeyword && this.eatContextual('as')) {
                    node[rightOfAsKey] = isImport
                        ? this.parseIdent()
                        : this.parseModuleExportName();
                }
                if (!node[rightOfAsKey]) {
                    node[rightOfAsKey] = this.copyNode(node[leftOfAsKey]);
                }
                if (isImport) {
                    this.checkLValSimple(node[rightOfAsKey], BIND_LEXICAL);
                }
            }
            raiseCommonCheck(pos, message, recoverable) {
                switch (message) {
                    case 'Comma is not permitted after the rest element': {
                        if (this.isAmbientContext &&
                            this.match(tt.comma) &&
                            this.lookaheadCharCode() === 41) {
                            this.next();
                            return;
                        }
                        else {
                            return super.raise(pos, message);
                        }
                    }
                }
                return recoverable ? super.raiseRecoverable(pos, message) : super.raise(pos, message);
            }
            raiseRecoverable(pos, message) {
                return this.raiseCommonCheck(pos, message, true);
            }
            raise(pos, message) {
                return this.raiseCommonCheck(pos, message, true);
            }
            updateContext(prevType) {
                const { type } = this;
                if (type == tt.braceL) {
                    var curContext = this.curContext();
                    if (curContext == tsTokContexts.tc_oTag)
                        this.context.push(tokContexts.b_expr);
                    else if (curContext == tsTokContexts.tc_expr)
                        this.context.push(tokContexts.b_tmpl);
                    else
                        super.updateContext(prevType);
                    this.exprAllowed = true;
                }
                else if (type === tt.slash && prevType === tokTypes.jsxTagStart) {
                    this.context.length -= 2; // do not consider JSX expr -> JSX open tag -> ... anymore
                    this.context.push(tsTokContexts.tc_cTag); // reconsider as closing
                    // tag context
                    this.exprAllowed = false;
                }
                else {
                    return super.updateContext(prevType);
                }
            }
            // Parses JSX opening tag starting after '<'.
            jsx_parseOpeningElementAt(startPos, startLoc) {
                let node = this.startNodeAt(startPos, startLoc);
                let nodeName = this.jsx_parseElementName();
                if (nodeName)
                    node.name = nodeName;
                if (this.match(tt.relational) || this.match(tt.bitShift)) {
                    const typeArguments = this.tsTryParseAndCatch(() => this.tsParseTypeArgumentsInExpression());
                    if (typeArguments)
                        node.typeParameters = typeArguments;
                }
                node.attributes = [];
                while (this.type !== tt.slash && this.type !== tokTypes.jsxTagEnd)
                    node.attributes.push(this.jsx_parseAttribute());
                node.selfClosing = this.eat(tt.slash);
                this.expect(tokTypes.jsxTagEnd);
                return this.finishNode(node, nodeName ? 'JSXOpeningElement' : 'JSXOpeningFragment');
            }
        }
        return TypeScriptParser;
    };
}

export { tsPlugin as default, tsPlugin };
