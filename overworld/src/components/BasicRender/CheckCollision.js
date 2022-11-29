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


// checkCollision checks if baseHero.x,baseHero.y coordinates are inside one of the collision masks in cMask
// returns false if there is a collision and true if there is not
const checkCollision = (imgData, colBox, corner) => {
  // the corner value determines which index of the colBox array we are checking for alpha values
  return getPixel(imgData, colBox[corner][0], colBox[corner][1])[3] === 0
}
 export default checkCollision
