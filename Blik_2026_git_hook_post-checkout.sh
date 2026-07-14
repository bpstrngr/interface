#!/bin/sh
 commit=$2;
 format="tacit";
 echo " Formatting new scope to $format.";
 node --experimental-detect-module ./Blik_2023_interface.js ./Blik_2026_git.js author $commit $format;