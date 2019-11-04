var gulp = require('gulp'),
		runSequence = require('run-sequence'),
    less = require('gulp-less'),
    bs = require('browser-sync').create(),
    concat = require('gulp-concat'),
    depsOrder = require('gulp-deps-order'),
    cache = require('gulp-cached'),
    include = require('gulp-file-include'),
    babel = require('gulp-babel');

gulp.task('sync', function() {
  bs.init({
		server: {
		  baseDir: "./dist"
		}
  })
});

gulp.task('html', function() {
  return gulp.src( './src/index.html' )
  .pipe(include({
    prefix: '@@',
    basepath: '@file'
  }))
  .pipe(gulp.dest( './dist' ))
  .pipe(bs.stream())
});

gulp.task('all', function() {
  return gulp.src( './src/*.html' )
  .pipe(include({
    prefix: '@@',
    basepath: '@file'
  }))
  .pipe(gulp.dest( './dist' ))
  .pipe(bs.stream())
});

gulp.task('less', function() {
	return gulp.src('./src/assets/less/*.less')
  .pipe(less())
  .pipe(concat('main.less'))
	.pipe(gulp.dest('./dist/assets/css/'))
	.pipe(bs.stream())
});

gulp.task('css', function() {
	return gulp.src('./src/assets/css/*.css')
  .pipe(less())
  .pipe(concat('main.css'))
	.pipe(gulp.dest('./dist/assets/css/'))
	.pipe(bs.stream())
});


gulp.task('js', function() {
  return gulp.src('./src/assets/js/**/*')
  .pipe(babel({
    plugins: ["transform-object-rest-spread"]
  }))
  .pipe(depsOrder())
  .pipe(gulp.dest('./dist/assets/js'))
  .pipe(bs.stream())
});

gulp.task('plugin', function() {
  gulp.src( './src/assets/plugins/**/*' )
  .pipe(cache('plugins'))
  .pipe(gulp.dest( './dist/plugins' ))
  .pipe(bs.stream())
});

gulp.task('fontes', function() {
  gulp.src( './src/assets/fontes/**/*' )
  .pipe(cache('fontes'))
  .pipe(gulp.dest( './dist/fontes' ))
  .pipe(bs.stream())
});
gulp.task('images', function() {
  gulp.src( './src/assets/images/**/*' )
  .pipe(gulp.dest( './dist/assets/images' ))
  .pipe(bs.stream())
});

gulp.task('watch', function() {
  gulp.watch('./src/*.html', function() {
		gulp.start('all')
  });
  gulp.watch('./src/assets/less/*.less', function() {
		gulp.start('less')
  });
  gulp.watch('./src/assets/css/*.css', function() {
		gulp.start('css')
  });
  gulp.watch('./src/assets/js/**/*', function() {
		gulp.start('js')
  });
  gulp.watch('./src/assets/images/*', function() {
		gulp.start('images')
  });
});

gulp.task('webserver', ['sync', 'watch'])
gulp.task('build', ['all', 'less', 'css', 'js', 'plugin', 'fontes', 'images'])
gulp.task('default', function() {
 	runSequence('build', 'webserver')
});