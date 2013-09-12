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

    copy: {
      main: {
        files: [
          { expand: true, cwd: 'bower_components/jquery', src: ['jquery.min.js'], dest: 'dist/js', filter: 'isFile' },
          { expand: true, cwd: 'bower_components/zepto', src: ['zepto.min.js'], dest: 'dist/js', filter: 'isFile' }
        ]
      },
      assets: {
        files: [
          { expand: true, cwd: 'src/assets', src: ['**'], dest: 'dist/assets' }
        ]
      }
    }

    rename: {
      fullcalendar: {
        files: [
          {
            src: 'src/less/fullcalendar/fullcalendar.css',
            dest: 'src/less/fullcalendar/fullcalendar.less'
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
            dest: 'assets/js/<%= pkg.name %>.min.js'
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
  grunt.loadNpmTasks('grunt-contrib-rename');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-recess');

  // JS distribution task.
  grunt.registerTask('dist-js', ['<%= copy.main %>', 'concat', 'uglify']);

  // Copy assets
  grunt.registerTask('dist-assets', ['<%= copy.assets %>']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['recess']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-js', 'dist-assets']);

  // Default task.
  grunt.registerTask('default', ['dist-css', 'dist-js']);
};