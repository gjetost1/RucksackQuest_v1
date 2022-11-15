import globalVars from "./GlobalVars"
const blockSize = globalVars.blockSize
const width = globalVars.width
const height = globalVars.height
// defines the outer bounds of the scene for collision purposes
const outerBoundary = [
  {x: -blockSize, y: -blockSize / 2, xBlocks: width / blockSize + 2, yBlocks: 1, gridSize: blockSize}, // this one covers the hud bar at the top
  {x: -blockSize, y: -blockSize, xBlocks: 1, yBlocks: height / blockSize + 2, gridSize: blockSize},
  {x: width, y: -blockSize, xBlocks: 1, yBlocks: height / blockSize + 2, gridSize: blockSize},
  {x: -blockSize, y: height, xBlocks: width / blockSize + 2, yBlocks: 1, gridSize: blockSize},
]

// defines collision boxes inside scene
const innerCollisionTestScene_1 = [
  {x: blockSize * 7, y: blockSize * 3, xBlocks: 1, yBlocks: 1, gridSize: blockSize},
  {x: blockSize * 17, y: blockSize * 2, xBlocks: 1, yBlocks: 1, gridSize: blockSize},
  {x: blockSize * 17, y: blockSize * 10, xBlocks: 1, yBlocks: 1, gridSize: blockSize},
  {x: blockSize * 2, y: blockSize * 10, xBlocks: 1, yBlocks: 1, gridSize: blockSize},
  {x: blockSize * 11, y: blockSize * 3, xBlocks: 3, yBlocks: 1, gridSize: blockSize},
]

// concats all collision arrays for use in buildCMask
const collisions = outerBoundary.concat(innerCollisionTestScene_1)

// getDimension returns the dimension of a rectangular object for collision detection
// x and y are the upper left corner pixel coordinates
// xBlocks and yBlocks are the number of 16px (or whatever the grid size is) grid blocks the object spans in each dimension
const getDimension = (boundary) => {
  let {x, y, xBlocks, yBlocks, gridSize} = boundary
  return (
    {
      tl: [x, y],
      tr: [x + (xBlocks * gridSize), y],
      bl: [x, y + (yBlocks * gridSize)],
      br: [x + (xBlocks * gridSize), y + (yBlocks * gridSize)]
    }
  )
}

// buildCMask takes the collisions array and creates coordinates for each collision object
// so we can check for collisions
const buildCMask = (collisions) => {
  const cMaskBuild = []
  for (let el of collisions) {
    cMaskBuild.push(getDimension(el))
  }
  return cMaskBuild
}

// this array contains all collision masks for map boundaries and other collision objects present
const cMasks = buildCMask(collisions)

export default cMasks
