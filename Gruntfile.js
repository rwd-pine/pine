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
          { expand: true, cwd: 'bower_components/zepto', src: ['*.js'], dest: 'dist/javascripts', filter: 'isFile' },
          { expand: true, cwd: 'bower_components/matchmedia/', src: ['matchmedia.js'], dest: 'src/javascripts/lib', filter: 'isFile' },
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
      pine: {
        src: [
          'src/javascripts/lib/matchmedia.js',
          'src/javascripts/core/pine-submenu.js',
          'src/javascripts/core/pine-navbar.js',
          'src/javascripts/fx/hover.js',
          'src/javascripts/fx/hover-fade.js',
          'src/javascripts/fx/right-to-left.js',
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
      modernizr: {
        files: [
          {
            src: ['src/javascripts/lib/modernizr.js'],
            dest: 'dist/javascripts/modernizr.min.js'
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

    recess: {
      options: {
        compile: true
      },
      main: {
        files: [
          {
            src: ['src/stylesheets/pine.less'],
            dest: 'dist/stylesheets/pine.css'
          },
          {
            src: ['examples/stylesheets/example.less'],
            dest: 'examples/stylesheets/example.css'
          },
          {
            src: ['examples/stylesheets/example-bootstrap.less'],
            dest: 'examples/stylesheets/example-bootstrap.css'
          },
          {
            src: ['examples/stylesheets/example-bootstrap-fixed.less'],
            dest: 'examples/stylesheets/example-bootstrap-fixed.css'
          },
          {
            src: ['examples/stylesheets/example-bootstrap-vertical.less'],
            dest: 'examples/stylesheets/example-bootstrap-vertical.css'
          }
        ]
      },
      min: {
        options: {
          compress: true
        },
        src: ['src/stylesheets/pine.less'],
        dest: 'dist/stylesheets/pine.min.css'
      }
    },

    watch: {
      recess: {
        files: ['src/stylesheets/**/*.less', 'examples/stylesheets/**/*.less'],
        tasks: ['recess']
      },
      uglify: {
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
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-legacssy');

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify', 'compress']);

  // Copy assets
  grunt.registerTask('dist-copy', ['copy']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['recess']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'copy', 'dist-css', 'dist-js']);

  // Default task.
  grunt.registerTask('default', ['dist-css', 'dist-js']);
};
