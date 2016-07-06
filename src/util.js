let doc = document.documentElement

export function viewHeight() {
  return Math.max(doc.clientHeight, window.innerHeight || 0)
}

export function viewWidth() {
  return Math.max(doc.clientWidth, window.innerWidth || 0)
}

export function toArray(els) {
  let arr = []
  for (var i = 0, l = els.length; i < l; i++) {
    arr.push(els[i])
  }
  return arr
}
