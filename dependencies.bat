echo off
IF NOT EXIST vendor @MKDIR vendor
CD "vendor\"
CALL git clone https://github.com/thiagofleal/small-rxjs small-rxjs
CD small-rxjs
CALL git fetch https://github.com/thiagofleal/small-rxjs
CALL git pull https://github.com/thiagofleal/small-rxjs --tags
CALL git checkout 1.0.1
CD ..