import events from 'events'
import event from 'event'
import classes from 'classes'
import domify from 'domify'
import Tween from 'tween'
import raf from 'raf'
import query from 'query'
import assign from 'object-assign'
import spin from './spin'
import wheel from 'mouse-wheel'
import throttle from 'throttleit'
import _ from 'dom'

let overlay = domify(`
<div class="imagebox-overlay">
</div>
`)
overlay.style.display = 'none'

let tmpl = `
<div class="imagebox-container">
  <div class="imagebox-prev"></div>
  <div class="imagebox-next"></div>
  <div class="imagebox-info"></div>
  <div class="imagebox-close"></div>
</div>
`

class ImageBox {
  constructor(imgs) {
    this.imgs = [].slice.call(imgs)
    this.album = []
    for (let i = 0, l = imgs.length; i < l; i++) {
      let img = imgs[i]
      img.style.cursor = 'zoom-in'
      this.album.push({
        // replace qiniu suffix
        url: img.src.replace(/-\w+$/, ''),
        complete: false
      })
    }
    this._onclick = this.onclick.bind(this)
    this._overlayClick = this.overlayClick.bind(this)
    this._onkeyup = this.onkeyup.bind(this)
    event.bind(document, 'click', this._onclick)
    event.bind(document, 'keyup', this._onkeyup)
    event.bind(overlay, 'click', this._overlayClick)
    this.events = events(overlay, this)
    this.events.bind('click .image', 'containerClick')
    this.events.bind('click .imagebox-close', 'cancel')
  }
  onkeyup(e) {
    let code = e.which || e.keyCode || e.charCode
    if (code != 27 && (code < 37 || code > 40)) return
    e.preventDefault()
    if (code == 27) return this.cancel()
    if (code == 37) return this.prev()
    if (code == 39) return this.next()
    // 38 UP 40 DOWN
  }
  onclick(e) {
    if (e.target.tagName.toLowerCase() == 'img') {
      let i = this.imgs.indexOf(e.target) 
      if (i !== -1) {
        this.initContainer(e.target)
      }
    }
  }
  containerClick(e) {
    let vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    if (e.pageX > vw/2) {
      this.next()
    } else {
      this.prev()
    }
  }
  initContainer(img) {
    document.body.appendChild(overlay)
    this.container = domify(tmpl)
    let onwheel = throttle(this.onwheel.bind(this), 1000)
    this._wheelHandler = wheel(this.container, onwheel, true)
    overlay.appendChild(this.container)
    overlay.style.display = 'block'
    setTimeout(function () {
      classes(overlay).add('active')
    }, 30)
    let i = this.imgs.indexOf(img)
    let obj = this.album[i]
    let rect = img.getBoundingClientRect()
    let w = rect.width || img.clientWidth
    let h = rect.height || img.clientHeight
    assign(this.container.style, {
      width: w + 'px',
      height: h + 'px',
      display: 'block',
      top: rect.top + 'px',
      left: rect.left + 'px'
    })
    if (obj.complete) return this.showImg(img)
    this.positionContainer({w: w, h: h}).then(function () {
      this.showImg(img)
    }.bind(this))
  }
  positionContainer({w, h}, duration = 200) {
    let dest = getDestination({w: w, h: h})
    let el = this.container
    if (!el) return
    let rect = el.getBoundingClientRect()
    let self = this
    this.animating = true
    let tween = Tween({
      width: el.clientWidth,
      height: el.clientHeight,
      left: rect.left,
      top: rect.top
    })
      .ease('linear')
      .to(dest)
      .duration(duration)

    tween.update(function(o){
      assign(el.style, {
        width: o.width + 'px',
        height: o.height + 'px',
        top: o.top + 'px',
        left: o.left + 'px'
      })
    })

    var promise = new Promise(function (resolve) {
      tween.on('end', function(){
        self.animating = false
        animate = function(){} //eslint-disable-line
        resolve()
      })
    })

    function animate() {
      raf(animate)
      tween.update()
    }
    animate()
    return promise
  }
  onwheel(dx, dy) {
    if (Math.abs(dy) > Math.abs(dx)) return
    if (dx < 0) return this.prev()
    this.next()
  }
  prev() {
    if (this.animating || !classes(overlay).has('active')) return
    var img = this.imgs[this.current - 1]
    if (img) this.showImg(img)
  }
  next() {
    if (this.animating || !classes(overlay).has('active')) return
    var img = this.imgs[this.current + 1]
    if (img) this.showImg(img)
  }
  cancel() {
    if (!classes(overlay).has('active')) return
    classes(overlay).remove('active')
    let el = this.container
    if (el.removeEventListener) {
      el.removeEventListener('wheel', this._wheelHandler)
    }
    this.container = null
    setTimeout(function () {
      _(overlay).remove()
      _(el).remove()
    }, 200)
  }
  overlayClick(e) {
    if (e.target !== overlay) return
    this.cancel()
  }
  showImg(img) {
    let i = this.imgs.indexOf(img)
    this.current = i
    let container = this.container
    let el = query('.image', container)
    if (el) _(el).remove()
    let prev = query('.imagebox-prev', container)
    let next = query('.imagebox-next', container)
    let info = query('.imagebox-info', container)
    info.textContent = (i + 1) + '/' + this.imgs.length
    prev.style.display = i == 0 ? 'none' : 'block'
    next.style.display = i == this.imgs.length - 1? 'none' : 'block'
    container.appendChild(domify(`
      <div class="image">
        <img src="${this.album[i].url}" width="100%" height="100%"/>
      </div>
    `))
    container.style.display = 'block'
    let obj = this.album[i]
    if (obj.complete) {
      return this.positionContainer({w: obj.width, h: obj.height})
    }
    container.style.backgroundImage = 'url(' + img.src + ')'
    return this.positionImage(query('img', container), i)
  }
  positionImage(image, i) {
    let self = this
    return this.getImgDimension(image).then(function (dims) {
      let w = dims.width
      let h = dims.height
      assign(self.album[i], {
        complete: true,
        width: w,
        height: h
      })
      // changed to other img
      if (self.current !== i) return Promise.resolve(null)
      return self.positionContainer({w: w, h: h})
    }, function () {
      return self.positionContainer({w: 300, h: 300})
    })
  }
  getImgDimension(image) {
    if (image.complete) {
      return Promise.resolve(imgDimension(image))
    }
    let mask = domify(
      `<div class="imagebox-mask">
        <div class="spin"></div>
      </div>`)
    query('.image', this.container).appendChild(mask)
    let stop = spin(query('.spin', mask), {
      color: '#ffffff',
      duration: 1000,
      width: 4
    })
    return new Promise(function (resolve, reject) {
      image.onload = function () {
        stop()
        _(mask).remove()
        resolve(imgDimension(image))
      }
      image.onerror = function (e) {
        stop()
        _(mask).remove()
        reject(e)
      }
    })
  }
  unbind() {
    event.unbind(document.body, 'click', this._onclick)
    event.unbind(document, 'keyup', this._onkeyup)
    event.unbind(overlay, 'click', this._overlayClick)
    this.events.unbind()
  }
}

function getDestination(dims) {
  let vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  let vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  return {
    width: dims.w,
    height: dims.h,
    left: (vw - dims.w)/2,
    top: (vh - dims.h)/2
  }
}

function imgDimension(image) {
  if (image.naturalWidth) {
    return {
      height: image.naturalHeight,
      width: image.naturalWidth
    }
  } else {
    let i = new Image()
    i.src = image.src;
    return {
      height: i.height,
      width: i.width
    }
  }
}

export default ImageBox
