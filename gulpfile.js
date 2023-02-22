const gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    htmlbuild = require('gulp-htmlbuild'),
    es = require('event-stream'),
    path = require('path'),
    jshint = require('gulp-jshint'),
    request = require('request'),
    livereload = require('gulp-livereload'),
    moment = require('moment'),
    fs = require('fs'),
    less = require('gulp-less'),
    replace = require('gulp-replace'),
    webserver = require('gulp-webserver'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify-es').default,
    rename = require("gulp-rename");

const { task, watch, series, parallel } = require('gulp');

let projectBuild = '';
let iframe = false;
let version = (new Date()).getTime();

// https://www.npmjs.com/package/gulp-webserver
task('serve', async () => {
    gulp.series('watch')
    gulp.src('src')
        .pipe(webserver({
            livereload: {
                enable: true,
                filter: (fileName) => {
                    // exclude all source maps from livereload
                    if (fileName.match(/LICENSE|\.json$|\.md|lib|rest|node_modules|build|pdf-viewer/)) {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            directoryListing: false,
            open: true,
            port: 9000
        }));
});

task('livereload', async () => {
    gulp.src('src')
        .pipe(livereload());
});

task('watch', async () => {
    // rest
    restInit('http://localhost:8500/guga-guincho/backend/cf/rest-init.cfm');

    watch(['backend/cf/site/*.cfc'
    ], { cwd: './' },
        () => {
            return restInit('http://localhost:8500/guga-guincho/backend/cf/rest-init.cfm');
        });

    livereload.listen();

    watch(['!src/build/**',
        '!src/lib/**',
        '!src/pdf-viewer/**',
        '!src/main/assets/**',
        'src/**/*.html',
        'src/**/*.js',
        'src/**/*.less',
        'src/**/*.css'
    ], { cwd: './' },
        series('livereload', 'jshint'));
});

const restInit = (url) => {
    return request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            console.log('[' + moment().format('HH:mm:ss') + ']', body);
            requestCount = 0;
        } else if (response.statusCode === 500 && requestCount < 3) {
            requestCount++;
            console.log('[' + moment().format('HH:mm:ss') + ']', 'Fail(' + requestCount + ')  \'rest-cf-init\' try again...');
            setTimeout(() => {
                restInit(url);
            }, 3000);

        } else if (response.statusCode === 500) {
            console.log('[' + moment().format('HH:mm:ss') + ']', 'Fail(' + requestCount + ')  \'rest-cf-init\' Try to access by browser please: ' + url);
        }
        return;
    })
}

task('jshint', () => {
    return gulp
        .src(['!src/build/js/**/',
            '!src/lib/**',
            '!src/pdf-viewer/**',
            '!src/assets/**',
            'src/constant/**/*.js',
            'src/directive/**/*.js',
            'src/filter/**/*.js',
            'src/module/**/*.js',
            'src/partial/**/*.js',
            'src/service/**/*.js',
        ], { cwd: './' })
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

task('jshint-genesys', () => {
    return gulp
        .src(['!src/build/**',
            '!src/lib/**',
            '!src/pdf-viewer/**',
            'src/genesys/**/*.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

task('jshint-publish', () => {
    return gulp
        .src(['!src/build/**',
            '!src/lib/**',
            '!src/pdf-viewer/**',
            'src/publish/**/*.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

task('jshint-collect', () => {
    return gulp
        .src(['!src/build/**',
            '!src/lib/**',
            '!src/pdf-viewer/**',
            'src/collect/**/*.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

const gulpSrc = (opts) => {
    let paths = es.through();
    let files = es.through();

    paths.pipe(es.writeArray((err, srcs) => {

        for (let i = 0; i <= srcs.length - 1; i++) {
            srcs[i] = 'src/' + srcs[i];
        }

        gulp.src(srcs, opts).pipe(files);
    }));

    return es.duplex(paths, files);
};

task('js-compress', () => {
    return gulp
        .src(['!src/build/js/*.min.js', 'src/build/js/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('src/build/js/'));
});

task('js-clean', () => {
    return gulp
        .src(['!src/build/js/concat.js', 'src/build/js/*.js'])
        .pipe(clean({ force: true }));
});

const jsBuild = es
    .pipeline(
        uglify(),
        //plugins.concat('concat_' + version + '.js'),
        plugins.concat('concat.js'),
        gulp.dest('src/build/js')
    );

const cssBuild = es
    .pipeline(
        plugins.concat('concat.css'),
        gulp.dest('src/build/css')
    );


task('htmlbuild', () => {

    return gulp.src(['src/index.html'])
        .pipe(htmlbuild({
            // build js with preprocessor 
            js: htmlbuild.preprocess.js((block) => {

                block.pipe(gulpSrc({ allowEmpty: true }))
                    .pipe(jsBuild);

                block.end('js/concat.js');

            }),

            // build css with preprocessor 
            css: htmlbuild.preprocess.css((block) => {

                block.pipe(gulpSrc({ allowEmpty: true }))
                    .pipe(cssBuild);

                block.end('css/concat.css');

            }),

            // remove blocks with this target 
            remove: (block) => {
                block.end();
            },

            // add a template with this target 
            template: (block) => {
                es.readArray([
                    '<!--',
                    '  processed by htmlbuild (' + block.args[0] + ')',
                    '-->'
                ].map((str) => {
                    return block.indent + str;
                })).pipe(block);
            }
        }))
        .pipe(gulp.dest('src/build'));
});



task('less', () => {
    return gulp.src('src/app.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        //.pipe(cssmin())
        //.pipe(gulp.dest('src/build'))
        .pipe(rename({
            //suffix: '_' + version,
            extname: ".css"
        }))
        .pipe(gulp.dest('src/build'))
});

task('material-css', () => {
    return gulp.src('src/lib/angular-material/angular-material.min.css')
        .pipe(gulp.dest('src/build/lib/angular-material/'));
});

task('html-files', () => {
    return gulp.src(['src/partial/**/*.html'])
        .pipe(gulp.dest('src/build/partial/' + projectBuild));
});

task('assets', () => {
    return gulp
        .src(['src/assets/**/*.jpg',
            'src/assets/**/*.png',
            'src/assets/**/*.gif',
            'src/assets/**/*.xml',
            'src/assets/**/*.pdf',
            'src/assets/**/*.webmanifest'
        ])
        .pipe(gulp.dest('src/build/assets/'));
});

task('assets-main-dependencies', () => {
    return gulp
        .src(['src/main/assets/**/*.jpg',
            'src/main/assets/**/*.png',
            'src/mainassets/**/*.gif'
        ])
        .pipe(gulp.dest('src/build/main/assets/'));
});

task('lib-fonts', () => {
    return gulp
        .src(['src/lib/**/*.ttf',
            'src/lib/**/*.woff',
            'src/lib/**/*.woff2'
        ])
        .pipe(gulp.dest('src/build/lib/'));
});

task('index-replace', () => {
    return new Promise((resolve, reject) => {
        /*gulp.src(['src/user-unsupported-browser.html',
            'src/user-unsupported-browser.css'])
            .pipe(gulp.dest('src/build/'));*/

        if (iframe) {
            gulp.src('src/iframe.html')
                .pipe(rename({
                    basename: 'index',
                    extname: ".html"
                }))
                .pipe(gulp.dest('src/build'));

            gulp.src('src/build/index.html')
                .pipe(replace('<script src="http://localhost:35729/livereload.js"></script>', ''))
                .pipe(replace('js/concat.js', 'js/concat.js?v=' + version))
                .pipe(replace('app.less', 'app.css?v=' + version))
                .pipe(replace('stylesheet/less', 'stylesheet'))
                .pipe(gulp.dest('src/build'));
        } else {
            gulp.src('src/build/index.html')
                .pipe(replace('<script src="http://localhost:35729/livereload.js"></script>', ''))
                .pipe(replace('js/concat.js', 'js/concat.js?v=' + version))
                .pipe(replace('app.less', 'app.css?v=' + version))
                .pipe(replace('stylesheet/less', 'stylesheet'))
                .pipe(rename({
                    basename: 'index',
                    extname: ".html"
                }))
                .pipe(gulp.dest('src/build'));
        }

        resolve();
    });
});


task('pdf-viewer', () => {
    return gulp
        .src('src/pdf-viewer/**')
        .pipe(gulp.dest('src/build/pdf-viewer'));
});

task('pdf-viewer-worker', () => {
    return gulp
        .src('src/pdf-viewer/build/pdf.worker.js')
        .pipe(uglify())
        .pipe(rename({
            basename: 'concat.worker'
        }))
        .pipe(gulp.dest('src/build/js/'))
        ;
});

task('rest', () => {
    return gulp
        .src(['backend/cf/**/*.cfm',
            'backend/cf/**/*.cfc',
            'backend/cf/**/*.bat',
            'backend/cf/**/*.xlsx',
        ])
        .pipe(gulp.dest('src/build/backend'));
});

task('web-config', () => {
    return gulp.src('src/web.config')
        .pipe(gulp.dest('src/build'));
});

task('clean', () => {
    if (fs.existsSync('src/build')) {
        console.info(new Date(), 'Apagar src/build')
        console.info(new Date(), 'Criar src/build')
        return gulp.src('src/build')
            .pipe(clean({ force: true }));
    } else {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
});

task('default', () => {
    series('serve')();
});

task('backend-cf', () => {
    return gulp
        .src(['./backend/cf/**/*.cfm',
            './backend/cf/**/*.cfc'
        ])
        .pipe(gulp.dest('./src/build/backend/cf'));
});

task('build', (cb) => {
    //projectBuild = 'main';

    series('clean',
        parallel('htmlbuild',
            'less',
            'material-css',
            'html-files',
            'assets',
            'lib-fonts'),
        'index-replace',
        'jshint',
        'backend-cf')();
    cb();
});

/*
web.config

<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <httpErrors errorMode="Detailed" />
        <modules>
            <remove name="WebDAVModule" />
        </modules>
        <handlers>
            <remove name="WebDAV" />
        </handlers>
        <staticContent>
            <mimeMap fileExtension=".properties" mimeType="application/octet-stream" />
        </staticContent>
    </system.webServer>
</configuration>
*/