/* jshint node: true */

module.exports = function(grunt) {
  "use strict";

  // Load the plugins
  require('load-grunt-tasks')(grunt);

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
      assets: {
        files: [
          { expand: true, cwd: 'src/assets', src: ['**'], dest: 'dist/assets' }
        ]
      },
      styles: {
        files: [
          { expand: true, cwd: 'vendor/lesshat/build', src: ['lesshat.less'], dest: 'src/stylesheets/lib' },
          { expand: true, cwd: 'vendor/normalize-css/', src: ['normalize.css'], dest: 'dist/stylesheets' }
        ]
      },
      docs: {
        files: [
          { expand: true, cwd: 'dist/', src: ['**'], dest: 'docs' }
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
        dest: 'dist/javascripts/pine-navigation.js'
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

      docs: {
        files: {
          'docs/stylesheets/docs.css': 'src/stylesheets/docs.less',
          'docs/examples/bootstrap-fixed/css/bootstrap-fixed.css': 'docs/examples/bootstrap-fixed/css/bootstrap-fixed.less',
          'docs/examples/bootstrap-horizontal/css/bootstrap-horizontal.css': 'docs/examples/bootstrap-horizontal/css/bootstrap-horizontal.less',
          'docs/examples/bootstrap-vertical/css/bootstrap-vertical.css': 'docs/examples/bootstrap-vertical/css/bootstrap-vertical.less'
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
        files: ['src/stylesheets/**/*.less'],
        tasks: ['less', 'legacssy']
      },
      js: {
        files: 'src/javascripts/**/*.js',
        tasks: ['concat', 'uglify']
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
          'dist/stylesheets/<%= pkg.name %>-ie8.css': 'dist/stylesheets/<%= pkg.name %>.css'
        }
      }
    }

  });


  // TASKS
  // -------------------------

  // Build Docs - Github pages
  grunt.registerTask('build-docs', ['copy:docs', 'less:docs']);

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
