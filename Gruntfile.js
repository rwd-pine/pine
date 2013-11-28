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
    //     src: ['src/javascripts/tests/unit/*.js']
    //   }
    // },


    copy: {
      javascript: {
        files: [
          { expand: true, cwd: 'bower_components/jquery', src: ['jquery.min.js'], dest: 'dist/javascripts', filter: 'isFile' },
          { expand: true, cwd: 'bower_components/zepto', src: ['zepto.min.js'], dest: 'dist/javascripts', filter: 'isFile' },
          { expand: true, cwd: 'bower_components/matchmedia/', src: ['matchmedia.js'], dest: 'src/javascripts/', filter: 'isFile' },
        ]
      },
      assets: {
        files: [
          { expand: true, cwd: 'src/assets', src: ['**'], dest: 'dist/assets' }
        ]
      },
      styles: {
        files: [
          { expand: true, cwd: 'bower_components/normalize-css', src: ['normalize.css'], dest: 'src/stylesheets/lib' },
          { expand: true, cwd: 'bower_components/lesshat/build', src: ['lesshat.less'], dest: 'src/stylesheets/lib' }
          // { expand: true, cwd: 'bower_components/bootstrap/less', src: ['*.less'], dest: 'src/stylesheets/bootstrap' }
        ]
      }
    },

    rename: {
      normalize: {
        files: [
          {
            src: 'src/stylesheets/lib/normalize.css',
            dest: 'src/stylesheets/lib/normalize.less'
          }
        ]
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      main: {
        src: [
          'src/javascripts/lib/matchmedia.js',
          // 'src/javascripts/core/pine.js',
          'src/javascripts/core/pine-submenu.js',
          'src/javascripts/core/pine-navbar.js',
          'src/javascripts/fx/hover.js',
          'src/javascripts/fx/hover-fade.js',
          'src/javascripts/fx/right-to-left.js',
          'src/javascripts/app.js'
        ],
        dest: 'dist/javascripts/<%= pkg.name %>.js'
      }
    },

    uglify: {
      main: {
        options: {
          banner: '<%= banner %>'
        },
        files: [
          {
            src: ['<%= concat.main.dest %>'],
            dest: 'dist/javascripts/<%= pkg.name %>.min.js'
          }
        ]
      },
      modernizr: {
        files: [
          {
            src: ['src/javascripts/lib/modernizr.js'],
            dest: 'dist/javascripts/modernizr.min.js'
          }
        ]
      }
    },

    recess: {
      options: {
        compile: true
      },
      main: {
        files: [
          {
            src: ['src/stylesheets/pine.less'],
            dest: 'dist/stylesheets/app.css'
          },
          {
            src: ['test/stylesheets/test.less'],
            dest: 'test/stylesheets/test.css'
          },
          {
            src: ['test/stylesheets/test-bootstrap.less'],
            dest: 'test/stylesheets/test-bootstrap.css'
          },
          {
            src: ['test/stylesheets/test-bootstrap-fixed-inverted.less'],
            dest: 'test/stylesheets/test-bootstrap-fixed-inverted.css'
          }
        ]
      },
      min: {
        options: {
          compress: true
        },
        src: ['src/stylesheets/pine.less'],
        dest: 'dist/stylesheets/app.min.css'
      }
    },

    watch: {
      recess: {
        files: ['src/stylesheets/**/*.less', 'test/stylesheets/**/*.less'],
        tasks: ['recess']
      },
      uglify: {
        files: 'src/javascripts/**/*.js',
        tasks: ['concat', 'uglify']
      }
    }
  });


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-rename');
  grunt.loadNpmTasks('grunt-recess');

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // Copy assets
  grunt.registerTask('dist-copy', ['copy', 'rename']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['recess']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'copy', 'rename', 'dist-css', 'dist-js']);

  // Default task.
  grunt.registerTask('default', ['dist-css', 'dist-js']);
};