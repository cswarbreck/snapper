var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence').use(gulp);

gulp.task('sass', function(){
    return gulp.src('app/site.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
        stream: true
    }))
});


gulp.task('browser-sync', function(){
    browserSync.init({
        server:{
            baseDir: 'app'
        },
    });
});

gulp.task('watch', ['browser-sync', 'sass'], function(){
    gulp.watch('app/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/**/*.js', browserSync.reload);
});

gulp.task('default', ['watch']);

gulp.task('bootstrap', function() {
    gulp.src('./node_modules/bootstrap/scss/**/*.scss')
        .pipe(gulp.dest('./app/scss/bootstrap'));

    gulp.src('./node_modules/bootstrap/js/dist/**/*.js')
        .pipe(gulp.dest('./app/js/bootstrap'));
});

gulp.task('useref', function(){
    return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin({
        interlaced: true
      })))
    .pipe(gulp.dest('dist/images'));
  });

gulp.task('fonts', function(){
    return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean:dist', function(){
    return del.sync('dist');
});

gulp.task('build', function(callback){
    runSequence('clean:dist',
        ['sass', 'useref', 'images', 'fonts'],
        callback
    );
});
