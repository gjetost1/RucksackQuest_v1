import grass_1_src from '../../assets/backgrounds/animated/grass_1.png'
import grass_2_src from '../../assets/backgrounds/animated/grass_2.png'
import grass_3_src from '../../assets/backgrounds/animated/grass_3.png'
import barrel_1_src from '../../assets/backgrounds/animated/barrel_1.png'

const grass_1_img = new Image()
grass_1_img.src = grass_1_src

export const grass_1 = {
  spriteSheet: grass_1_img,
  blockSize: 64,
  cropX: 0,
  cropY: 0,
  minAnimFrame: 0,
  maxAnimFrame: 9,
  animFrameLimit: 20,
  currentAnimFrame: 0,
  currentDelayFrame: 0,
  delay: 300,
  xScale: .875,
  yScale: .25,
  destructible: true,
  breakImgFrames: 5,
  breaking: false,
  destroyed: false,
}

const grass_2_img = new Image()
grass_2_img.src = grass_2_src

export const grass_2 = {
  spriteSheet: grass_2_img,
  blockSize: 64,
  cropX: 0,
  cropY: 0,
  minAnimFrame: 0,
  maxAnimFrame: 9,
  animFrameLimit: 20,
  currentAnimFrame: 0,
  currentDelayFrame: 0,
  delay: 300,
  xScale: .875,
  yScale: .25,
  destructible: true,
  breakImgFrames: 5,
  breaking: false,
  destroyed: false,
}

const grass_3_img = new Image()
grass_3_img.src = grass_3_src

export const grass_3 = {
  spriteSheet: grass_3_img,
  blockSize: 64,
  cropX: 0,
  cropY: 0,
  minAnimFrame: 0,
  maxAnimFrame: 9,
  animFrameLimit: 20,
  currentAnimFrame: 0,
  currentDelayFrame: 0,
  delay: 300,
  xScale: .875,
  yScale: .25,
  destructible: true,
  breakImgFrames: 5,
  breaking: false,
  destroyed: false,
}

const barrel_1_img = new Image()
barrel_1_img.src = barrel_1_src

export const barrel_1 = {
  spriteSheet: barrel_1_img,
  blockSize: 64,
  cropX: 0,
  cropY: 0,
  minAnimFrame: 0,
  maxAnimFrame: 0,
  animFrameLimit: 20,
  currentAnimFrame: 0,
  currentDelayFrame: 0,
  delay: 300,
  xScale: .875,
  yScale: .25,
  destructible: true,
  breakImgFrames: 6,
  breaking: false,
  destroyed: false,
}
