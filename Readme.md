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

* Click or horizon scroll to navigate though images.
* Drag on the edge or vertical scroll or Safari(as least 9.1 on Mac) gesture to zoom in and out.
* Show original image of original size with convertor function.
* High performance animation.
* Friendly to SPA with unbind and events support.
* Keyboard support including ESC, left, right, up and down.
* Draggable & scalable with mouse.
* Support images with higher dimension than viewport.
* Written in ES6, but still works on IE8.
* No jQuery dependency, easy to use API.

## Usage

_Copy `src/images` and `src/style.css` to your project folder and include the css file on your page_ 

``` js
var ImageBox = require('imagebox')
var imgs = document.querySelectorAll('#demo img')
var box = new ImageBox(imgs)
box.on('show', function() {
})
box.on('hide', function() {
})
```

## License

Copyright 2016 chemzqm@gmail.com

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
