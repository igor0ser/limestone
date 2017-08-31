'use strict';

/* common plugins */
const gulp = require('gulp');
const runSequence = require('run-sequence');
const watch= require('gulp-watch');
const clean = require('gulp-clean');
/* server plugin*/
const webserver = require('gulp-webserver');
/* css plugins */
const sass = require('gulp-sass');
const prefixer = require('gulp-autoprefixer');
/* sprite and image plugins */
const spritesmith = require('gulp.spritesmith');
const imagemin = require('gulp-imagemin');

/* contants */

const PATH = {
	SRC: {
		HTML: 'src/**/*.html',
		STYLE: 'src/main.sass',
		SPRITES: 'src/sprites/*.png',
		IMAGES: 'src/img/**/*.*',
		ROOT: 'src/'
	},
	SPRITES_STYLE: 'src/sass/',
	BUILD: 'build/',
	IMAGES: 'build/img/',
	LOCALHOST: 'http://localhost:8000/index.html'
};

/* tasks */

gulp.task('default', () =>
	runSequence('build', 'server', 'watch')
);

gulp.task('server', () => 
	gulp.src(PATH.BUILD)
		.pipe(webserver({
			livereload: true,
			directoryListing: true,
			open: PATH.LOCALHOST
		}))
);


gulp.task('build', () => 
	runSequence( 'clean', ['html', 'sprites', 'images'] ) 
);

gulp.task('html', () => 
		gulp
			.src(PATH.SRC.HTML)
			.pipe(gulp.dest(PATH.BUILD))
);

gulp.task('styles', () => 
		gulp
			.src(PATH.SRC.STYLE)
			.pipe(sass().on('error', sass.logError))
			.pipe(prefixer())
			.pipe(gulp.dest(PATH.BUILD))
);

gulp.task('images', () =>
		gulp
			.src(PATH.SRC.IMAGES)
			.pipe(imagemin())
			.pipe(gulp.dest(PATH.IMAGES))
);

gulp.task('sprites', () => {
	var spriteData = gulp
						.src(PATH.SRC.SPRITES) 
						.pipe(spritesmith({
							imgName: 'sprite.png',
							cssName: 'sprite.sass',
							cssFormat: 'sass',
							algorithm: 'top-down',
							padding: 2,
							cssVarMap: function (sprite) {sprite.name = 'sprite_' + sprite.name;}
						}));
	spriteData.img.pipe(gulp.dest(PATH.IMAGES)); 
	spriteData.css.pipe(gulp.dest(PATH.SPRITES_STYLE)); 
	gulp.start('styles');
	return spriteData;
});

gulp.task('watch', () => {
	watch(['src/sass/**/*.*'], () => gulp.start('styles') );
	watch([PATH.SRC.HTML], () => gulp.start('html') );
	watch([PATH.SRC.SPRITES], () => gulp.start('sprites') );
	watch([PATH.SRC.IMAGES], () => gulp.start('images') );
});

gulp.task('clean',  () =>
	gulp
		.src(PATH.BUILD, {read: false})
		.pipe(clean())
);

