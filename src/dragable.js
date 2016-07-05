import events from 'events'
import assign from 'object-assign'
import closest from 'closest'

class Dragable {
  constructor(el) {
    this.el = el
    this.events = events(el, this)
    this.events.bind('mousedown')
    this.events.bind('mousemove')
    this.events.bind('mouseup')
    this.docEvents = events(document, this)
    this.docEvents.bind('mouseup')
  }
  onmousedown(e) {
    let image = closest(e.target, '.image', this.el)
    if (!image) return
    let style = this.el.style
    this.down = {
      x: e.pageX,
      y: e.pageY,
      top: parseInt(style.top) || 0,
      left: parseInt(style.left) || 0
    }
  }
  onmousemove(e) {
    if (!this.down) return
    e.preventDefault()
    let style = this.el.style
    let top = this.down.top + e.pageY - this.down.y
    let left = this.down.left + e.pageX - this.down.x
    assign(style, {
      top: top + 'px',
      left: left + 'px'
    })
  }
  onmouseup(e) {
    if (!this.down) return
    let dx = e.pageX - this.down.x
    let dy = e.pageY - this.down.y
    let delta = Math.sqrt(dx*dx + dy*dy)
    this.down = null
    if (delta > 5) {
      e.stopImmediatePropagation()
      e.stopPropagation()
    }
  }
  unbind() {
    this.events.unbind()
    this.docEvents.unbind()
  }
}

export default Dragable
