'use strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	cssMin = require('gulp-css'),
	autoprefixer = require('gulp-autoprefixer'),
	maps = require('gulp-sourcemaps'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload,
	plumber = require('gulp-plumber');

/* Server Task */
gulp.task('server', ['build'], function() {
	// pass server options
	browserSync.init({
		server: {
			baseDir: "./"
		},
		open: false
	});

	// run a task based on file change
	gulp.watch("src/js/**/*.js", ['concatScripts']);
	gulp.watch("src/styles/**/*.scss", ['sass']);

	// refresh the browser when html or dist files change
	gulp.watch([
		"**/*.html",
		"dist/**/*",
		"**/*.svg",
		"**/*.css"
	]).on('change', reload);
});

/* Build Task */
gulp.task('build', [
	'sass',
	'concatScripts',
]);

gulp.task('compress', [
	'compressImg',
	'concatVendor',
	'minifyScripts',
]);
/* Image Compression */
gulp.task('compressImg', function() {
	return gulp.src('assets/img/**/*')
		.pipe(imagemin({
			optimizationLevel: 3,
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('dist/assets/img'));
});

/* --JavaScript Tasks-- */
gulp.task('concatScripts', function() {
	return gulp.src([
			'src/js/**/*.js',
			'src/js/main.js'
		])
		.pipe(plumber())
		.pipe(maps.init())
		.pipe(concat('main.js'))
		.pipe(maps.write('.'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('concatVendor', function() {
	return gulp.src([

		])
		.pipe(plumber())
		.pipe(maps.init())
		.pipe(concat('vendor.js'))
		.pipe(maps.write('.'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('minifyScripts', ['concatScripts'], function() {
	return gulp.src('dist/js/main.js')
		.pipe(plumber())
		.pipe(uglify())
		.pipe(rename('main.min.js'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('dist/js'));
});

/* --SASS Tasks-- */
gulp.task('sass', function() {
	return gulp.src('src/styles/main.scss')
		.pipe(plumber())
		.pipe(maps.init())
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(maps.write('.'))
		//.pipe(cssMin())
		.pipe(plumber.stop())
		.pipe(gulp.dest('dist/styles'));
});

/* Default task */
gulp.task('default', ['server'], function() {});