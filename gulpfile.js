const fs = require('fs');
const { src, dest, parallel, series, watch } = require('gulp');
const gulpClean = require('gulp-clean');
const concat = require('gulp-concat');
const include = require('gulp-include');
const flatten = require('gulp-flatten'); // исключает путь у файла
const ghPages = require('gulp-gh-pages');

// CONFIG
const siteName = 'creative-portfolio'   // название главной страницы сайта
const rootDir = 'app'   // корневая папка проекта
const devDir = `${rootDir}/dev` // каталог разработки
const resultDir = `${rootDir}/src` // каталог вывода результатов
const distDir = 'dist'   // папка дистрибутива
// css
const cssDevDir = `${devDir}/scss`    // каталог исходных css
const cssDev = `main.scss`    // главный файл css разработки
const cssResult = `main.min.css`    // результирующий файл css
// js
const jsDevDir = `${devDir}/js`    // каталог исходных js
const jsDev = `index.js`    // главный файл js разработки
const jsResult = `index.min.js`    // результирующий файл js
// images
const imgDevDir = `${devDir}/img`    // каталог исходных изображений
const spriteDevDir = `${imgDevDir}/sprite`    // каталог для svg, которые необходимо объединить в спрайт
const imgResultDir = `${resultDir}/img`    // каталог результирующих сжатых и преобразованных изображений
// fonts
const fontsDevDir = `${devDir}/fonts`    // каталог исходных шрифтов
const fontsResultDir = `${resultDir}/fonts`    // каталог результирующих шрифтов
// html
const htmlDevPages = `${devDir}/html-pages`
const htmlDevComponents = `${devDir}/html-components`
const htmlResulPages = `${resultDir}/html-pages`


const htmlHead = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${siteName}</title>
<link rel="stylesheet" href="${cssResult}">
<script defer src="${jsResult}"></script>
</head>`
const htmlHeader = `
<body>
	<header>
		HEADER
	</header>`
const htmlMain = `
	<main>
		MAIN
	</main>`
const htmlFooter = `
	<footer>
		FOOTER
	</footer>
</body>
</html>`
const htmlIndex = `
<!--=include head.html -->
<!--=include header.html -->
<!--=include main.html -->
<!--=include footer.html -->
`

// Create project
function createProject(cb) {
	// создание каталогов
	const directories = [rootDir, devDir, resultDir, htmlDevPages, htmlDevComponents, cssDevDir, jsDevDir, imgDevDir, spriteDevDir, htmlResulPages, imgResultDir, fontsDevDir, fontsResultDir, distDir];
	directories.forEach((dir) => {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
			console.log(`Каталог "${dir}" успешно создан`);
		} else {
			console.log(`Каталог "${dir}" уже существует`);
		}
	});
	// создание файлов
	//html
	if (!fs.existsSync(`${htmlDevComponents}/head.html`)) {                 // head
		fs.writeFileSync(`${htmlDevComponents}/head.html`, htmlHead);
		console.log(`Файл "head.html" успешно создан`);
	} else {
		console.log(`Файл "head.html" уже существует`);
	}
	if (!fs.existsSync(`${htmlDevComponents}/header.html`)) {               // header
		fs.writeFileSync(`${htmlDevComponents}/header.html`, htmlHeader);
		console.log(`Файл "header.html" успешно создан`);
	} else {
		console.log(`Файл "header.html" уже существует`);
	}
	if (!fs.existsSync(`${htmlDevComponents}/main.html`)) {               // main
		fs.writeFileSync(`${htmlDevComponents}/main.html`, htmlMain);
		console.log(`Файл "main.html" успешно создан`);
	} else {
		console.log(`Файл "main.html" уже существует`);
	}
	if (!fs.existsSync(`${htmlDevComponents}/footer.html`)) {               // footer
		fs.writeFileSync(`${htmlDevComponents}/footer.html`, htmlFooter);
		console.log(`Файл "footer.html" успешно создан`);
	} else {
		console.log(`Файл "footer.html" уже существует`);
	}
	if (!fs.existsSync(`${htmlDevPages}/index.html`)) {               // index.html
		fs.writeFileSync(`${htmlDevPages}/index.html`, htmlIndex);
		console.log(`Файл "index.html" успешно создан`);
	} else {
		console.log(`Файл "index.html" уже существует`);
	}
	// css
	if (!fs.existsSync(`${cssDevDir}/${cssDev}`)) {
		fs.writeFileSync(`${cssDevDir}/${cssDev}`, '');
		console.log(`Файл "${cssDev}" успешно создан`);
	} else {
		console.log(`Файл "${cssDev}" уже существует`);
	}
	if (!fs.existsSync(`${rootDir}/${cssResult}`)) {
		fs.writeFileSync(`${rootDir}/${cssResult}`, '');
		console.log(`Файл "${cssResult}" успешно создан`);
	} else {
		console.log(`Файл "${cssResult}" уже существует`);
	}
	if (!fs.existsSync(`${jsDevDir}/${jsDev}`)) {
		fs.writeFileSync(`${jsDevDir}/${jsDev}`, '');
		console.log(`Файл "${jsDev}" успешно создан`);
	} else {
		console.log(`Файл "${jsDev}" уже существует`);
	}
	if (!fs.existsSync(`${rootDir}/${jsResult}`)) {
		fs.writeFileSync(`${rootDir}/${jsResult}`, '');
		console.log(`Файл "${jsResult}" успешно создан`);
	} else {
		console.log(`Файл "${jsResult}" уже существует`);
	}
	cb();
}
exports.create = series(createProject)

// SERVER
const browserSync = require('browser-sync').create();
function startServer() {
	browserSync.init({
		server: { baseDir: rootDir },
		notify: false, //сообщения в браузере
		online: true, // управление интернет-подключением
		// tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
	})
}
exports.sync = startServer;

// WATCH
function startWatch() {
	watch([`${htmlDevPages}/index.html`, `${htmlDevComponents}/**/*.html`]).on('change', htmlIndexDev)
	watch([`${htmlDevPages}/**/*.html`, `!${htmlDevPages}/index.html`, `${htmlDevComponents}/**/*.html`]).on('change', htmlPagesDev)
	watch(`${cssDevDir}/${cssDev}`, stylesDev)
	watch(`${jsDevDir}/**/*.js`, scriptsDev)
}
exports.watch = startWatch;

// HTML
function cleanHtml() {
	return src([`${htmlResulPages}/*`, `${rootDir}/index.html`], { allowEmpty: true })
		.pipe(gulpClean())
}
function htmlIndexDev() {
	return src(`${htmlDevPages}/index.html`, { allowEmpty: true })
		.pipe(include({ includePaths: `${htmlDevComponents}` }))
		.pipe(dest(`${rootDir}/`))
		.pipe(browserSync.stream())
}
function htmlPagesDev() {
	return src([`${htmlDevPages}/**/*.html`, `!${htmlDevPages}/index.html`], { allowEmpty: true })
		.pipe(include({ includePaths: `${htmlDevComponents}` }))
		.pipe(dest(`${htmlResulPages}/`))
		.pipe(browserSync.stream())
}
function htmlIndexBuild() {
	return src(`${htmlDevPages}/index.html`, { allowEmpty: true })
		.pipe(include({ includePaths: `${htmlDevComponents}` }))
		.pipe(dest(`${rootDir}/`))
}
function htmlPagesBuild() {
	return src([`${htmlDevPages}/**/*.html`, `!${htmlDevPages}/index.html`], { allowEmpty: true })
		.pipe(include({ includePaths: `${htmlDevComponents}` }))
		.pipe(dest(`${htmlResulPages}/`))
}
exports.html = series(cleanHtml, htmlIndexDev, htmlPagesDev)

// STYLE
const scss = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');

function stylesDev() {
	return src([
		`node_modules/swiper/swiper-bundle.min.css`,   // библиотеки
		`${cssDevDir}/**/*`,
		`${cssDevDir}/${cssDev}`
	])
		.pipe(scss())
		.pipe(concat(cssResult))
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
		.pipe(cleanCss({ level: { 1: { specialComments: 0 } }, format: 'beautify' }))  // 'keep-breaks' or 'beautify'
		.pipe(dest(rootDir))
		.pipe(browserSync.stream())            // триггер browserSync для отрисовки страницы
}
function stylesBuild() {
	return src([
		`node_modules/swiper/swiper-bundle.min.css`,   // библиотеки
		`${cssDevDir}/**/*`,
		`${cssDevDir}/${cssDev}`
	])
		.pipe(scss())
		.pipe(concat(cssResult))
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
		.pipe(cleanCss({ level: { 1: { specialComments: 0 } }, format: 'keep-breaks' }))  // 'keep-breaks' or 'beautify'
		.pipe(dest(rootDir))
}
exports.styles = stylesDev;

// SCRIPTS
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

function scriptsDev() {
	return src([`${jsDevDir}/**/*.js`])
		.pipe(webpackStream({
			mode: 'production',
			performance: { hints: false },
			plugins: [
				// new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery' }), // jQuery (npm i jquery)
			],
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /(node_modules)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env'],
								plugins: ['babel-plugin-root-import']
							}
						}
					}
				]
			},
			optimization: {
				minimize: true,
				minimizer: [
					new TerserPlugin({
						terserOptions: { format: { comments: false } },
						extractComments: false
					})
				]
			},
		}, webpack)).on('error', function handleError() {
			this.emit('end')
		})
		.pipe(concat(jsResult))
		.pipe(dest(rootDir))
		.pipe(browserSync.stream())
}
function scriptsBuild() {
	return src([`${jsDevDir}/**/*.js`])
		.pipe(webpackStream({
			mode: 'production',
			performance: { hints: false },
			plugins: [
				// new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery' }), // jQuery (npm i jquery)
			],
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /(node_modules)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env'],
								plugins: ['babel-plugin-root-import']
							}
						}
					}
				]
			},
			optimization: {
				minimize: true,
				minimizer: [
					new TerserPlugin({
						terserOptions: { format: { comments: false } },
						extractComments: false
					})
				]
			},
		}, webpack)).on('error', function handleError() {
			this.emit('end')
		})
		.pipe(concat(jsResult))
		.pipe(dest(rootDir))
		.pipe(browserSync.stream())
}
exports.scripts = scriptsDev;

// IMAGES
const compressImages = require('compress-images');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const svgSprite = require('gulp-svg-sprite');

function cleanImages() {
	return src(`${imgResultDir}/*`, { allowEmpty: true })
		.pipe(gulpClean())
}
exports.cleanimg = cleanImages

async function imgCompress() {
	compressImages(
		`${imgDevDir}/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif}`,
		`${imgResultDir}/`,
		{ compress_force: false, statistic: true, autoupdate: true },
		false,
		{ jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
		{ png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
		{ svg: { engine: "svgo", command: "--multipass" } },
		{ gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
		function (err, completed) {
			if (completed === true) {
			}
		}
	);
}

function imgWebp() {
	return src(`${imgDevDir}/**/*.{jpg,JPG,jpeg,JPEG,png,PNG}`)
		.pipe(webp({ quality: 40 }))
		.pipe(dest(`${imgResultDir}/`))
}

function imgAvif() {
	return src(`${imgDevDir}/**/*.{jpg,JPG,jpeg,JPEG,png,PNG}`)
		.pipe(avif({ quality: 50 }))
		.pipe(dest(`${imgResultDir}/`))
}

function imgSprite() {
	return src(`${imgDevDir}/sprite/**/*.svg`)
		.pipe(svgSprite({
			mode: {
				view: { // Activate the «view» mode
					bust: false,
					// render: {
					// 	css: true, // scss or css
					// },
					example: true
				},
				// symbol: true // «symbol» mode
			}
		}))
		.pipe(dest(`${imgDevDir}/sprite/`))
}
function copySprite() {
	return src(`${imgDevDir}/sprite/**/sprite.view.svg`)
		.pipe(flatten())
		.pipe(dest(`${imgResultDir}/svg/`))
}

exports.imgconvert = parallel(imgCompress, imgWebp, imgAvif);
exports.svg = series(imgSprite, copySprite)

// FONTS
const fonter = require('gulp-fonter')
const ttf2woff = require('gulp-ttf2woff')
const ttf2woff2 = require('gulp-ttf2woff2')

function startFonter() {
	return src(`${fontsDevDir}/**/*.{otf,eot}`)
		.pipe(fonter({ formats: ['ttf'] }))
		.pipe(dest(`${fontsDevDir}/`))
}
function startTtf2woff() {
	return src(`${fontsDevDir}/**/*.ttf`)
		.pipe(ttf2woff())
		.pipe(dest(`${fontsDevDir}/`))
}
function startTtf2woff2() {
	return src(`${fontsDevDir}/**/*.ttf`)
		.pipe(ttf2woff2())
		.pipe(dest(`${fontsDevDir}/`))
}
function copyFonts() {
	return src(`${fontsDevDir}/**/*.{woff,woff2}`)
		.pipe(flatten())
		.pipe(dest(`${fontsResultDir}/`))
}

exports.font = series(startFonter, startTtf2woff, startTtf2woff2, copyFonts)

// COPY   копирование любых других файлов в проект
function copyFiles() {
	return src([
		`${devDir}/libs/**/*`
	], { base: devDir })
		.pipe(dest(`${resultDir}/`))
}
exports.copyf = copyFiles

// BUILD
function cleanDist() {
	return src(`${distDir}/*`, { allowEmpty: true }).pipe(gulpClean())
}
function resultCopy() {
	return src([
		`${rootDir}/index.html`,
		`${rootDir}/${cssResult}`,
		`${rootDir}/${jsResult}`,
		`${resultDir}/**/*`
	], { base: rootDir })
		.pipe(dest(`${distDir}/`))
}
exports.distcopy = series(cleanDist, resultCopy)

function cleanSrc() {
	return src([
		`${rootDir}/index.html`,
		`${rootDir}/${cssResult}`,
		`${rootDir}/${jsResult}`,
		`${resultDir}/*`
	], { allowEmpty: true })
		.pipe(gulpClean())
}

// DEPLOY
function deployDist() {
	return src(`${distDir}/**/*`)
		.pipe(ghPages())
}
exports.deploy = deployDist

exports.default = series(
	cleanSrc,
	parallel(
		htmlIndexDev,
		htmlPagesDev,
		stylesDev,
		scriptsDev,
		imgCompress,
		imgWebp,
		imgAvif,
		// copyFiles,
		series(imgSprite, copySprite),
		series(startFonter, startTtf2woff, startTtf2woff2, copyFonts)),
	parallel(startServer, startWatch))

exports.build = series(
	parallel(cleanSrc, cleanDist),
	parallel(htmlIndexBuild,
		htmlPagesBuild,
		stylesBuild,
		scriptsBuild,
		imgCompress,
		imgWebp,
		imgAvif,
		// copyFiles,
		series(imgSprite, copySprite),
		series(startFonter, startTtf2woff, startTtf2woff2, copyFonts)),
	resultCopy)
