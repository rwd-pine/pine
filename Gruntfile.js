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
          { expand: true, cwd: 'bower_components/bootstrap/js', src: ['*.js'], dest: 'src/javascripts/bootstrap', filter: 'isFile' },
        ]
      },
      assets: {
        files: [
          { expand: true, cwd: 'src/assets', src: ['**'], dest: 'dist/assets' }
        ]
      },
      styles: {
        files: [
          { expand: true, cwd: 'bower_components/normalize-css', src: ['normalize.css'], dest: 'src/stylesheets' }
          { expand: true, cwd: 'bower_components/bootstrap/less', src: ['*.less'], dest: 'src/stylesheets/bootstrap' }
        ]
      }
    },

    rename: {
      normalize: {
        files: [
          {
            src: 'src/stylesheets/normalize.css',
            dest: 'src/stylesheets/normalize.less'
          }
        ]
      }
    },

    uglify: {
      main: {
        options: {
          banner: '<%= banner %>'
        },
        files: [
          {
            src: ['src/javascripts/app.js'],
            dest: 'dist/javascripts/<%= pkg.name %>.min.js'
          }
        ]
      }
    },

    recess: {
      options: {
        compile: true
      },
      main: {
        src: ['src/stylesheets/app.less'],
        dest: 'dist/stylesheets/app.css'
      },
      min: {
        options: {
          compress: true
        },
        src: ['src/stylesheets/app.less'],
        dest: 'dist/stylesheets/app.min.css'
      }
    },

    watch: {
      recess: {
        files: 'src/stylesheets/*.less',
        tasks: ['recess']
      },
      uglify: {
        files: 'src/javascripts/*.js',
        tasks: ['concat', 'uglify']
      }
    }
  });


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-rename');
  grunt.loadNpmTasks('grunt-recess');

  // JS distribution task.
  grunt.registerTask('dist-js', ['uglify']);

  // Copy assets
  grunt.registerTask('dist-copy', ['copy', 'rename']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['recess']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'copy', 'rename', 'dist-css', 'dist-js']);

  // Default task.
  grunt.registerTask('default', ['dist-css', 'dist-js']);
};