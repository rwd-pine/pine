# PineJS

### Tiny but powerfull responsive multilevel navigation.

## Features

* Bootstrap 3 compatible, but standalone too
* Customizable with effects and skins
* Accessible Mobile First architecture
* jQuery/Zepto versions
* Using the best of LESS variables power
* Internet Explorer 8+ compatible

# Usage instructions

Installation of Pine is quite easy, just follow steps below and you will be able to get the plugin up and running.
<!---If you notice any bugs, please post them to [GitHub issues](github_url).-->

1. Link JS plugin:
```html
  <!-- Put this right before the </body> closing tag -->
  <script src="pine/javascripts/pine.js"></script>
```

2. Link CSS:
```html
  <!-- Put this in the <head> -->
  <link rel="stylesheet" href="dist/stylesheets/pine.css">
```

2. Add markup:
```html
  TODO: code
  <div id="nav" role="navigation" class="pine pine-horizontal">
    <ul>
      ...
    </ul>
  </div>
```

3. Hook up the plugin:
```html
  <!-- Put this right before the </body> closing tag -->
  <script>
    $('.pine').pine()
  </script>
```

4. Customizable options:
```javascript
  $('.pine').pine({ // Selector
    jsBreakpoint:       '600px', // Custom JS Breakpoint
    transitionMobile:   'fx-toggle', // Effect for 'Mobile' View
    transitionDesktop:  'fx-hover-fade' // Effect for 'Desktop' View
  })
```
## Advanced Usage



* bower?
* git?
* [Download](#TODO)
* zepto/jquery
* let's rename <script src="../dist/javascripts/app.js"></script> to pine.js?

## Usage

TODO MM

* Simplest CSS usage
* Bootstrap usage – 3 variants
* LESS usage

# Tested on the following platforms

<!-- TODO -->

# Working on the repository

PineJS comes with common tools, which help you to easily customize it and make you own builds. [GruntJS](http://gruntjs.com/) is used for the build process. If you already have it, you are ready to go. Otherwise you need node and npm on your machine. Installation of Grunt is described in [Getting Started Tutorial](http://gruntjs.com/getting-started).

## Dependencies

After you've set up the environment, use ```npm install``` to get all dependencies. To build the project, enter the following at the terminal:

```sh
grunt
```

Grunt can also be used to monitor files and re-build the project on each change. For this we use Grunt's watch task:

```sh
grunt watch
```

Next time you change the file, Grunt will perform all build tasks.


## Customization

TODO MS/MM

* JS variables (MS)
* LESS variables (MM)


## Authors


## Licence



