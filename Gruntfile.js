// Generated on 2013-12-02 using generator-angular 0.6.0-rc.2
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: './build/dist',
      cordova: {
        path: {
          build: './build',
          root: './build/cordova',
          template: './cordova/template',
          www: './build/cordova/www',
          ios: './build/cordova/platforms/ios/www',
          android: './build/cordova/platforms/android/assets/www'
        },
        name: 'Lego Nxt Remote',
        folder: 'lego-nxt-remote',
        namespace: 'mronemous.lego.nxt.remote'
      }
    },

    exec: {
      'cordova-create': { cwd: '<%= yeoman.cordova.path.build %>', cmd: 'cordova create "cordova" "<%= yeoman.cordova.namespace%>" "<%= yeoman.cordova.name%>"' },
      'cordova-android': { cwd: '<%= yeoman.cordova.path.root %>', cmd: 'cordova platform add android' },
      'cordova-ios': { cwd: '<%= yeoman.cordova.path.root %>', cmd: 'cordova platform add ios' },
      'cordova-prepare': { cwd: '<%= yeoman.cordova.path.root %>', cmd: 'cordova prepare' }
    },

    typescript: {
        app: {
            src: [
                '<%= yeoman.app %>/scripts/**/*.ts',
            ],
            dest: '<%= yeoman.app %>/scripts/scripts.js',
            options: {
                sourcemap: true,
                target: "ES5"
            }
        },

        nxt: {
          src: [
              'app/scripts/lego.nxt/**/*.ts'
          ],
          dest: 'app/scripts/lego.nxt/nxt.js',
          options: {
              sourcemap: true,
              target: "ES5"
          }
        }
    },
    "tpm-install": {
      server: {src: "package.json", dest: "types/"},
      bower: {src: "bower.json", dest: "types/"}
    },
    "tpm-index": {
      all: {src: ["types/**/*.d.ts"], dest: "types/all.d.ts"}
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      typescript_app: {
        files: ['<%= yeoman.app %>/scripts/**/*.ts'],
        tasks: ['typescript']
      },
      js: {
        files: ['{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all']
      },

      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer', 'copy:cordova-app']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          // Optional configurations that you can uncomment to use
          // removeCommentsFromCDATA: true,
          // collapseBooleanAttributes: true,
          // removeAttributeQuotes: true,
          // removeRedundantAttributes: true,
          // useShortDoctype: true,
          // removeEmptyAttributes: true,
          // removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['*.html', 'views/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      cordova: {
        files: [{
          dot: true,
          src: [
            '<%= yeoman.cordova.path.root %>/**',
            '!<%= yeoman.cordova.path.root %>/.git*',
            '!<%= yeoman.cordova.path.root %>/config.xml'
          ]
        }]
      },
      'cordova-www' : {
        files: [{
          dot: true,
          src: [
            '<%= yeoman.cordova.path.www %>/*',
          ]
        }]
      },
      server: '.tmp'
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'images/{,*/}*.{webp}',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: [
            'generated/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      'cordova-app': {
        expand: true,
        cwd: '.tmp/styles/',
        dest: '<%= yeoman.app %>/styles',
        src: '{,*/}*.css'
      },
      'cordova-plugin': {
        expand: true,
        cwd: '<%= yeoman.cordova.path.template %>/plugins',
        dest: '<%= yeoman.cordova.path.root %>/plugins',
        src: '**'
      }
    },

    symlink : {

            options: {
                overwrite : false
            },

            //HACK: cordova prepare doesn't seem to copy symlinks correctly, so we will copy them directly.
            'cordova-app': {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.cordova.path.android %>',
                        src: "*"
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.cordova.path.ios %>',
                        src: "*"
                    }
                ]
            },
            'cordova-dist': {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.dist %>',
                        dest: '<%= yeoman.cordova.path.android %>',
                        src: "*"
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.dist %>',
                        dest: '<%= yeoman.cordova.path.ios %>',
                        src: "*"
                    }
                ]
            }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server',
        'copy:styles'
      ],
      test: [
        'compass',
        'copy:styles'
      ],
      dist: [
        'compass:dist',
        'copy:styles',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.loadNpmTasks('typescript-tpm');
  grunt.registerTask("typescript-tpm", ['tpm-install', 'tpm-index'])

  grunt.registerTask('build', [
    'clean:dist',
    'typescript',
    'useminPrepare',
    'concurrent:dist',
    ////'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    //'cdnify',
    'cssmin',
    'uglify',
    //'rev',
    'usemin'//,
    //'exec:cordovaPrepare'
  ]);

  //Create cordova project wrapper
  grunt.registerTask('create:cordova', [
    'clean:cordova',
    'exec:cordova-create',
    //clear the default www.
    'clean:cordova-www',
    //copy the local template plugins
    'copy:cordova-plugin',
    'exec:cordova-android',
    'exec:cordova-ios',
    //prepare will setup the metadata plugin js
    'exec:cordova-prepare',
    'compass:dist',
    'copy:cordova-app',
    'symlink:cordova-app'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
