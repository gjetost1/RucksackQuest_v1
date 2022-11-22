import grass_1_src from '../../assets/backgrounds/animated/grass_1.png'
import grass_break_1_src from '../../assets/backgrounds/animated/grass_break_1.png'
import grass_2_src from '../../assets/backgrounds/animated/grass_2.png'

const grass_1_img = new Image()
grass_1_img.src = grass_1_src

const grass_break_1_img = new Image()
grass_break_1_img.src = grass_break_1_src

const grass_2_img = new Image()
grass_2_img.src = grass_2_src

export const grass_1 = {
  spriteSheet: grass_1_img,
  breakImg: grass_break_1_img,
  blockSize: 64,
  cropX: 0,
  cropY: 0,
  minAnimFrame: 0,
  maxAnimFrame: 9,
  animFrameLimit: 20,
  currentAnimFrame: 0,
  currentDelayFrame: 0,
  delay: 300,
  xScale: .75,
  yScale: .25,
  destructible: true,
  breakImgFrames: 5,
  destroyed: false,
}

export const grass_2 = {
  spriteSheet: grass_2_img,
  breakImg: grass_break_1_img,
  blockSize: 64,
  cropX: 0,
  cropY: 0,
  minAnimFrame: 0,
  maxAnimFrame: 9,
  animFrameLimit: 20,
  currentAnimFrame: 0,
  currentDelayFrame: 0,
  delay: 300,
  xScale: .75,
  yScale: .25,
  destructible: true,
  breakImgFrames: 5,
  destroyed: false,
}
