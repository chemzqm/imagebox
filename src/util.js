let doc = document.documentElement

export function viewHeight() {
  return Math.max(doc.clientHeight, window.innerHeight || 0)
}

export function viewWidth() {
  return Math.max(doc.clientWidth, window.innerWidth || 0)
}
