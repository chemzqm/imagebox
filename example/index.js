import ImageBox from '../src/index'
require('./style.css')
require('../src/style.css')

let imgs = document.querySelectorAll('#demo img')
new ImageBox(imgs, {
  convertor: function (src) {
    return src.replace(/-\w+$/, '')
  }
})
