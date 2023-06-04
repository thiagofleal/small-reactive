#!/usr/bin/env bash
mkdir -p vendor/
cd vendor/
git clone https://github.com/thiagofleal/small-rxjs small-rxjs
cd small-rxjs
git fetch https://github.com/thiagofleal/small-rxjs && git checkout master
git pull https://github.com/thiagofleal/small-rxjs master
git checkout e274752bf0259640fb3af0c9b345a2b814efd619
cd ..