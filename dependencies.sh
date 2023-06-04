#!/usr/bin/env bash
mkdir -p vendor/
cd vendor/
git clone https://github.com/thiagofleal/small-rxjs small-rxjs
cd small-rxjs
git fetch https://github.com/thiagofleal/small-rxjs && git checkout master
git pull https://github.com/thiagofleal/small-rxjs master
git checkout 2d3e038eaf79cd3316fc0dc44bb27c80f11d6e05
cd ..