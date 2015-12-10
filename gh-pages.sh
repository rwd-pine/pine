#!/bin/bash

# Using git-subtree, we push specific folder to the branch

#
# This script copies docs to gh-pages branch
echo ">> Copy contents of docs to gh-pages branch"

export PLUGIN_ROOT=$( pwd )
echo ">> PLUGIN_ROOT nastaveno na $PLUGIN_ROOT"

echo ">> System: Checkout Master"
git checkout master 

echo ">> System: Creating local branch gh-pages for docs folder"
git subtree split --prefix docs -b gh-pages

echo ">> System: force the push of the gh-pages branch to the remote gh-pages branch at origin"
git push -f origin gh-pages:gh-pages

echo ">> System: delete the local gh-pages" 
git branch -D gh-pages

echo ">> Push to gh-pages is done"
exit 0
