const gulp = require('gulp'),
    { src, dest } = gulp,
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    groupmedia = require('gulp-group-css-media-queries'),
    cleancss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    image = require('gulp-image'),
    webp = require('gulp-webp'),
    webpcss = require('gulp-webpcss'),
    webphtml = require('gulp-webp-html'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    fs = require('fs'),
    babel = require('gulp-babel');

const projectFolder = 'dist',
    sourceFolder = 'src',
    path = {
        build: {
            html: projectFolder + '/',
            css: projectFolder + '/css/',
            js: projectFolder + '/js/',
            img: projectFolder + '/img/',
            fonts: projectFolder + '/fonts/'
        },
        src: {
            html: [sourceFolder + '/*.html', '!' + sourceFolder + '/_*.html'],
            css: sourceFolder + '/scss/style.scss',
            js: sourceFolder + '/js/script.js',
            img: sourceFolder + '/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}',
            fonts: sourceFolder + '/fonts/**/*.ttf'
        },
        watch: {
            html: sourceFolder + '/**/*.html',
            css: sourceFolder + '/scss/**/*.scss',
            js: sourceFolder + '/js/**/*.js',
            img: sourceFolder + '/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}'
        },
        clean: './' + projectFolder + '/'
    }

function browserSync() {
    browsersync.init({
        server: {
            baseDir: './' + projectFolder + '/'
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function css() {
    return src(path.src.css)
        .pipe(scss({
            outputStyle: 'expanded'
        }))
        .pipe(groupmedia())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 5 versions'],
            cascade: true
        }))
        .pipe(webpcss())
        .pipe(dest(path.build.css))
        .pipe(cleancss())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

function img() {
    return src(path.src.img)
        .pipe(webp({
            quality: 70
        }))
        .pipe(src(path.src.img))
        .pipe(image())
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream());
}

function fonts() {
    src(path.src.fonts)
        .pipe(dest(path.build.fonts))
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
}

function fontsStyle(cb) {
    let pathToScss = sourceFolder + '/scss/fonts.scss'
    fs.writeFileSync(pathToScss, '');
    let items = fs.readdirSync(path.src.fonts);
    if (items) {
        for (let i = 0; i < items.length; i++) {
            let fontname = items[i].split('.')[0];
            fs.appendFileSync(pathToScss, '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\n');
        }
    }
    cb();
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], img);
}

function clean() { return del(path.clean); }

let build = gulp.series(clean, gulp.parallel(html, css, js, img, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);

gulp.task('fontsStyle', fontsStyle);

exports.build = build;
exports.default = watch;