#!/bin/bash

SRC_DIR="./docs/"

# Check if target folder exists
if [ ! -d "$SRC_DIR" ]; then
  echo "Target directory does note exist"
  exit 1
fi

# Check if there are uncomitted changes
if ! [ "$(git status --porcelain 2>/dev/null)" == "" ]; then
  echo "There are uncomitted changes, cannot move files"
  exit 1
fi

# Switch to Github Pages Branch
git checkout gh-pages

# Copy directory from master branch
git checkout master -- $SRC_DIR

# Loop through the directories and files and move them level up
# mv -fv $SRC_DIR* ./
rsync -a $SRC_DIR* ./

# Remove SRC_DIR
rm -r $SRC_DIR
