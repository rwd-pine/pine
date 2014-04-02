#!/bin/bash

SRC_DIR="docs"

# Check if target folder exists
if [ ! -d "$SRC_DIR" ]; then
  exit 1
fi

# List content of SRC_DIR
CONTENT=`ls -l $SRC_DIR | awk '{print $9}'`

# Switch to Github Pages Branch
git checkout gh-pages

# Loop through the directories and files
# for ITEM in $CONTENT
# do
#   # Copy all necessary files and folders to gh-pages branch
#   git checkout master -- ${SRC_DIR}/${ITEM}
# done
git checkout master -- ${SRC_DIR}