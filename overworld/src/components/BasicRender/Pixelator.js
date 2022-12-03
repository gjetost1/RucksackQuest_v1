// import globalVars from "./GlobalVars"

// let pixelGrid = null

// const getPixel = (imgData, x, y) => {
//   const index = y * imgData.width + x
//   let i = index * 4
//   let d = imgData.data
//   return [d[i], d[i+1], d[i+2], d[i+3]]
// }

// const drawToComboCanvas = (canvases, comboCtx) => {
//   for (let el of canvases) {
//     const canvas = document.getElementById(el)
//     // const canvas = document.getElementById('backgroundCanvas')
//     // const dataURL = canvas.toDataURL()
//     // console.log(dataURL)
//     comboCtx.drawImage(canvas, 0, 0)
//   }
// }

// const pixelator = (comboCtx, pixelCtx, backgroundCanvas, spriteCanvas, foregroundCanvas, cursorCanvas) => {

//   if (pixelGrid === null) {
//     const iterator = globalVars.upscale / 4
//     for (let i = 0; i < globalVars.width; i += globalVars.upscale) {
//       for (let j = 0; j < globalVars.height; j += globalVars.upscale) {
//         // const pixelVals = getPixel(imgData, i, j)
//         pixelCtx.fillStyle = `rgba(255, 0, 0, 1)`
//         pixelCtx.fillRect(i, j, iterator, (iterator * 3))
//         pixelCtx.fillStyle = `rgba(0, 255, 0, 1)`
//         pixelCtx.fillRect(i + iterator, j, iterator, (iterator * 3))
//         pixelCtx.fillStyle = `rgba(0, 0, 255, 1)`
//         pixelCtx.fillRect(i + (iterator * 2), j, iterator, (iterator * 3))
//         pixelCtx.fillStyle = `rgba(0, 0, 0, 0)`
//         pixelCtx.fillRect(i + 3, j, 1, 2)
//       }
//     }
//     pixelGrid = document.getElementById('pixelCanvas')
//   }


//   pixelCtx.drawImage(pixelGrid, 0, 0)
//   // pixelCtx.clearRect(0, 0, globalVars.width, globalVars.height)

//   comboCtx.globalCompositeOperation = 'overlay'

//   drawToComboCanvas(['backgroundCanvas', 'spriteCanvas', 'foregroundCanvas', 'cursorCanvas'], comboCtx)

//   // comboCtx.globalCompositeOperation = 'source-over'



  // const imgData = comboCtx.getImageData(0, 0, globalVars.width, globalVars.height)
  // const comboCanvasGet = document.getElementById('comboCanvas')
  // console.log(comboCanvasGet.toDataURL())
  // for (let i = 0; i < globalVars.width; i += globalVars.upscale) {
  //   for (let j = 0; j < globalVars.height; j += globalVars.upscale) {
  //     const pixelVals = getPixel(imgData, i, j)
  //     pixelCtx.fillStyle = `rgba(${pixelVals[0] * 1}, 0, 0, 1)`
  //     pixelCtx.fillRect(i, j, iterator, (iterator * 2))
  //     pixelCtx.fillStyle = `rgba(0, ${pixelVals[1] * 1}, 0, 1)`
  //     pixelCtx.fillRect(i + iterator, j, iterator, (iterator * 2))
  //     pixelCtx.fillStyle = `rgba(0, 0, ${pixelVals[2] * 1}, 1)`
  //     pixelCtx.fillRect(i + (iterator * 2), j, iterator, (iterator * 2))
  //     // pixelCtx.fillStyle = `rgba(0, 0, 0, 1)`
  //     // pixelCtx.fillRect(i + 3, j, 1, 2)
  //   }
  // }

// }

// export default pixelator

// vvv old version in case above breaks vvv

import globalVars from "./GlobalVars"

const getPixel = (imgData, x, y) => {
  const index = y * imgData.width + x
  let i = index * 4
  let d = imgData.data
  return [d[i], d[i+1], d[i+2], d[i+3]]
}

const pixelator = (comboCtx, pixelCtx, backgroundCanvas, spriteCanvas, foregroundCanvas, cursorCanvas) => {
  const drawToComboCanvas = (canvases) => {
    for (let el of canvases) {
      // const canvas = document.getElementById(el)

      const renderImg = el.transferToImageBitmap()

      // const canvas = document.getElementById('backgroundCanvas')
      // const dataURL = canvas.toDataURL()
      // console.log(dataURL)
      comboCtx.drawImage(renderImg, 0, 0)
    }
  }

  drawToComboCanvas([backgroundCanvas, spriteCanvas, foregroundCanvas, cursorCanvas])
  // drawToComboCanvas(['backgroundCanvas', 'spriteCanvas', 'foregroundCanvas', 'cursorCanvas'])

  const imgData = comboCtx.getImageData(0, 0, globalVars.width, globalVars.height)
  // const comboCanvasGet = document.getElementById('comboCanvas')
  // console.log(comboCanvasGet.toDataURL())
  const iterator = globalVars.upscale / 4
  for (let i = 0; i < globalVars.width; i += globalVars.upscale) {
    for (let j = 0; j < globalVars.height; j += globalVars.upscale) {
      const pixelVals = getPixel(imgData, i, j)
      pixelCtx.fillStyle = `rgba(${pixelVals[0] * 1}, 0, 0, 1)`
      pixelCtx.fillRect(i, j, iterator, (iterator * 3))
      pixelCtx.fillStyle = `rgba(0, ${pixelVals[1] * 1}, 0, 1)`
      pixelCtx.fillRect(i + iterator, j, iterator, (iterator * 3))
      pixelCtx.fillStyle = `rgba(0, 0, ${pixelVals[2] * 1}, 1)`
      pixelCtx.fillRect(i + (iterator * 2), j, iterator, (iterator * 3))
      // pixelCtx.fillStyle = `rgba(0, 0, 0, 1)`
      // pixelCtx.fillRect(i + 3, j, 1, 2)
    }
  }

}

export default pixelator
