import globalVars from "./GlobalVars";
import background_1 from "../../assets/backgrounds/test/big_map_background_2.png";
import collision_1 from "../../assets/backgrounds/test/big_map_collision_2.png";
import foreground_1 from "../../assets/backgrounds/test/big_map_foreground_2.png";

class Sprite {
  constructor({ image, position, crop, blockSize }) {
    this.position = position;
    this.image = image;
    this.crop = crop;
    this.blocksize = blockSize;
  }

  cropChange(cropX, cropY) {
    this.crop = {
      x: cropX,
      y: cropY,
    };
  }

  // draw() {
  //   spriteCtx.drawImage(
  //     this.image,
  //     this.crop.x,
  //     this.crop.y,
  //     this.blocksize,
  //     this.blocksize,
  //     this.position.x,
  //     this.position.y,
  //     this.blocksize,
  //     this.blocksize
  //   );
  // }
}


class CanvasImage {
  constructor({ image, position, crop }) {
    this.position = position;
    this.image = image;
    this.crop = crop;
  }

  cropChange(cropX, cropY) {
    this.crop = {
      x: cropX,
      y: cropY,
    };
  }

  // draw() {
  //   backgroundCtx.drawImage(
  //     this.image,
  //     this.crop.x - globalVars.offscreenBoundaryTotal,
  //     this.crop.y - globalVars.offscreenBoundaryTotal,
  //     globalVars.width,
  //     globalVars.height,
  //     this.position.x - globalVars.offscreenBoundarySide,
  //     this.position.y - globalVars.offscreenBoundarySide,
  //     globalVars.width,
  //     globalVars.height
  //   );
  // }
}

class Collisions {
  constructor({ image, position, crop }) {
    this.position = position;
    this.image = image;
    this.crop = crop;
  }

  cropChange(cropX, cropY) {
    this.crop = {
      x: cropX,
      y: cropY,
    };
  }

  // draw() {
  //   collisionCtx.drawImage(
  //     this.image,
  //     this.crop.x,
  //     this.crop.y,
  //     collisions.width,
  //     collisions.height,
  //     this.position.x,
  //     this.position.y,
  //     collisions.width,
  //     collisions.height
  //   );
  // }
}


const cursor = new Image();
cursor.src = cursor_1;


const background = new Image();
background.src = background_1;


export const backgroundSprite = new CanvasImage({
  image: background,
  position: {
    x: 0,
    y: 0,
  },
  crop: {
    x: globalVars.width,
    y: globalVars.height,
  },
});


const foreground = new Image();
foreground.src = foreground_1;


export const foregroundSprite = new CanvasImage({
  image: foreground,
  position: {
    x: 0,
    y: 0,
  },
  crop: {
    x: globalVars.width,
    y: globalVars.height,
  },
});


const collisions = new Image();
collisions.src = collision_1;


export const collisionSprite = new CanvasImage({
  image: collisions,
  position: {
    x: 0,
    y: 0,
  },
  crop: {
    x: globalVars.width,
    y: globalVars.height,
  },
});
