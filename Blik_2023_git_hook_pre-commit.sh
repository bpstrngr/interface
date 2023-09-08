#!/bin/sh
 echo "Stashing unstaged changes...";
 git stash -q --keep-index;
 stage=$(git diff --name-only --cached);
for file in $(echo $stage);do
if [[ "$file" = *.js && -e "$file" ]];then 
 echo "Compiling staged $file...";
 cat $file |
 xargs -0 node ./Blik_2023_interface.js ./Blik_2023_meta.js compile > .compilation;
 mv .compilation $file;
 echo $file compiled.;
 node ./Blik_2023_interface.js ./Blik_2023_meta.js test $file;
fi;
done;
 git add -u;
 echo "Re-staged modules after compilation.";
 exit;
