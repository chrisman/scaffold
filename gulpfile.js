var gulp = require('gulp')
var concat = require('gulp-concat')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var streamify = require('gulp-streamify')
var uglify = require('gulp-uglify')
var es = require('event-stream')
var filter = require('gulp-filter')
var mainBowerFiles = require('main-bower-files')
var rename = require('gulp-rename')

var sass = require('gulp-sass')
var postcss = require('gulp-postcss')
var autoprefixer = require('autoprefixer')
var cssmin = require('gulp-minify-css')

var jade = require('gulp-jade')
var image = require('gulp-image')
var livereload = require('gulp-livereload')
var del = require('del')
var deploy = require('gulp-gh-pages')
var browserSync = require('browser-sync').create()

gulp.task('html', function(){
  return gulp.src('src/views/*jade')
    .pipe(jade())
    .pipe(gulp.dest('public'))
});

gulp.task('fonts', function(){
  return gulp.src('./bower_components/font-awesome/fonts/**.*')
    .pipe(gulp.dest('./public/fonts'))
})

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded',
  loadPath: [
    './bower_components/fontawesome/scss',
    './bower_components/bootstrap-sass/assets/stylesheets'
  ]
}
gulp.task('styles', function(){
  return gulp.src('src/scss/app.scss')
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(postcss([autoprefixer({
      browsers: ['last 2 versions']
    })]))
    .pipe(cssmin())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream())
})

gulp.task('js', function() {
  return browserify('src/js/app.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(streamify(uglify()))
    .pipe(rename({suffix: '.bundle'}))
    .pipe(gulp.dest('public/js'))
})

gulp.task('clean', function(){
  return del(['public/css', 'public/js'])
})

gulp.task('images', function(){
  return gulp.src('src/assets/img/*')
    .pipe(image())
    .pipe(gulp.dest('public/img'))
})

gulp.task('deploy', function(){
  return gulp.src('public/**/*')
    .pipe(deploy())
})

gulp.task('watchman', function(){
  browserSync.init({
    server: './public/',
    open: true
  }, function callback(){
    gulp.watch('public/index.html', browserSync.reload)
  })
  gulp.watch('src/js/**/*js', ['js'])
  gulp.watch('src/scss/**/*scss', ['styles'])
  gulp.watch('src/views/**/*jade', ['html'])

  livereload.listen()
  gulp.watch(['public/**']).on('change', livereload.changed)
})

gulp.task('default', ['html', 'styles', 'js', 'watchman'])
