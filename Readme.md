# Imagebox

View gallary of images on desktop.

[demo](https://chemzqm.github.io/imagebox/)

Tested on Chrome Firefox, Safari.

## Usage

_Copy `src/images` and `src/style.css` to your project folder and include the css file on your page_ 

``` js
var ImageBox = require('imagebox')
var imgs = document.querySelectorAll('#demo img')
new ImageBox(imgs)
```
