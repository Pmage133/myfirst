var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var sass = require('gulp-sass');
const rimraf = require('rimraf'); 
const rename = require('gulp-rename');
sass.compiler = require('node-sass');
 
gulp.task('styles:compile', function () {
  return gulp.src('source/styles/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css'));
});
 
gulp.task('styles:watch', function (done) {
  gulp.watch('source/styles/**/*.scss', async () => {
		await gulp.series('styles:compile')();
        console.log("Recompiled css from scss!");		
	  });
  done();	  
});

gulp.task('templates:compile', function buildHTML(done) {
  return gulp.src('source/template/index.pug')
  .pipe(pug({
    pretty:true
  }))
  .pipe(gulp.dest('build'));
  done();
});

gulp.task('default', async function(){
	console.log('default task');
});

gulp.task('server', function(done) {
	browserSync.init({
		server: {
			port: 3000,
			baseDir: "build"
		},
		port: 3000
	});
	gulp.watch('build/**/*').on('change', async () => {
        await browserSync.reload();
        console.log("Reloaded!")
    });
	done();
});

gulp.task('clean', function del(cb){
	return rimraf('build', cb);
});

gulp.task('copy:fonts', function() {
  return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});

gulp.task('copy:images', function() {
  return gulp.src('./source/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

gulp.task('watch', function() {
  gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
  gulp.series('styles:watch')();
});

gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('templates:compile', 'styles:compile', 'copy'),
  gulp.parallel('watch', 'server')
  )
);


