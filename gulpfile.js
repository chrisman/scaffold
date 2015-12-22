var gulp = require('gulp')
var concat = require('gulp-concat')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var streamify = require('gulp-streamify')
var uglify = require('gulp-uglify')
var jshint = require('gulp-jshint')
// var jshintStylish = require('jshint-stylish')
var es = require('event-stream')
var filter = require('gulp-filter')
var mainBowerFiles = require('main-bower-files')
var rename = require('gulp-rename')

var sass = require('gulp-sass')
var postcss = require('gulp-postcss')
var autoprefixer = require('autoprefixer')
var cssmin = require('gulp-minify-css')
var normalize = require('node-normalize-scss')

var jade = require('gulp-jade')
var image = require('gulp-image')
var livereload = require('gulp-livereload')
var del = require('del')
var deploy = require('gulp-gh-pages')
var browserSync = require('browser-sync').create()

var config = {
  "build_dir": "public"
}

gulp.task('html', function(){
  gulp.src('src/views/index.jade')
    .pipe(jade())
    .pipe(gulp.dest(config["build_dir"]))

  gulp.src('src/views/pages/**/*jade')
    .pipe(jade())
    .pipe(gulp.dest(config["build_dir"]+'/pages'))
});

gulp.task('fonts', function(){
  return gulp.src('./bower_components/font-awesome/fonts/**.*')
    .pipe(gulp.dest(config["build_dir"]+'/fonts'))
})
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded',
  loadPath: [
    './bower_components/fontawesome/scss',
  ],
  includePaths: normalize.includePaths
}
gulp.task('styles', function(){
  return gulp.src('src/scss/app.scss')
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(postcss([autoprefixer({
      browsers: ['last 2 versions']
    })]))
    .pipe(cssmin())
    .pipe(gulp.dest(config["build_dir"]+'/css'))
    .pipe(browserSync.stream())
})

gulp.task('js', function() {
  return browserify('src/js/app.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(streamify(uglify()))
    .pipe(rename({suffix: '.bundle'}))
    .pipe(gulp.dest(config["build_dir"]+'/js'))
})
gulp.task('jshint', function(){
  gulp.src(['src/js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
})

gulp.task('clean', function(){
  return del([config["build_dir"]+'/css', config["build_dir"]+'/js'])
})

gulp.task('images', function(){
  return gulp.src('src/media/*')
    .pipe(image())
    .pipe(gulp.dest(config["build_dir"]+'/img'))
})

gulp.task('deploy', function(){
  return gulp.src(config["build_dir"]+'/**/*')
    .pipe(deploy())
})

gulp.task('watchman', function(){
  browserSync.init({
    server: config["build_dir"],
    open: true
  }, function callback(){
    gulp.watch(config["build_dir"]+'/index.html', browserSync.reload)
  })
  gulp.watch('src/js/**/*js', ['js'])
  gulp.watch('src/scss/**/*scss', ['styles'])
  gulp.watch('src/views/**/*jade', ['html'])

  livereload.listen()
  gulp.watch([config["build_dir"]+'/**']).on('change', livereload.changed)
})

gulp.task('default', ['html', 'styles', 'js', 'watchman'])
