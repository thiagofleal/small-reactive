#!/usr/bin/env bash
mkdir -p vendor/
cd vendor/
git clone https://github.com/thiagofleal/small-rxjs small-rxjs
cd small-rxjs
git fetch https://github.com/thiagofleal/small-rxjs && git checkout master
git pull https://github.com/thiagofleal/small-rxjs master
git checkout fa307589262ae93d81ffd2301285f957520b3274
cd ..