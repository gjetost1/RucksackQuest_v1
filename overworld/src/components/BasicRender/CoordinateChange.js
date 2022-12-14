import globalVars from "./GlobalVars";
import pixelPerfect from "./PixelPerfect"
const coordinateChange = (baseHero, changeArr) => {
  // console.log(baseHero.frameXChange, baseHero.frameYChange)
  for (let el of changeArr) {
    el.data.x = pixelPerfect(
      el.data.x + baseHero.frameXChange,
      'down',
      'x',
      globalVars.upscale
      )
    el.data.y = pixelPerfect(
      el.data.y + baseHero.frameYChange,
      'down',
      'y',
      globalVars.upscale
      )
    el.position.x = el.data.x
    el.position.y = el.data.y
  }
  return changeArr
}

export default coordinateChange
