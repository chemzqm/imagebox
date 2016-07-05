# Imagebox

View gallary of images on desktop. (without jquery)

Tested on Chrome Firefox, Safari.

[demo](https://chemzqm.github.io/imagebox/)

W.I.P. **use with caution**


## Features

* Click to navigate though images.
* Support responsive image with url filter.
* High performance animation for popup and restore.
* Friendly to SPA with unbind support.
* Canvas loading spin and error check (auto retry).
* Keyboard support (esc, left, right).
* Wheel event support for zoom in/out and navigate.
* Draggable with mouse.
* Support images with higher dimension than viewport.
* No jQuery dependency, easy to use API.

TODO:

* more keybindings including (up down left right) [done]
* transition back to original image
* resizeable by wheel and drag
* add tip and tip option


## Usage

_Copy `src/images` and `src/style.css` to your project folder and include the css file on your page_ 

``` js
var ImageBox = require('imagebox')
var imgs = document.querySelectorAll('#demo img')
new ImageBox(imgs)
```
