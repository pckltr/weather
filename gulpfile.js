// Include gulp
var gulp = require("gulp");

// Include plugins
var browserSync = require("browser-sync").create(),
    concat = require("gulp-concat"),
    del = require('del'),
    jshint = require("gulp-jshint"),
    rename = require("gulp-rename"),
    sass = require("gulp-sass"),
    uglify = require("gulp-uglify");

// Folders
var src = "src/",
    srcDirectives = src + "directives/*",
    srcFonts = src + "fonts/*",
    srcHTML = src + "*.html",
    srcImages = src + "img/*",
    srcScripts = src + "js/*",
    srcStyle = src + "scss/*",
    dist = "dist/",
    distDirectives = dist + "directives/",
    distFonts = dist + "fonts/",
    distHTML = dist,
    distImages = dist + "img/",
    distScripts = dist + "js/",
    distStyle = dist + "css/";

// Browser-sync server
gulp.task("serve", ["deleteDist", "directives", "fonts", "html", "images", "sass", "scripts"], function() {

    browserSync.init({
        server: dist
    });

    gulp.watch(srcDirectives, ["directives"]);
    gulp.watch(srcFonts, ["fonts"]);
    gulp.watch(srcHTML, ["html"]);
    gulp.watch(srcImages, ["images"]);
    gulp.watch(srcScripts, ["scripts"]);
    gulp.watch(srcStyle, ["sass"]);

});

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

// Delete dist
gulp.task('deleteDist', function() {
    return del.sync(dist);
})

// Copy directives
gulp.task("directives", function() {
    return gulp.src(srcDirectives)
        .pipe(gulp.dest(distDirectives))
        .pipe(browserSync.stream());
});

// Copy fonts
gulp.task("fonts", function() {
    return gulp.src(srcFonts)
        .pipe(gulp.dest(distFonts))
        .pipe(browserSync.stream());
});

// Copy HTML
gulp.task("html", function() {
    return gulp.src(srcHTML)
        .pipe(gulp.dest(distHTML))
        .pipe(browserSync.stream());
});

// Copy HTML
gulp.task("images", function() {
    return gulp.src(srcImages)
        .pipe(gulp.dest(distImages))
        .pipe(browserSync.stream());
});

// Lint Task
gulp.task("lint", function() {
    return gulp.src(srcScripts)
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

// Compile sass
gulp.task("sass", function() {
    return gulp.src(srcStyle)
        .pipe(sass({
                outputStyle: 'compressed'
            })
            .on("error", handleError))
        .pipe(gulp.dest(distStyle))
        .pipe(browserSync.stream());
});

// Concatenate & Minify JS
gulp.task("scripts", function() {
    return gulp.src(srcScripts)
        .pipe(gulp.dest(distScripts))
        .pipe(browserSync.stream());
});

// Default Task
gulp.task("default", ["serve"]);
