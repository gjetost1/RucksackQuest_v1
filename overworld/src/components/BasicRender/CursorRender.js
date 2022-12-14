import pixelPerfect from './PixelPerfect'
import globalVars from "./GlobalVars"


const cursorRender = (cursorCtx, cursor, cursorX, cursorY) => {
  cursorCtx.drawImage(cursor,
    pixelPerfect(cursorX + globalVars.offscreenBoundarySide, 'down', 'x', globalVars.upscale),
    pixelPerfect(cursorY + globalVars.offscreenBoundarySide, 'down', 'y', globalVars.upscale))
  // cursorCtx.drawImage(cursor, cursorX, cursorY)
}

export default cursorRender
