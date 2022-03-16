const easeInOut = x => (x < 0.5 ? 2 * x * x : -1 + (4 - 2 * x) * x)

const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame

export const animateScroll = (containerEl, to) => {
  const fromPosX = containerEl.scrollLeft || 0
  const fromPosY = containerEl.scrollY || 0
  const toPosX = to.x ?? fromPosX
  const toPosY = to.y ?? fromPosY
  const deltaPosX = toPosX - fromPosX
  const deltaPosY = toPosY - fromPosY
  const duration = parseInt(Math.sqrt(Math.max(Math.abs(deltaPosX), Math.abs(deltaPosY))))
  const ret = {
    requestID: null,
  }
  let step = 0
  let percent = 0

  const easedAnimate = () => {
    step++
    percent = easeInOut(step / duration)
    if (step < duration) {
      containerEl.scrollTo(fromPosX + deltaPosX * percent, fromPosY + deltaPosY * percent)
      window.SA_rafScrollId = ret.requestID = requestAnimationFrame(easedAnimate)
    } else {
      containerEl.scrollTo(toPosX, toPosY)
    }
  }
  if (window.SA_rafScrollId) {
    cancelAnimationFrame(window.SA_rafScrollId)
  }
  window.SA_rafScrollId = ret.requestID = requestAnimationFrame(easedAnimate)
  return ret
}

export const scrollIntoView = element => {
  const toPos = element.offsetTop
  return animateScroll(window, { y: toPos })
}
