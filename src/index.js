import events from 'events'
import event from 'event'
import classes from 'classes'
import domify from 'domify'
import Tween from 'tween'
import raf from 'raf'
import query from 'query'
import assign from 'object-assign'
import wheel from 'mouse-wheel-event'
import throttle from 'throttleit'
import _ from 'dom'
import * as util from './util'
import spin from './spin'
import Draggable from './dragable'
import Resizable from './resizable'

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
  <div class="resize-handle-n"></div>
  <div class="resize-handle-s"></div>
  <div class="resize-handle-e"></div>
  <div class="resize-handle-w"></div>
</div>
`

class ImageBox {
  constructor(imgs) {
    this.imgs = util.toArray(imgs)
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
    this.events.bind('click .imagebox-prev', 'prev')
    this.events.bind('click .imagebox-next', 'next')
    this.events.bind('mouseup .imagebox-container', 'containerClick')
    this.events.bind('click .imagebox-close', 'cancel')
  }
  /**
   * Keyup event handler
   *
   * @private
   * @param  {Event}  e
   */
  onkeyup(e) {
    if (!classes(overlay).has('active')) return
    let code = e.which || e.keyCode || e.charCode
    if (code != 27 && (code < 37 || code > 40)) return
    e.preventDefault()
    e.stopPropagation()
    if (code == 27) return this.cancel()
    if (code == 37) return this.prev()
    if (code == 39) return this.next()
    if (code == 38) return this.scale(1)
    if (code == 40) return this.scale(-1)
  }
  /**
   * Image click handler
   *
   * @private
   * @param  {Event}  e
   */
  onclick(e) {
    if (e.target.tagName.toLowerCase() == 'img') {
      let i = this.imgs.indexOf(e.target) 
      if (i !== -1) this.initContainer(e.target)
    }
  }
  /**
   * Wheel event handler of container
   *
   * @private
   * @param {number} dx
   * @param {number} dy
   */
  onwheel(dx, dy) {
    if (this.animating) return
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        this.prev()
      } else {
        this.next()
      }
    } else {
      if (dy < 0) {
        this.scale(-1)
      } else {
        this.scale(1)
      }
    }
  }
  /**
   * Overlay click event handler
   *
   * @private
   * @param  {Event}  e
   */
  overlayClick(e) {
    if (e.target !== overlay) return
    this.cancel()
  }
  /**
   * Container click event handler
   *
   * @private
   * @param  {Event}  e
   */
  containerClick(e) {
    if (!e.target.tagName.toLowerCase() == 'img') return
    let width = this.container.clientWidth
    let left = parseInt(this.container.style.left) || 0
    if ((e.pageX || e.clientX) - left > width/2) {
      this.next()
    } else {
      this.prev()
    }
  }
  /**
   * Prepare container with img as shown image
   *
   * @private
   * @param {Element} img image element to show
   */
  initContainer(img) {
    document.body.appendChild(overlay)
    this.container = domify(tmpl)
    this.dragable = new Draggable(this.container)
    this.resizable = new Resizable(this.container)
    overlay.appendChild(this.container)
    let onwheel = throttle(this.onwheel.bind(this), 1000)
    this._wheelUnbind = wheel(this.container, onwheel, true)
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
  positionContainer({w, h, top, left}, duration = 200) {
    let dest = getDestination({w: w, h: h})
    if (top != null) dest.top = top
    if (left != null) dest.left = left
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
  /**
   * show next image
   *
   * @public
   */
  prev() {
    if (this.animating || !classes(overlay).has('active')) return
    var img = this.imgs[this.current - 1]
    if (img) this.showImg(img)
  }
  /**
   * show previous image
   *
   * @public
   */
  next() {
    if (this.animating || !classes(overlay).has('active')) return
    var img = this.imgs[this.current + 1]
    if (img) this.showImg(img)
  }
  /**
   * Cancel active state
   *
   * @public
   */
  cancel() {
    if (!classes(overlay).has('active')) return
    classes(overlay).remove('active')
    let el = this.container
    this._wheelUnbind()
    this.restore()
    if (this.dragable) this.dragable.unbind()
    if (this.resizable) this.resizable.unbind()
    this.dragable = null
    this.resizable = null
    this.container = null
    setTimeout(function () {
      _(overlay).remove()
      _(el).remove()
    }, 250)
  }
  /**
   * Display a image
   *
   * @public
   * @param {Eleemnt} img
   * @returns {Promise} promise of animation
   */
  showImg(img) {
    let i = this.imgs.indexOf(img)
    this.current = i
    let container = this.container
    let el = query('.imagebox-img', container)
    if (el) el.parentNode.removeChild(el)
    let prev = query('.imagebox-prev', container)
    let next = query('.imagebox-next', container)
    let info = query('.imagebox-info', container)
    info.textContent = (i + 1) + '/' + this.imgs.length
    prev.style.display = i == 0 ? 'none' : 'block'
    next.style.display = i == this.imgs.length - 1? 'none' : 'block'
    let image = document.createElement('img')
    image.className = 'imagebox-img'
    let obj = this.album[i]
    image.height = '100%'
    image.width = '100%'
    image.src = obj.url
    container.appendChild(image)
    container.style.display = 'block'
    container.style.backgroundImage = 'url(' + img.src + ')'
    if (obj.complete) {
      let o = limitToViewport({width: obj.width, height: obj.height})
      return this.positionContainer(o)
    }
    return this.positionImage(image, i)
  }
  // resize image container to iamge nature size
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
      let o = limitToViewport({width: w, height: h})
      return self.positionContainer(o)
    }, function () {
      return self.positionContainer({w: 300, h: 300})
    })
  }
  /**
   * Get nature size of image
   *
   * @public
   * @param {Element} image
   * @returns {Promise}
   */
  getImgDimension(image) {
    if (image.complete) {
      return Promise.resolve(imgDimension(image))
    }
    let mask = domify(
      `<div class="imagebox-mask">
        <div class="spin"></div>
      </div>`)
    this.container.appendChild(mask)

    let stop = document.addEventListener ? spin(query('.spin', mask), {
      color: '#ffffff',
      duration: 1000,
      width: 4
    }) : function() {}

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
  restore() {
    let img = this.imgs[this.current]
    if (!img) return
    let rect = img.getBoundingClientRect()
    //if (rect.bottom < 0 || rect.top > util.viewHeight()) return
    let dest = {
      w: img.clientWidth,
      h: img.clientHeight,
      top: rect.top,
      left: rect.left
    }
    this.positionContainer(dest)
  }
  scale(dir) {
    let el = this.container
    if (this.animating || !el) return
    let rect = el.getBoundingClientRect()
    let w = rect.width || el.clientWidth
    let h = rect.height || el.clientHeight
    let ratio = dir > 0 ? 1.25 : 0.8
    let dest = {
      w: w*ratio,
      h: h*ratio,
      left: rect.left - (w*ratio - w)/2,
      top: rect.top - (h*ratio - h)/2
    }
    this.positionContainer(dest, 100)
  }
  /**
   * unbind all event listeners
   *
   * @public
   */
  unbind() {
    if (this.dragable) this.dragable.unbind()
    if (this.resizable) this.resizable.unbind()
    event.unbind(document.body, 'click', this._onclick)
    event.unbind(document, 'keyup', this._onkeyup)
    event.unbind(overlay, 'click', this._overlayClick)
    let el = this.container
    if (el && el.removeEventListener) el.removeEventListener('wheel', this._wheelHandler)
    this.events.unbind()
  }
}

function getDestination(dims) {
  return {
    width: dims.w,
    height: dims.h,
    left: (util.viewWidth() - dims.w)/2,
    top: (util.viewHeight() - dims.h)/2
  }
}

function limitToViewport({width, height}) {
  let sx = width/util.viewWidth()
  let sy = height/util.viewHeight()
  if (sx > 1 && sx >= sy) return {w: width/sx - 60, h: height*(width/sx - 60)/width}
  if (sy > 1 && sy >= sx) return {h: height/sy - 60, w: width*(height/sy - 60)/height}
  return {w: width, h:height}
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
