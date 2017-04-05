const path = require('path');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const $ = {
    util: require('gulp-util'),
    ssh: require('gulp-ssh'),
    tar: require('gulp-tar'),
};

const deployment = {
    /* compressed filename */
    packageName: 'deployment.tar',
    /* local temporary directory */
    local: 'temp',
    /* files to upload */
    filesToUpload: 'files_to_upload/**/*',
    /* upload to remoteDir */
    remoteDir: '/home/ubuntu/',
    /* remote deploy folder */
    remoteUnpackIntoDir: '/home/ubuntu/test'
};
const ssh = new $.ssh({
    ignoreErrors: false,

    /* SSH server configuration */
    sshConfig: {
        host: '',
        port: 22,
        username: '',
        password: ''
    }
});


gulp.task('deploy-package', () => {
    return gulp.src(deployment.filesToUpload)
        .pipe($.tar(deployment.packageName, { mode: 0755 }))
        .pipe(gulp.dest(deployment.local));
});

gulp.task('deploy-upload', () => {
    return gulp.src(path.join(deployment.local, deployment.packageName))
        .pipe(ssh.dest(deployment.remoteDir));
});

gulp.task('deploy-unpack', () => {
    return ssh.exec([
        `tar --overwrite -C ${deployment.remoteUnpackIntoDir} -xvf ${deployment.remoteDir}${deployment.packageName}`,
        `rm ${deployment.remoteDir}${deployment.packageName}`
    ]).on('data', (file) => {
        if (!file.contents.toString()) return;
        file.contents.toString().trim().split('\n').forEach((line) => {
            $.util.log($.util.colors.magenta('remote ::'), line);
        });
    });
})

gulp.task('deploy', (callback) => {
    return runSequence(
        'deploy-package',
        'deploy-upload',
        'deploy-unpack',
        callback
    );
});
