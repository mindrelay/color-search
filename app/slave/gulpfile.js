const gulp = require('gulp');
const ts = require('gulp-typescript');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const runSequence = require('run-sequence');

const tsProject = ts.createProject({
    target: "es2016",
    module: "commonjs",
    allowJs: true,
    strict: false,
});

gulp.task('ts', () => gulp.src('src/server/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest('dist/')));

gulp.task('json', () => gulp.src('src/server/**/*.json')
    .pipe(gulp.dest('dist/')));

gulp.task("_uglify", () => gulp.src("dist/server/**/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/server/")));

gulp.task("uglify", ["_uglify"], () => gulp.src("dist/server.js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/")));

gulp.task('watch', ['ts', 'json'],
() => gulp.watch('src/server/**/*.ts', ['ts', 'json']));

gulp.task('compile', ['ts', 'json']);

gulp.task('develop', (done) => {
    runSequence('ts', 'json', 'uglify', () => {
        done();
    });
});

gulp.task('hosting', () => gulp.src(['dist/**/*', '!dist/server/resources/imgs/**/*', '!dist/server/resources/public_imgs/**/*', '!dist/server/resources/public_imgs2/'])
.pipe(gulp.dest('hosting/ColorSearch/')));
