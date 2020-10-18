'use strict'

// VARIABLES, PATCH

let preprocessor = 'scss',
    baseDir      = 'app';

let patch = {

   html: {
      src: [
         baseDir + '/*.html',
         baseDir + '/pages/*.html'
      ],
      dest: './dist/',
      watch: [
         baseDir + '/blocks/**/*.html',
         baseDir + '/*.html',
         baseDir + '/pages/**/*.html'
      ]
   },

   styles: {
      src: baseDir + '/styles/main.' + preprocessor,
      dest: './dist/styles/',
      watch: [
         baseDir + '/blocks/**/*.' + preprocessor,
         baseDir + '/styles/**/*.' + preprocessor
      ]
   },

   scripts: {
      src: baseDir + '/js/index.js',
      dest: './dist/js',
      watch: [
         baseDir + '/blocks/**/*.js',
         baseDir + '/js/**/*.js'
      ]
   },

   images: {
      src: baseDir + '/img/**/*',
      dest: './dist/img/',
      watch: baseDir + '/img/**/*'
   },

   sprites: {
      src: baseDir + '/img/svg/*.svg',
      dest: './dist/img/sprites/',
      watch: baseDir + 'img/svg/*.svg'
   },

   fonts: {
      src: baseDir + '/fonts/**/*',
      dest: './dist/fonts/',
      watch: baseDir + '/fonts/**/*'
   }
}

// LOGIC

const { src, dest, parallel, series, watch } = require('gulp'),
   browserSync   = require('browser-sync').create(),
   fileInclude   = require('gulp-file-include'),
   scss          = require('gulp-sass'),
   notify        = require('gulp-notify'),
   autoprefixer  = require('gulp-autoprefixer'),
   groupMedia    = require('gulp-group-css-media-queries'),
   sourcemaps    = require('gulp-sourcemaps'),
   rename        = require('gulp-rename'),
   cleanCss      = require('gulp-clean-css'),
   del           = require('del'),
   gulpIf        = require("gulp-if"),
   yargs         = require('yargs').argv,
   replace       = require('gulp-replace'),
   webpack       = require('webpack'),
   webpackStream = require('webpack-stream'),
   imagesMin     = require('gulp-imagemin'),
   htmlMin       = require('gulp-htmlmin'),
   svgSprites    = require('gulp-svg-sprite'),
   ttf2woff2     = require('gulp-ttf2woff2');

const production = !!yargs.production;
const webpackConfig = require('./webpack.config');
webpackConfig.mode = production ? "production" : "development";
webpackConfig.devtool = production ? false : "source-map";

function server() {
   browserSync.init({
      server: './dist/',
      notify: false
   });
   watch(patch.html.watch, { usePolling: true }, html);
   watch(patch.styles.watch, { usePolling: true }, styles);
   watch(patch.scripts.watch, { usePolling: true }, scripts);
   watch(patch.images.watch, { usePolling: true }, images);
   watch(patch.sprites.watch, { usePolling: true }, sprites);
   watch(patch.fonts.watch, { usePolling: true }, fonts);
}

function html() {
   return src(patch.html.src)
   .pipe(fileInclude())
   .pipe(gulpIf(production, replace('.css', '.min.css')))
   .pipe(gulpIf(production, replace('.js', '.min.js')))
   .pipe(gulpIf(production, htmlMin({ collapseWhitespace: true })))
   .pipe(dest(patch.html.dest))
   .pipe(browserSync.stream())
}

function styles() {
   return src(patch.styles.src)
   .pipe(eval(preprocessor)())
   .on( 'error', notify.onError({
      title: 'Sass Compilation Failed',
      message: '<%= error.message %>'
   }) )
   .pipe(gulpIf(!production, sourcemaps.init()))
   .pipe(scss.sync().on('error', notify.onError))
   .pipe(groupMedia())
   .pipe(gulpIf(production, autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })))
   .pipe(gulpIf(production, cleanCss( {level: { 2: { specialComments: 0 } },/* format: 'beautify' */ })))
   .pipe(gulpIf(production, rename({
      suffix: ".min"
   })))
   .pipe(gulpIf(production, sourcemaps.write("./maps/")))
   .pipe(dest(patch.styles.dest))
   .pipe(browserSync.stream())
}

function scripts() {
   return src(patch.scripts.src)
   .pipe(webpackStream(webpackConfig), webpack)
   .pipe(gulpIf(production, rename({
      suffix: '.min'
   })))
   .pipe(dest(patch.scripts.dest))
   .pipe(browserSync.stream())
}

function images() {
   return src(patch.images.src)
   .pipe(gulpIf(production, imagesMin()))
   .pipe(dest(patch.images.dest))
}

function delFolderSvg() {
   return del('./dist/img/svg', { force: true })
}

function sprites() {
   return src(patch.sprites.src)
   .pipe(svgSprites({
      mode: {
         stack: {
            sprite: '../sprite.svg',
            // example: true
         }
      }
   }))
   .pipe(dest(patch.sprites.dest))
}

function fonts() {
   return src(patch.fonts.src)
   .pipe(ttf2woff2())
   .pipe(dest(patch.fonts.dest))
}


function cleanDist() {
   return del('./dist/**/*', { force: true })
}

exports.server    = server;
exports.html      = html;
exports.styles    = styles;
exports.scripts   = scripts;
exports.images    = images;
exports.sprites   = sprites;
exports.fonts     = fonts;
exports.cleanDist = cleanDist;
exports.prod      = series(cleanDist, parallel(html, styles, scripts, images, delFolderSvg, sprites, fonts), delFolderSvg);
exports.default   = series(cleanDist, parallel(html, styles, scripts, images, sprites, fonts), delFolderSvg, parallel(server));