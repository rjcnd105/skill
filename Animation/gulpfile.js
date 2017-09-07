var gulp = require('gulp');
var pug = require('gulp-pug');
var jade = require('gulp-jade');
var prettify = require('gulp-prettify');
var less = require('gulp-less');
var connect = require('gulp-connect');
var cssmin = require('gulp-cssmin');
var csscomb = require('gulp-csscomb');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var ftp = require('gulp-ftp');
var zip = require('gulp-zip');
//var fileTree = require('./files');

// fileTree.writeFiles('/www/motions/', 'files');
// node files.js /www/motions/

// 필수 세팅(uxdev.etribe.co.kr ftp올릴경우 겹치지 않은 이름으로 세팅해야합니다.)
// var projectName = 'ux_motion';
var projectName = 'ux_motion';
var port = '8889';
var path = {
	dest: 'www/',
	dest_css: 'www/',
	dest_js: 'www/',
	dest_images: 'www/images/',
	html: ['dev/**/*.jade', '!dev/inc/_libs/**/*'],
	css: ['dev/**/*.less', '!dev/inc/_libs/**/*'],
	js: ['dev/**/*.js', '!dev/inc/_libs/**/*'],
	images: ['dev/images/**/*', '!dev/inc/_libs/**/*'],
	etc: ['dev/**/*', '!dev/**/*.jade', '!dev/**/*.less', '!dev/**/*.js', '!dev/inc/_libs/**/*', '!dev/inc/_libs']
};

// , '!dev/**/etribe_ux_*.less'

// uxdev.etribe.co.kr이 아닌 다른 곳에 올릴 경우 변경해주세요
var ftpOptions = {
  user: 'etraux',
  pass: 'dlxmfkdlqmux',
  host: 'uxdev.etribe.co.kr',
  remotePath: '/uxdev.etribe.co.kr/' + projectName
};

var onError = function(err) {
	notify.onError({
		title: "Gulp",
		subtitle: "Failure!",
		message: "Error: <%= error.message %>",
		sound: "Beep"
	})(err);

	this.emit('end');
};

gulp.task('html', function(){
	return gulp.src(path.html)
		.pipe(plumber({errorHandler: onError}))
		.pipe(changed(path.dest, {extension: '.html'}))
		.pipe(jade({
			pretty: false,
			doctype: 'doctype html',
			self: true
		}))
		.pipe(prettify({
			indent_with_tabs: true,
			unformatted: ['sub', 'sup', 'b', 'i', 'u', 'em']
		}))
		.pipe(gulp.dest(path.dest));
});

gulp.task('html_all', function(){
	return gulp.src(path.html)
		.pipe(plumber({errorHandler: onError}))
		.pipe(jade({
			pretty: false,
			doctype: 'doctype html',
			self: true
		}))
		.pipe(prettify({
			indent_with_tabs: true,
			unformatted: ['sub', 'sup', 'b', 'i', 'u', 'em']
		}))
		.pipe(gulp.dest(path.dest));
});

gulp.task('css', function(){
	return gulp.src(path.css)
		.pipe(plumber({errorHandler: onError}))
		.pipe(changed(path.dest_css, {extension: '.css'}))
		.pipe(less({
		}))
		.pipe(csscomb())
		.pipe(cssmin({
			restructuring: false,
			keepBreaks: true,
			advanced: true,
			aggressiveMerging: true,
			keepSpecialComments: "*",
			compatibility: 'ie7'
		}))
		.pipe(gulp.dest(path.dest_css));
});

gulp.task('css_all', function(){
	return gulp.src(path.css)
		.pipe(plumber({errorHandler: onError}))
		.pipe(less({
		}))
		.pipe(csscomb())
		.pipe(cssmin({
			restructuring: false,
			keepBreaks: true,
			advanced: true,
			aggressiveMerging: true,
			keepSpecialComments: "*",
			compatibility: 'ie7'
		}))
		.pipe(gulp.dest(path.dest_css));
});

gulp.task('js', function(){
	return gulp.src(path.js)
		.pipe(changed(path.dest_js, {extension: '.js'}))
		.pipe(gulp.dest(path.dest_js));
});

gulp.task('images', function(){
	return gulp.src(path.images)
		.pipe(changed(path.dest_images))
		.pipe(gulp.dest(path.dest_images));
});

gulp.task('imagemin', function(){
	return gulp.src(path.images)
		.pipe(changed(path.dest_images))
		.pipe(imagemin())
		.pipe(gulp.dest(path.dest_images));
});

gulp.task('etc', function(){
	return gulp.src(path.etc)
		.pipe(changed(path.dest))
		.pipe(gulp.dest(path.dest));
});

gulp.task('watch', function(){
	gulp.watch(path.html, ['html']);
	gulp.watch(path.css, ['css']);
	gulp.watch(path.images, ['images']);
	gulp.watch(path.js, ['js']);
	gulp.watch(path.etc, ['etc']);
});

gulp.task('connect', function(){
	connect.server({
		root: path.dest,
		port: port
	});
});


gulp.task('deploy', function () {
	return gulp.src('www/**/*')
		.pipe(ftp(ftpOptions))
		.pipe(gutil.noop());
});

function ten(v){if(v < 10){return '0' + v;}else{return v;}}
function getSimpleTime(){
	var v = '';
	var d = new Date();
	v += d.getFullYear();
	v += ten(d.getMonth()+1);
	v += ten(d.getDate());
	v += '_';
	v += ten(d.getHours());
	v += ten(d.getMinutes());
	v += ten(d.getSeconds());

	return v;
}
gulp.task('bak', function () {
    return gulp.src('dev/**/*')
        .pipe(zip('bak_'+getSimpleTime()+'.zip'))
        .pipe(gulp.dest('__etribe_ux/backup'));
});

gulp.task('default', ['connect', 'watch', 'html', 'css', 'js', 'etc', 'images'], function(){
});

gulp.task('all', ['html_all', 'css_all'], function(){
});
