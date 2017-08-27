'use strict';

const gulp = require('gulp'),
	  uglify = require('gulp-uglify'),
	  sass = require('gulp-sass'),
	  rename = require('gulp-rename'),
	  map = require('gulp-sourcemaps'),
	  useref = require('gulp-useref'),
	  iff = require('gulp-if'),
	  csso = require('gulp-csso'),
	  cache = require('gulp-cache'),
	  imagemin = require('gulp-imagemin'),
	  runSequence = require('run-sequence'),
	  connect = require('gulp-connect'),
	  del = require('del');

// gulp.task('tocss', () => {
// 	return gulp.src('sass/**/*.scss')
// 			.pipe(sass())
// 			.pipe(gulp.dest('./css/'));
// });

gulp.task('styles', () =>{
	return gulp.src('sass/**/*.scss')
			.pipe(sass())
			.pipe(map.init())
			.pipe(useref()) //concats 
			.pipe(iff('*.js', csso()))
			.pipe(rename('all.min.css'))
			.pipe(map.write('./'))
			.pipe(gulp.dest('dist/styles'));
});

gulp.task('images', () => {
	return gulp.src('images/*.+(png|jpg)')
			.pipe(cache(imagemin()))
			.pipe(gulp.dest('dist/content'))
});

gulp.task('scripts', () => {
	return gulp.src('index.html')
			.pipe(useref()) //concats 
			.pipe(iff('*.js', uglify()))
			.pipe(map.init())
			.pipe(rename('all.min.js')) 
			.pipe(map.write('./'))
			.pipe(gulp.dest('dist/scripts'));
});

gulp.task('clean', () => {
	return del.sync(['dist', 'css']);
});

gulp.task('connect', () => {
	return connect.server({ port: 3000 });
});

gulp.task('build', (callback) => {
	runSequence('clean', ['scripts', 'images', 'styles'], callback);
	gulp.src('icons/**/*').pipe(gulp.dest('dist/icons'));
});

gulp.task('default', (callback) => {
	runSequence('build', 'connect', callback);
});


/*
NOTES
--don't use uglify on sass files when compiling them to css
--create css source maps AFTER compiling sass to css
*/

