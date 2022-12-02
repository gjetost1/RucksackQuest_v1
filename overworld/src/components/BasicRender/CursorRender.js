import pixelPerfect from './PixelPerfect'
import globalVars from "./GlobalVars"


const cursorRender = (mainCanvasCtx, cursor, cursorX, cursorY) => {
  mainCanvasCtx.drawImage(cursor,
    pixelPerfect(cursorX, 'down', 'x', globalVars.upscale),
    pixelPerfect(cursorY, 'down', 'y', globalVars.upscale))
  // cursorCtx.drawImage(cursor, cursorX, cursorY)
}

export default cursorRender
