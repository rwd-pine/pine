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
          { expand: true, cwd: 'bower_components/zepto', src: ['zepto.js'], dest: 'src/javascripts/lib', filter: 'isFile' },
          { expand: true, cwd: 'bower_components/matchmedia/', src: ['matchmedia.js'], dest: 'src/javascripts/lib', filter: 'isFile' },
          { expand: true, cwd: 'bower_components/hoover/lib', src: ['hoover.js'], dest: 'src/javascripts/lib', filter: 'isFile' }
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
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      zepto: {
        src: [
          'src/javascripts/lib/zepto.js',
          'src/javascripts/lib/zepto-touch.js'
        ],
        dest: 'dist/javascripts/zepto.js'
      },
      pine: {
        src: [
          'src/javascripts/lib/log.js',
          'src/javascripts/lib/matchmedia.js',
          'src/javascripts/lib/hoover.js',
          'src/javascripts/core/pine-submenu.js',
          'src/javascripts/core/pine-navbar.js',
          'src/javascripts/fx/hover.js',
          'src/javascripts/fx/hover-fade.js',
          'src/javascripts/fx/right-to-left.js',
          'src/javascripts/fx/toggle.js',
          'src/javascripts/core/jquery-pine.js',
          'src/javascripts/core/zepto-pine.js',
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
      },
      zepto: {
        files: [
          {
            src: ['<%= concat.zepto.dest %>'],
            dest: 'dist/javascripts/zepto.min.js'
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
        // options: {
        //   strictMath: true,
        //   sourceMap: true,
        //   outputSourceFiles: true,
        //   sourceMapURL: '<%= pkg.name %>.css.map',
        //   sourceMapFilename: 'dist/stylesheets/<%= pkg.name %>.css.map'
        // },
        files: {
          'dist/stylesheets/<%= pkg.name %>.css': 'src/stylesheets/pine.less',
          'examples/bootstrap-fixed/css/bootstrap-fixed.css': 'examples/bootstrap-fixed/css/bootstrap-fixed.less',
          'examples/bootstrap-horizontal/css/bootstrap-horizontal.css': 'examples/bootstrap-horizontal/css/bootstrap-horizontal.less',
          'examples/bootstrap-vertical/css/bootstrap-vertical.css': 'examples/bootstrap-vertical/css/bootstrap-vertical.less'
        }
      }
      // minify: {
      //   options: {
      //     cleancss: true,
      //     report: 'min'
      //   },
      //   files: {
      //     'dist/stylesheets/<%= pkg.name %>.min.css': 'dist/css/<%= pkg.name %>.css'
      //   }
      // }
    },

    watch: {
      css: {
        files: ['src/stylesheets/**/*.less', 'examples/**/*.less'],
        tasks: ['less', 'legacssy']
      },
      js: {
        files: 'src/javascripts/**/*.js',
        tasks: ['concat', 'uglify']
      }
    },

    legacssy: {
      default: {
        options: {
          legacyWidth: 600,
          matchingOnly: true,
          overridesOnly: true
        },
        files: {
          'dist/stylesheets/pine-ie8.css': 'dist/stylesheets/pine.css'
        }
      }
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
