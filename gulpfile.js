"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var run = require('run-sequence');
var rename = require("gulp-rename");
var del = require('del');
var minify = require('gulp-csso');
var posthtml = require('gulp-posthtml');
var include = require('posthtml-include');

gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));
});

gulp.task("html", function () {
  return gulp.src("*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html", ["html"]);
});

gulp.task("build", function(done) {
  run(
      "clean",
      "copy",
      "style",
      "html",
      done
    );
});

gulp.task("copy", function () {
  return gulp.src([
      "fonts/**/*.{ttf}",
      "img/**"
  ], {
    base: "."
})
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});
