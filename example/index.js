import ImageBox from '../src/index'
require('./style.css')
require('../src/style.css')

let imgs = document.querySelectorAll('#demo img')
let box = new ImageBox(imgs, {
  convertor: function (src) {
    return src.replace(/-\w+$/, '')
  }
})
box.on('show', function () {
  console.log('show')
})
box.on('hide', function () {
  console.log('hide')
})
