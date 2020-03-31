import run from 'gulp-run-command';
import {src, dest, task, series} from 'gulp';
import nodemon from 'nodemon';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';

const serverPath = 'backend';

function onServerLog(log) {
    console.log(log.message);
}

task('start:server', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';    
    return nodemon(`-w ${serverPath}/dist ${serverPath}/dist`)
    .on('log', onServerLog);
})

// task('watch', series(watch([`${serverPath}/**/*.js}`, 'start:server'])));

task('start:client', run(['npm start']));

task('serve', series('start:server', (done) => {
    done();
}));

task('default', () => {
    return src(`${serverPath}/**/*.js`)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./dist'))
})