#!/bin/bash
$(npm bin)/electron-packager . github-garden --out dist --platform=darwin --arch=x64 --version=0.34.3
if [[ $(git tag) == '' ]]; then
  git tag 'release-v0.0.0'
fi
oldVersion=$(git describe --tags | sed -e 's/release-//g' | sed -e 's/v//g')
oldBuildVersion=$(echo $oldVersion | sed -e 's/^[[:digit:]].[[:digit:]].//g')
currentBuildVersion=$(echo "$oldBuildVersion+1" | bc)
currentVersion=$(echo $oldVersion | sed -e 's/.[[:digit:]]*$//g').$currentBuildVersion
zip -r dist/github-garden-v$currentVersion-darwin-x64.zip dist/github-garden-darwin-x64
hub release create -p -m "github-garden v$currentVersion" -f dist/github-garden-darwin-v$currentVersion-x64.zip release-v$currentVersion
