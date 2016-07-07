# Imagebox

View gallary of images on desktop. (without jquery)

Tested on IE8 Chrome Firefox and Safari.

[demo](https://chemzqm.github.io/imagebox/)

W.I.P. **use with caution**

If you need to support IE8, you will need to include `es5shim` and `Promise polyfill`, like:

``` html
<!--[if lt IE 9]>
<script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.9/es5-shim.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/native-promise-only/0.8.1/npo.js"></script>
<![endif]-->
```

## Features

* Click to navigate though images.
* Support responsive image with url filter.
* High performance animation for image popup and restore.
* Friendly to SPA with unbind support.
* Canvas loading spin and error check (auto retry).
* Keyboard support (ESC, left, right, up, down).
* Wheel event support for zoom in/out and navigate.
* Draggable & scalable with mouse.
* Support images with higher dimension than viewport.
* No jQuery dependency, easy to use API.

TODO:

* support safari gesture events


## Usage

_Copy `src/images` and `src/style.css` to your project folder and include the css file on your page_ 

``` js
var ImageBox = require('imagebox')
var imgs = document.querySelectorAll('#demo img')
new ImageBox(imgs)
```
