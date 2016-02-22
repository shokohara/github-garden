#!/bin/bash
git clone https://github.com/github/hub.git
cd hub
script/build
cd ..
mv ./hub ~/bin
