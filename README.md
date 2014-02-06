# PineJS

### Tiny but powerfull responsive multilevel navigation component.

## Features

* Compatible with Bootstrap 3, but may be implemented independently
* Ready for both vertical and horizontal navigations
* Customizable with effects and skins
* Accessible, Mobile First architecture
* jQuery/Zepto versions
* Using the power of LESS variables
* Internet Explorer 8+ compatible
* … all in 7kB JS and 10kB CSS file

# Usage

PineJS installation is quite easy, just follow steps below.

**1) Link CSS** from your HTML `<head>`:

```html
<link rel="stylesheet" href="stylesheets/pine.css">
```

**2) Markup small screen header** with button for navigation toggling:

```html
<a class="nav-trigger" data-pine="toggle" href="#nav">
  <span class="trigger-title">Menu</span>
  <span class="icon-bar"></span>
</a>
```

… or use your way to toggle navigation – just use `data-pine="toggle"` attribute.

**3) Write navigation markup.** It is simple unordered list in `.pine` container.

```html
<div id="nav" role="navigation" class="pine pine-horizontal">
  <ul>
    <li>…</li>
  </ul>
</div>
```

**4) Add jQuery (or Zepto) and PineJS**  just before `</body>` tag:

```html
<script src="pine/javascripts/jquery.js"></script>
<script src="pine/javascripts/pine.js"></script>
```

**5) Hook up the plugin** in your Javascript file:

```javascript
$('.pine').pine()
```

Want to see everything at once? Look at the minimum possible implementation [example](http://rwd-pine.github.io/pine/examples/simple/) ([source](https://github.com/rwd-pine/pine/blob/master/docs/examples/simple/index.html)).


## Customization

### Horizontal/vertical

Just use `.pine-horizontal` or `.pine-vertical` on the `.pine` element in your markup.


### Javascript

```javascript
$('.pine').pine({
  largeDisplayStart:   '600px', // Custom JS breakpoint
  fxSmallDisplay:   'fx-right-to-left',  // Small display behavior, alt. 'fx-collapse'
})
```

### LESS

Optionally you can style basic navigation look with a rich variety of namespaced [LESS](http://lesscss.org/) variables including these:

```less
@p-base-font-size        : 16px;
…
@p-small-screen-color    : #fff;
…
@p-large-display-start   : 600px;

```

[All LESS variables](https://github.com/rwd-pine/pine/blob/master/src/stylesheets/core/variables.less).

If you prefer pure CSS, just overwrite Pine styling.

## IE8 support

PineJS code is [Mobile First](http://bradfrostweb.com/blog/web/mobile-first-responsive-web-design/) and therefore a large part of the code is unavailable for Explorer 8 and older. You can choose from two solutions:

**1) [Respond.js](https://github.com/scottjehl/Respond)** - (preferred solution)javascript that can arrange for support Media Queries in these older browsers. It is a standard way which uses Bootstrap itself. Just add Respond.js in the HTML `<head>` just after CSS files:


```html
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->
```

**2) `pine-ie8.css`** - if Respond.js doesn't fit your needs, add this CSS file in your HTML `<head>`. It contains all of the code hidden in the Media Queries:

```html
<link href="css/pine-ie8.css" rel="stylesheet">
```

## Examples

Simple CSS implementation:

* [Simple responsive navigation](http://rwd-pine.github.io/pine/examples/simple/)
* [Vertical multi-level navigation](http://rwd-pine.github.io/pine/examples/vertical/)
* [Horizontal multi-level navigation](http://rwd-pine.github.io/pine/examples/horizontal/)

LESS implementation:

* [Bootstrap vertical multi-level navigation](http://rwd-pine.github.io/pine/examples/bootstrap-vertical/)
* [Bootstrap horizontal multi-level navigation](http://rwd-pine.github.io/pine/examples/bootstrap-horizontal/)
* [Bootstrap fixed horizontal multi-level navigation, inverted color scheme](http://rwd-pine.github.io/pine/examples/bootstrap-fixed/)

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

Made in Prague by Martin Staněk ([@koucik](https://twitter.com/koucik)) & Martin Michálek ([@machal](https://twitter.com/machal)).

## Licence

Copyright 2011-2014 Martin Staněk & Martin Michálek. Released under the [MIT license](https://github.com/rwd-pine/pine/blob/master/LICENCE).

