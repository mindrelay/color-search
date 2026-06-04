const gulp = require('gulp');
const ts = require('gulp-typescript');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const runSequence = require('run-sequence');
const typedoc = require("gulp-typedoc");
const jsdoc = require('gulp-jsdoc3');

const tsProject = ts.createProject({
    target: "es2016",
    module: "commonjs",
    allowJs: true,
    strict: false,
});

gulp.task("typedoc", () =>
    gulp
    .src(['src/server/**/*.ts'])
    .pipe(typedoc({
        // TypeScript options (see typescript docs)
        module: "commonjs",
        target: "ES2016",
        includeDeclarations: true,
        allowJs: true,
        strict: false,
        // Output options (see typedoc docs)
        out: "./docs/server",
        excludeExternals: true,
        excludeNotExported: true,
        // TypeDoc options (see typedoc docs)
        name: "ColorSearch",
        theme: "minimal",
        plugins: "none",
        ignoreCompilerErrors: false,
        version: true,
        readme: "none",
        mode: "file",
    })));

gulp.task('jsdoc', (cb) => {
    gulp.src(['src/client/**/*.js'], { read: false })
    .pipe(jsdoc({
        opts: {
            template: "templates/default",
            destination: "./docs/client",
        },
    }, cb));
});

gulp.task('ts', () => gulp.src('src/server/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest('dist/')));

gulp.task('json', () => gulp.src('src/server/**/*.json')
    .pipe(gulp.dest('dist/')));

gulp.task('package', () => gulp.src('package_dist.json')
    .pipe(rename('package.json'))
    .pipe(gulp.dest('dist/')));

gulp.task('txt', () => gulp.src('src/server/**/*.txt')
    .pipe(gulp.dest('dist/')));

gulp.task("_uglify", () => gulp.src("dist/server/**/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/server/")));

gulp.task("uglify", ["_uglify"], () => gulp.src("dist/server.js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/")));

gulp.task('watch', ['ts', 'json', 'txt'],
() => gulp.watch('src/server/**/*.ts', ['ts', 'json', 'txt']));

gulp.task('compile', ['ts', 'json', 'txt', 'package']);

gulp.task('develop', (done) => {
    runSequence('ts', 'json', 'txt', 'package', 'uglify', () => {
        done();
    });
});

gulp.task('hosting', () => gulp.src(['dist/**/*', '!dist/server/resources/imgs/**/*', '!dist/server/resources/public_imgs/**/*', '!dist/server/resources/public_imgs2/'])
.pipe(gulp.dest('hosting/ColorSearch/')));
