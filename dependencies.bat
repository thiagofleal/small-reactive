echo off
IF NOT EXIST vendor @MKDIR vendor
CD vendor/
CALL git clone https://github.com/thiagofleal/small-rxjs small-rxjs
CD small-rxjs
CALL git fetch https://github.com/thiagofleal/small-rxjs
CALL git checkout master
CALL git pull https://github.com/thiagofleal/small-rxjs master
CALL git checkout fa307589262ae93d81ffd2301285f957520b3274
CD ..