#!/bin/sh
 echo "Re-applying stashed changes after commit."
 node --experimental-detect-module ./Blik_2023_interface.js ./Blik_2026_git.js apply stash;