import globalVars from "./GlobalVars"

// getPixel takes imgData and x/y coordinates of pixel we want to check and
// returns an array with r,g,b,a values, which we can use to create collision boxes
// we have to multiply the index by 4 because each chunk of 4 values in the array
// represents r, g, b, a values
const getPixel = (imgData, x, y) => {
  const index = y * imgData.width + x
  let i = index * 4
  let d = imgData.data
  return [d[i], d[i+1], d[i+2], d[i+3]]
}


// checkCollision checks if a coordinate in the colBox is over a pixel with a non zero alpha value
// in the collision canvas. it takes a colBox object with coordinates for collision detector pixels
// and returns an object with the same keys and values that are false if there is no collision
// or true if there is a collision

const checkCollision = (colBox, x, y, collisionCtx, dataVisCtx) => {
  const collisions = {}


  for (let el of Object.entries(colBox)) {
    const imgData = collisionCtx.getImageData(
      x + el[1][0],
      y + el[1][1],
      1,
      1
      );
      collisions[el[0]] = imgData.data[3] !== 0

      // uncomment to see collision detector coordinates
      // dataVisCtx.fillRect(x + el[1][0] - 2, y + el[1][1] - 2, 4, 4)
  }
  return collisions
}

export const checkGreenCollision = (colBox, x, y, collisionCtx, dataVisCtx) => {
  const collisions = {}

  for (let el of Object.entries(colBox)) {
    const imgData = collisionCtx.getImageData(
      x + el[1][0],
      y + el[1][1],
      1,
      1
      );
      collisions[el[0]] = imgData.data[1] > 200

      // uncomment to see collision detector coordinates
      // dataVisCtx.fillRect(x + el[1][0] - 2, y + el[1][1] - 2, 4, 4)
  }
  return collisions
}


const checkCollisionLegacy = (imgData, colBox, dataVisCtx) => {
  const collisions = {}
  // console.log('hero col', colBox)
  for (let el of Object.entries(colBox)) {

      collisions[el[0]] = getPixel(imgData, el[1][0], el[1][1])[3] !== 0
      // console.log(el[0], collisions[el[0]])

    // uncomment this to render an approximate visualization of the collision checkers to the canvas
    // dataVisCtx.fillStyle = 'rgba(255, 0, 0, 1)'
    // if (enemyObject) {
      //   dataVisCtx.fillRect(enemyObject.x + el[1][0] - 2, enemyObject.y + el[1][1] - 2, 4, 4)
    // } else {
      //   dataVisCtx.fillRect(globalVars.heroCenterX + el[1][0] - 2, globalVars.heroCenterY + el[1][1] - 2, 4, 4)
      // }
    }

  // console.log(collisions)

  return collisions
}

 export default checkCollision
