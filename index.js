require('./style.css')
require('../src/style.css')
import ImageBox from '../src/index'
let imgs = document.querySelectorAll('#demo img')
new ImageBox(imgs)
