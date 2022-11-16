import pixelPerfect from './PixelPerfect'
import globalVars from "./GlobalVars"


const cursorRender = (cursorCtx, cursor, cursorX, cursorY) => {
  cursorCtx.drawImage(cursor,
    pixelPerfect(cursorX, 'down', 'x', globalVars.upscale),
    pixelPerfect(cursorY, 'down', 'y', globalVars.upscale))
  // cursorCtx.drawImage(cursor, cursorX, cursorY)
}

export default cursorRender
