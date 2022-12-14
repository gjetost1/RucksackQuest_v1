import pixelPerfect from './PixelPerfect'

const upscale = 4   // multiplier for resolution - 2 means each visible pixel is 2 x 2 real pixels etc
const blockSize = 16 * upscale   // size of each grid block in pixels for collison objects and hero sprites
const offscreenBoundaryScale = 3  // determines how many blockSizes outside the visible canvas to render on each side for enemy collision purposes
const offscreenBoundarySide = blockSize * offscreenBoundaryScale  // determines how many blockSizes outside the visible canvas to render on each side for enemy collision purposes
const offscreenBoundaryTotal = offscreenBoundarySide * 2  // twice as large as offscreenBoundarySide because the canvases need to extend out on both sides
// const height = 192 * upscale   // height of canvas, should be the actual pixel res of original artwork, but that artwork should be exported as an upsized version - upscale is the factor by which it is upscaled
// const width = 336 * upscale   // width of canvas, should be the actual pixel res of original artwork
const height = window.innerHeight + offscreenBoundaryTotal   // height of canvas
const width = window.innerWidth + offscreenBoundaryTotal   // width of canvas
const perfectHeight = pixelPerfect(window.innerHeight, 'down', 'x', upscale)   // height of canvas, should be the actual pixel res of original artwork, but that artwork should be exported as an upsized version - upscale is the factor by which it is upscaled
const perfectWidth = pixelPerfect(window.innerWidth, 'down', 'x', upscale)  // width of canvas, should be the actual pixel res of original artwork
const middleX = pixelPerfect(Math.round(width / 2), 'down', 'x', upscale)
const middleY = pixelPerfect(Math.round(height / 2), 'down', 'x', upscale)
const heroStartXCoord = 1000
const heroStartYCoord = 400
const windowSpacerHeight = (((window.innerHeight || document.documentElement.clientHeight||
  document.body.clientHeight) - height) / 2) + offscreenBoundarySide
const windowSpacerWidth = (((window.innerWidth || document.documentElement.clientWidth ||
  document.body.clientWidth) - width) / 2) + offscreenBoundarySide
// const heroCenterX = middleX - (blockSize / 2)
// const heroCenterY = middleY - (blockSize / 2)
const heroCenterX = pixelPerfect(Math.round(middleX - (blockSize / 2)), 'down', 'x', upscale)
const heroCenterY = pixelPerfect(Math.round(middleY - (blockSize / 2)), 'down', 'y', upscale)
export default {heroStartXCoord, heroStartYCoord, upscale, height, width, perfectHeight, perfectWidth, middleX, middleY, blockSize, windowSpacerHeight, windowSpacerWidth, heroCenterX, heroCenterY, offscreenBoundarySide, offscreenBoundaryTotal}
