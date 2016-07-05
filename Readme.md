# Imagebox

View gallary of images on desktop. (without jquery)

Tested on Chrome Firefox, Safari.

[demo](https://chemzqm.github.io/imagebox/)

W.I.P. **use with caution**


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
