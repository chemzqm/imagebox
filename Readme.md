# Imagebox

View gallary of images on desktop.

TODO:

* error check
* resizeable by wheel and drag
* add tip and tip option
* transition back to original image
* add close to top right corner
* limit container size for large image
* more keybindings including (up down left right)
* horizon scrollable for long images

W.I.P. **use with caution**

[demo](https://chemzqm.github.io/imagebox/)

Tested on Chrome Firefox, Safari.

## Usage

_Copy `src/images` and `src/style.css` to your project folder and include the css file on your page_ 

``` js
var ImageBox = require('imagebox')
var imgs = document.querySelectorAll('#demo img')
new ImageBox(imgs)
```





















