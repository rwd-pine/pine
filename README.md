# PineJS

### Tiny but powerfull responsive multilevel navigation component.

## Features

* Compatible with Bootstrap 3, but may be implemented independently
* Ready for both vertical and horizontal navigations
* Customizable with effects and skins
* Accessible Mobile First architecture
* jQuery/Zepto versions
* Using the power of LESS variables
* Internet Explorer 8+ compatible
* … all in 7kB JS and 10kB CSS file

# Usage 

Pine.JS installation is quite easy, just follow steps below and you will be able to get the plugin up and running.

1. Link CSS from your HTML `<head>`:
```html
<link rel="stylesheet" href="stylesheets/pine.css">
```

2. Markup your small screen header with button for navigation toggling:

```html
<a class="nav-trigger" data-pine="toggle" href="#nav">
  <span class="trigger-title">Menu</span>
  <span class="icon-bar"></span>
</a>
```

… or use your way to toggle navigation – just use `data-pine="toggle"` attribute.

3. Write navigation markup. It is simple unordered list in container.

```html
<div id="nav" role="navigation" class="pine pine-horizontal">
  <ul>
    <li>…</li>
  </ul>
</div>
```

Alternatively, you can use a class .pine-horizontal for [horizontally](#TODOexample) aligned navigation.

4. Add jQuery (or Zepto) and Pine.JS just before `</body>` tag:

```html
  <script src="pine/javascripts/jquery.js"></script>
  <script src="pine/javascripts/pine.js"></script>    
```

3. Hook up the plugin:
```html
  <script>
    $('.pine').pine()
  </script>
```

4. Customizable options:


## Customization

### Horizontal/vertical

Just use `.pine-horizontal` or `.pine-vertical` on the `.pine` element in your markup.


### Javascript

```javascript
  $('.pine').pine({ 
    largeDisplayStart:  	'600px', 			// Custom JS breakpoint
    fxSmallDisplay:   	'fx-right-to-left',  // Effect for small display navigation, alternatively 'fx-collapse'
  })
```

### LESS

You can style basic navigation look with a rich variety of [LESS variables](https://github.com/rwd-pine/pine/blob/master/src/stylesheets/core/variables.less).



## IE8 support

Pine.JS code is Mobile First and therefore a large part of the code is unavailable for Explorer 8 and older. You can choose from two solutions: 

1) [Respond.js](https://github.com/scottjehl/Respond) - (preferred solution)javascript that can arrange for support Media Queries in these older browsers. It is a standard way which uses Bootstrap itself. Just add Respond.js in the HTML `<head>` just after CSS files: 


```html
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->
```

2) `pine-ie8.css` - if Respond.js does not fit your needs, add this CSS file in your HTML `<head>`. It contains all of the code hidden in the Media Queries:

```html
<link href="css/pine-ie8.css" rel="stylesheet">
```

## Examples

<!-- TODO MM -->

Simple CSS implementation:

* [Vertical multi-level navigation](#/vertical/)
* [Horizontal multi-level navigation](#/horizontal/)

LESS implementation:

* [Bootstrap vertical multi-level navigation](#/bootstrap-vertical/)
* [Bootstrap horizontal multi-level navigation](#/bootstrap-horizontal/)
* [Bootstrap fixed horizontal multi-level navigation, inverted color scheme](#/bootstrap-fixed/)

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


## Authors

Martin Staněk ([@koucik](https://twitter.com/koucik)) & Martin Michálek ([@machal](https://twitter.com/machal))


## Licence



