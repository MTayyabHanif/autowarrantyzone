/*
*
*
*  This is an automation of CSS HTML starter Pack
*
* When you download it or find it as it is, you need to install by typing cmd:
* CMD: npm install
* 
*After installing all dependencies you can run it by typing cmd:
*CMD: gulp
*
* Images will be minified, CSS will be minified and prefixes will be added,  
* JS will be uglified andall JS files will be combined into ONE file and
* HTML files and all other minified & uglified files will be transferred into your
*  distribution folder. when you build your project for distribution.
* 
* When you are ready for distribution or want to build, you have to type cmd:
*CMD: gulp build
*
* If you want RTL support in your CSS, you have to type this cmd after building your project:
* CMD: gulp rtl-css
* 
* 
*/




// 
// ALL Variables
// 
var gulp 		= require('gulp'),
gutil		 	= require('gulp-util'),
webserver 		= require('gulp-webserver'),

scss 			= require('gulp-ruby-sass'),
sourcemaps 	= require('gulp-sourcemaps'),
postcss 		= require('gulp-postcss'),
autoprefixer 	= require('autoprefixer'),
rtlcss 			= require('rtlcss'),
cleanCSS       	= require('gulp-clean-css'),

// jshint 		= require('gulp-jshint'),
uglify         		= require('gulp-uglify'),
concat 		= require('gulp-concat'),

cache          	= require('gulp-cache'),
imagemin       	= require('gulp-imagemin'),
//webserver 		= require('gulp-webserver');
browserSync    	= require('browser-sync'),

source 	= 'build/developing/',
dest 		= 'build/distribution/';



// 	Viewing all HTML files
gulp.task('html', function() {
	gulp.src(source+'*.html')
	.pipe(browserSync.reload({stream: true}));
	cache.clearAll();
});


//	JS files are linting by an linter and combining into one file
gulp.task('js', function() {
	gulp.src([
	         '!build/developing/js/scripts/jquery.js',
	         source + 'js/scripts/*.js'
	         ])
	// .pipe(jshint('./.jshintrc'))
	// .pipe(jshint.reporter('jshint-stylish'))
	.pipe(concat('scripts.min.js'))
	.pipe(gulp.dest(source + 'js/'))
	.pipe(browserSync.reload({stream: true}));
	cache.clearAll();
});






// SCSS is being converted into CSS
gulp.task('scss-to-css',function () {
	return scss(source + 'scss/styles.scss', {
		sourcemap: false,
		style: 'compressed'
	})
	.on('error', function (err) {
		console.error('Error!', err.message);
	})
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(source + 'css'))
	.pipe(browserSync.reload({stream: true}));
	cache.clearAll();
});



// Files that are being watched for Live-Reload
gulp.task('watch', function() {
	gulp.watch(source + 'js/scripts/*', ['js']);
	gulp.watch(source + 'scss/**/*', ['scss-to-css']);
	gulp.watch(source + 'css/*');
	gulp.watch(source+'*.html', ['html']);
});





/*
*
*  Adding RTL support in separate CSS
*  DO NOT RUN THIS CMD BEFORE BUILDING YOUR PROJECT! ("gulp build")
* 
*/
gulp.task('rtl-css', function() {
	console.log('[ RTL ] 	Converting CSS to RTL-CSS...');
	gulp.src(dest + 'css/styles.css')
	.pipe(postcss([
	              rtlcss(),
	              ]))
	.on('error', function (err) {
		console.error('Error!', err.message);
	})
	.pipe(gulp.dest(dest + 'css/rtl/'));
	console.log('[ RTL ] 	RTL-CSS task completed!');
	console.log('[ RTL ] 	Saved to /rtl/styles.css');
	console.log(' ');
});






// When you are ready to distribute your project.. use this CMD: gulp build
gulp.task('build', function() {

	/*
	*
	*  Minifying images
	* 
	*/
	console.log(' ');
	console.log('[ ============================================ ]');
	console.log('[ ============================================ ]');

	console.log(' ');
	console.log('[ IMG ] 	Minifying images...');
	gulp.src(source + 'img/*')
	.pipe(cache(
	            imagemin({
	            	interlaced: true,
	            	progressive: true,
	            	optimizationLevel: 8
	            })
	            ))
	.pipe(gulp.dest(dest + 'img')); 
	console.log('[ IMG ] 	Images minified successfully! ');
	console.log(' ');


	/*
	*
	*  Minifying and combining all JS files
	* 
	*/
	console.log('[ JS ] 		Minifying and Combining all JS files...');
	gulp.src([
	         source + 'js/scripts.min.js',
	         ])
	.pipe(uglify())
	.pipe(gulp.dest(dest + 'js/'));
	console.log('[ JS ] 		Minifying and combining completed!');
	console.log(' ');


	/*
	*
	*  Minifying and adding prefixes in CSS
	* 
	*/
	console.log('[ CSS ] 	Adding prefixes...');
	console.log('[ CSS ] 	Minifying CSS...');
	gulp.src(source + 'css/styles.css')
	.pipe(postcss([
	              autoprefixer(),
	              ]))
	.on('error', function (err) {
		console.error('Error!', err.message);
	})
	.pipe(cleanCSS())
	.pipe(gulp.dest(dest + 'css'));
	console.log('[ CSS ] 	Prefixes & Minifying completed!');


	/*
	*
	*  Transferring HTML files to distribution folder
	* 
	*/
	console.log('[ HTML ] 	Transferring HTML files... ');
	var buildFiles = gulp.src([
	                          source+'*.html',
	                          ]).pipe(gulp.dest(dest));
	console.log('[ HTML ] 	All HTML files has been transferred! ');
	console.log(' ');

	/*
	*
	*  Clearing all cache of minified images
	* 
	*/
	console.log('[ X ] 	 	Clearing all Cache(s) ');
	cache.clearAll();
	console.log(' ');

	console.log('[ ============================================ ]');
	console.log('[ ============================================ ]');
	console.log(' ');

});


// browser-sync that refreshes the page everytime... and open URL for the first time in browser
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: source
		},
		//port: 4080,
		ui: false
	});
});



// tasks to perform for first time when you type CMD (gulp)
gulp.task('default', ['html', 'scss-to-css', 'js', 'watch', 'browser-sync']);
