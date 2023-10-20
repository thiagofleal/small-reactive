echo off
IF NOT EXIST vendor @MKDIR vendor
CD "vendor\"
IF EXIST small-rxjs (
	CALL git -C small-rxjs fetch -tap
	CALL git -C small-rxjs checkout 1.0.1
) ELSE (
	CALL git clone -b 1.0.1 https://github.com/thiagofleal/small-rxjs small-rxjs
)
CD ..