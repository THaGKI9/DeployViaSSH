#### Description
  This is a deploy helper based on Gulp.js.
  How it works?
* compress the files
* upload to the server via SSH
* send command to the server to unpack the files via SSH
* run other commands

#### Usage
* configure the server and the deployment in `gulpfile.js`
* npm install
* npm install gulp-cli -g
* gulp deploy
