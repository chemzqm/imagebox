import events from 'events'
import assign from 'object-assign'

class Resizable {
  constructor(el) {
    this.el = el
    this.events = events(el, this)
    this.events.bind('mousedown')
    this.events.bind('mouseup')
    this.docEvents = events(document, this)
    this.docEvents.bind('mouseup')
    this.docEvents.bind('mousemove')
  }
  onmousedown(e) {
    let m = e.target.className.match(/resize-handle-(\w)/)
    if (!m) return
    let style = this.el.style
    let w = this.el.clientWidth
    let h = this.el.clientHeight
    this.down = {
      pos: m[1],
      x: e.pageX,
      y: e.pageY,
      ratio: h/w,
      width: w,
      height: h,
      top: parseInt(style.top) || 0,
      left: parseInt(style.left) || 0
    }
  }
  onmousemove(e) {
    if (!this.down) return
    e.preventDefault()
    e.stopImmediatePropagation()
    let style = this.el.style
    let {pos, x, y, width, height, ratio, top, left} = this.down
    let vertical = /^(n|s)$/.test(pos)
    let dis = vertical ? e.pageY - y : e.pageX - x
    if (vertical) {
      if (pos === 'n') dis = -dis
      let dw = dis/ratio
      assign(style, {
        height: height + 2*dis + 'px',
        top: top - dis + 'px',
        left: left - dw + 'px',
        width: width + 2*dw + 'px'
      })
    } else {
      if (pos === 'w') dis = -dis
      let dh = ratio*dis
      assign(style, {
        width: width + 2*dis + 'px',
        left: left - dis + 'px',
        top: top - dh + 'px',
        height: height + 2*dh + 'px'
      })
    }
  }
  onmouseup(e) {
    if (!this.down) return
    e.stopImmediatePropagation()
    e.stopPropagation()
    this.down = null
  }
  unbind() {
    this.events.unbind()
    this.docEvents.unbind()
  }
}

export default Resizable
