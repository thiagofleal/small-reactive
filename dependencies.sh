#!/usr/bin/env bash
mkdir -p vendor/
cd vendor/
git clone https://github.com/thiagofleal/small-rxjs small-rxjs
cd small-rxjs
git fetch https://github.com/thiagofleal/small-rxjs && git checkout master
git pull https://github.com/thiagofleal/small-rxjs master
git checkout e833e111c2fb2acd734dddb818710a9f28eee2e0
cd ..