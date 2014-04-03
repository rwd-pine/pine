/* jshint node: true */

module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/**\n' +
              '* <%= pkg.name %>.js v<%= pkg.version %>\n' +
              '*/\n',

    // Task configuration.
    clean: {
      dist: ['dist']
    },

    // Sound of the future
    // --------------------
    // jshint: {
    //   options: {
    //     jshintrc: 'src/javascripts/.jshintrc'
    //   },
    //   gruntfile: {
    //     src: 'Gruntfile.js'
    //   },
    //   src: {
    //     src: ['src/javascripts/*.js']
    //   },
    //   test: {
    //     src: ['src/javascripts/examples/unit/*.js']
    //   }
    // },

    copy: {
      javascript: {
        files: [
          { expand: true, cwd: 'bower_components/jquery', src: ['jquery.min.js'], dest: 'dist/javascripts', filter: 'isFile' },
          { expand: true, cwd: 'bower_components/jquery-legacy', src: ['jquery.min.js'], dest: 'dist/javascripts/jquery-legacy', filter: 'isFile' },
          { expand: true, cwd: 'bower_components/matchmedia/', src: ['matchmedia.js'], dest: 'src/javascripts/lib', filter: 'isFile' },
          { expand: true, cwd: 'src/javascripts/lib/', src: ['matchmedia.js'], dest: 'dist/javascripts/', filter: 'isFile' }
        ]
      },
      assets: {
        files: [
          { expand: true, cwd: 'src/assets', src: ['**'], dest: 'dist/assets' }
        ]
      },
      styles: {
        files: [
          { expand: true, cwd: 'bower_components/lesshat/build', src: ['lesshat.less'], dest: 'src/stylesheets/lib' }
          // { expand: true, cwd: 'bower_components/bootstrap/less', src: ['*.less'], dest: 'src/stylesheets/bootstrap' }
        ]
      },
      docs: {
        files: [
          { expand: true, cwd: 'bower_components/bootstrap/dist/js', src: ['bootstrap.min.js'], dest: 'src/docs/dist/javascripts', filter: 'isFile' },
          { expand: true, cwd: 'dist', src: ['{stylesheets,javascripts}/*.*'], dest: 'src/docs/dist' },
          { expand: true, cwd: 'bower_components/bootstrap/dist/css', src: ['bootstrap.min.css'], dest: 'src/docs/dist/stylesheets' },
          { expand: true, cwd: 'bower_components/normalize-css/', src: ['normalize.css'], dest: 'src/docs/dist/stylesheets' }
        ]
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      pine: {
        src: [
          'src/javascripts/lib/jsnojs.js',
          'src/javascripts/lib/log.js',
          'src/javascripts/lib/matchmedia.js',
          'src/javascripts/core/pine-submenu.js',
          'src/javascripts/core/pine-navbar.js',
          'src/javascripts/fx/hover.js',
          'src/javascripts/fx/hover-fade.js',
          'src/javascripts/fx/right-to-left.js',
          'src/javascripts/fx/toggle.js',
          'src/javascripts/core/jquery-pine.js',
          'src/javascripts/app.js',
        ],
        dest: 'dist/javascripts/pine.js'
      }
    },

    uglify: {
      pine: {
        options: {
          banner: '<%= banner %>'
        },
        files: [
          {
            src: ['<%= concat.pine.dest %>'],
            dest: 'dist/javascripts/<%= pkg.name %>.min.js'
          }
        ]
      }
    },

    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          {expand: true, src: ['dist/javascripts/<%= pkg.name %>.min.js'], dest: '', ext: '.gz.js'}
        ]
      }
    },

    less: {
      pine: {
        // SOURCE MAPS: improvement for debugging, prepared for later
        // options: {
        //   strictMath: true,
        //   sourceMap: true,
        //   outputSourceFiles: true,
        //   sourceMapURL: '<%= pkg.name %>.css.map',
        //   sourceMapFilename: 'dist/stylesheets/<%= pkg.name %>.css.map'
        // },
        files: {
          'dist/stylesheets/<%= pkg.name %>.css': 'src/stylesheets/pine.less'
        }
      },

      pineMinify: {
        options: {
          cleancss: true,
          report: 'min'
        },
        files: {
          'dist/stylesheets/<%= pkg.name %>.min.css': 'dist/stylesheets/<%= pkg.name %>.css'
        }
      },

      examples: {
        files: {
          'src/docs/examples/bootstrap-fixed/css/bootstrap-fixed.css': 'src/docs/examples/bootstrap-fixed/css/bootstrap-fixed.less',
          'src/docs/examples/bootstrap-horizontal/css/bootstrap-horizontal.css': 'src/docs/examples/bootstrap-horizontal/css/bootstrap-horizontal.less',
          'src/docs/examples/bootstrap-vertical/css/bootstrap-vertical.css': 'src/docs/examples/bootstrap-vertical/css/bootstrap-vertical.less'
        }
      }
    },

    csslint: {
      options: {
        csslintrc: 'src/stylesheets/.csslintrc'
      },
      src: [
        'dist/stylesheets/<%= pkg.name %>.css',
        'dist/stylesheets/<%= pkg.name %>-ie8.css',
        'src/docs/examples/**/*.css'
      ]
    },

    watch: {
      css: {
        files: ['src/stylesheets/**/*.less', 'src/docs/**/*.less'],
        tasks: ['less', 'legacssy']
      },
      js: {
        files: 'src/javascripts/**/*.js',
        tasks: ['concat', 'uglify']
      },
      docs: {
        files: 'src/docs/**/*.html',
        tasks: ['jekyll']
      }
    },

    // Flatten media queries and generate special CSS for IE8
    legacssy: {
      dist: {
        options: {
          legacyWidth: 600,
          matchingOnly: true,
          overridesOnly: true
        },
        files: {
          'dist/stylesheets/pine-ie8.css': 'dist/stylesheets/pine.css'
        }
      }
    },

    jekyll: {
      docs: {}
    }

  });


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-legacssy');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-jekyll');

  // Build Docs - copy dist to
  grunt.registerTask('build-docs', ['copy:docs', 'jekyll']);

  // JS distribution task.
  // TODO: Compress later grunt.registerTask('dist-js', ['concat', 'uglify', 'compress']);
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // Copy assets
  grunt.registerTask('dist-copy', ['copy']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['less', 'legacssy']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'copy', 'dist-css', 'dist-js']);

  // Default task.
  grunt.registerTask('default', ['dist-css', 'dist-js']);
};
