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
	  browserSync = require('browser-sync'),
	  connect = require('gulp-connect'),
	  del = require('del');


gulp.task('htmlStyles', () =>{
	return gulp.src('sass/**/*.scss')  		    //TASK 1
			.pipe(sass())
			.pipe(gulp.dest('css'));
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

gulp.task('images', () => {
	return gulp.src('images/*.+(png|jpg)')
			.pipe(cache(imagemin()))			//TASK WHENEVER 
			.pipe(gulp.dest('dist/content'))
});

gulp.task('clean', () => {
	return del.sync(['dist', 'css']);			//Clean up
});


gulp.task('build', (callback) => {
	runSequence('clean', ['scripts', 'images', 'styles'], callback);	//Create build
	gulp.src('icons/**/*').pipe(gulp.dest('dist/icons'));
});

gulp.task('connect', () => {					//Connect to server
	return connect.server({ port: 3000 });
});

gulp.task('watch', () => {						//Watch .scss file changes
	gulp.watch('sass/**/*.scss', ['styles'])
});

gulp.task('sync', ['watch'], () => {			//If changes, show them on the web
	browserSync.init({
		server: {
			baseDir: './'
		},
  	}); 
});

gulp.task('default', (callback) => {						//Run 'gulp'
	runSequence('build', 'connect', 'sync', callback);
});


/*
NOTES
--don't use uglify on sass files when compiling them to css
--create css source maps AFTER compiling sass to css
*/

