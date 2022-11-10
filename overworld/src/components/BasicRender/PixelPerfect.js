// pixelPerfect keeps the rendered sprite lined up with the pixel grid.
// resolution of the background, hero, and other items needs to be the same
// for this to work though

const pixelPerfect = (coordinate, direction, coordType, upscale) => {
  if (direction === 'down' || direction === 'right' || direction === 'downright') {
    if(coordinate > 0){
        return Math.ceil(coordinate/(upscale + 0.0)) * upscale;
      } else if( coordinate <= 0) {
        return Math.floor(coordinate/(upscale + 0.0)) * upscale;
      }
    } else if (direction === 'up' || direction === 'left' || direction === 'upleft') {
    if(coordinate > 0){
        return Math.floor(coordinate/(upscale + 0.0)) * upscale;
      } else if( coordinate <= 0) {
        return Math.ceil(coordinate/(upscale + 0.0)) * upscale;
      }
    } else if (direction === 'upright') {
    if (coordType === 'x') {
          if(coordinate > 0){
            return Math.ceil(coordinate/(upscale + 0.0)) * upscale;
          } else if( coordinate <= 0) {
            return Math.floor(coordinate/(upscale + 0.0)) * upscale;
          }
        } else if (coordType === 'y') {
          if(coordinate > 0){
            return Math.floor(coordinate/(upscale + 0.0)) * upscale;
          } else if( coordinate <= 0) {
            return Math.ceil(coordinate/(upscale + 0.0)) * upscale;
          }
        }
    } else if (direction === 'downleft') {
    if (coordType === 'y') {
        if(coordinate > 0){
          return Math.ceil(coordinate/(upscale + 0.0)) * upscale;
        } else if( coordinate <= 0) {
          return Math.floor(coordinate/(upscale + 0.0)) * upscale;
        }
      } else if (coordType === 'x') {
          if(coordinate > 0){
            return Math.floor(coordinate/(upscale + 0.0)) * upscale;
          } else if( coordinate <= 0) {
            return Math.ceil(coordinate/(upscale + 0.0)) * upscale;
          }
      }
  }
}

export default pixelPerfect
