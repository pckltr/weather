// Include gulp
var gulp = require("gulp");

// Include plugins
var browserSync = require("browser-sync").create();
var concat = require("gulp-concat");
var jshint = require("gulp-jshint");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");

// Folders
var dev = "dev/";
var devFonts = dev + "fonts/*";
var devHTML = dev + "*.html";
var devImages = dev + "img/*";
var devScripts = dev + "js/*";
var devStyle = dev + "scss/*";
var dist = "dist/";
var distFonts = dist + "fonts/";
var distHTML = dist;
var distImages = dist + "img/";
var distScripts = dist + "js/";
var distStyle = dist + "css/";

// Browser-sync server
gulp.task("serve", ["fonts", "html", "images", "sass", "scripts"], function() {
// gulp.task("serve", ["fonts", "html", "images", "lint", "sass", "scripts"], function() {

    browserSync.init({
        server: dist
    });

    gulp.watch(devFonts, ["fonts"]);
    gulp.watch(devHTML, ["html"]);
    gulp.watch(devImages, ["images"]);
    gulp.watch(devScripts, ["scripts"]);
    // gulp.watch(devScripts, ["lint", "scripts"]);
    gulp.watch(devStyle, ["sass"]);

});

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// Copy fonts
gulp.task("fonts", function() {
    return gulp.src(devFonts)
        .pipe(gulp.dest(distFonts))
        .pipe(browserSync.stream());
});

// Copy HTML
gulp.task("html", function() {
    return gulp.src(devHTML)
        .pipe(gulp.dest(distHTML))
        .pipe(browserSync.stream());
});

// Copy HTML
gulp.task("images", function() {
    return gulp.src(devImages)
        .pipe(gulp.dest(distImages))
        .pipe(browserSync.stream());
});

// Lint Task
gulp.task("lint", function() {
    return gulp.src(devScripts)
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

// Compile sass
gulp.task("sass", function() {
    return gulp.src(devStyle)
        .pipe(sass({outputStyle: 'compressed'})
            .on("error", handleError))
        .pipe(gulp.dest(distStyle))
        .pipe(browserSync.stream());
});

// Concatenate & Minify JS
gulp.task("scripts", function() {
    return gulp.src(devScripts)
        // .pipe(concat("app.js"))
        // .pipe(uglify()
        //     .on("error", handleError))
        .pipe(gulp.dest(distScripts))
        .pipe(browserSync.stream());
});

// Default Task
gulp.task("default", ["serve"]);