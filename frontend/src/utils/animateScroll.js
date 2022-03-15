const easeInOut = x => (x < 0.5 ? 2 * x * x : -1 + (4 - 2 * x) * x)

const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame

export const animateScroll = (fromPos, toPos, containerEl, axis = 'Y') => {
  const deltaPos = toPos - fromPos
  const duration = parseInt(Math.sqrt(Math.abs(deltaPos)))

  const ret = {
    requestID: null,
  }
  let step = 0
  let percent = 0

  const easedAnimate = () => {
    step++
    percent = easeInOut(step / duration)
    if (axis.toLocaleLowerCase() === 'x') {
      containerEl.scrollTo(fromPos + deltaPos * percent, 0)
    } else {
      containerEl.scrollTo(0, fromPos + deltaPos * percent)
    }
    if (step < duration) {
      ret.requestID = requestAnimationFrame(easedAnimate)
    }
  }

  ret.requestID = requestAnimationFrame(easedAnimate)
  return ret
}

export const scrollIntoView = element => {
  const fromPos = window.scrollY
  const toPos = element.offsetTop
  return animateScroll(fromPos, toPos, window, 'Y')
}
