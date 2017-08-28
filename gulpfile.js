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

gulp.task('htmlScripts', ['styles'], () => {
	return gulp.src('index.html')
		.pipe(useref())
		.pipe((iff('*.js', uglify()))) 			//TASK 3
		.pipe(gulp.dest('dist'));
});

gulp.task('scripts', ['htmlScripts'], () => {
	return gulp.src('dist/scripts/*.js')
			.pipe(map.init())					//TASK 4
			.pipe(rename('all.min.js')) 
			.pipe(map.write('./'))
			.pipe(gulp.dest('dist/scripts'));
});

gulp.task('styles', ['htmlStyles'], () => {
	return gulp.src('index.html')
		.pipe(map.init())
		.pipe(useref())                 		//TASK 2
		.pipe(iff('*.css', csso()))
		.pipe(rename('all.min.css'))
		.pipe(map.write('./'))
		.pipe(gulp.dest('dist/styles'));
});

gulp.task('htmlStyles', () =>{
	return gulp.src('sass/**/*.scss')  		    //TASK 1
			.pipe(sass())
			.pipe(gulp.dest('css'));
});

gulp.task('images', () => {
	return gulp.src('images/*.+(png|jpg)')
			.pipe(cache(imagemin()))			//TASK WHENEVER 
			.pipe(gulp.dest('dist/content'))
});

gulp.task('clean', () => {
	return del.sync(['dist', 'css']);
});


gulp.task('build', (callback) => {
	runSequence('clean', ['scripts', 'images', 'styles'], callback);
	gulp.src('icons/**/*').pipe(gulp.dest('dist/icons'));
});

gulp.task('connect', () => {
	return connect.server({ port: 3000 });
});

gulp.task('default', (callback) => {
	runSequence('build', 'connect', callback);
});


/*
NOTES
--don't use uglify on sass files when compiling them to css
--create css source maps AFTER compiling sass to css
*/

