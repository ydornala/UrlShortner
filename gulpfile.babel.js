import runSequence from 'run-sequence';
import run from 'gulp-run-command';
import gulp from 'gulp';
import nodemon from 'nodemon';
import babel from 'gulp-babel';

const serverPath = 'backend';

function onServerLog(log) {
    console.log(log.message);
}

gulp.task('start:server', () => {    
   return gulp.src(`${serverPath}/**/*.js`)
    .pipe(babel())
    .pipe(gulp.dest("dist"));
})

gulp.task('watch', () => {
    return nodemon(`-w ${serverPath} ${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('start:client', run(['npm start']));

gulp.task('serve', (cb) => {
    runSequence(
        ['start:server', 'watch'],
        cb
    );
});