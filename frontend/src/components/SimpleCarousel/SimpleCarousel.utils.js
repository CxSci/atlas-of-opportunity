export const getOuterWidth = element => {
  const style = window.getComputedStyle(element)
  return (
    parseFloat(style.marginLeft) +
    parseFloat(style.marginRight) +
    parseFloat(style.borderLeftWidth) +
    parseFloat(style.borderRightWidth) +
    element.clientWidth
  )
}
