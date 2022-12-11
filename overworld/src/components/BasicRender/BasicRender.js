import React, { useContext, useEffect, useRef, useState } from "react";
import "./BasicRender.css";
import moveEngine from "./MoveEngine";
import enemyMoveEngine from "./EnemyMoveEngine";
import enemyUpdate from "./EnemyUpdate";
import enemyRender from "./EnemyRender";
import enemyGenerator from "./EnemyGenerator";
import coordinateChange from "./CoordinateChange";
import eventEngine from "./EventEngine";
import spriteBuffer from "./SpriteBuffer";
import pixelator from "./Pixelator";
import background_1 from "../../assets/backgrounds/test/big_map_background_2.png";
import collision_1 from "../../assets/backgrounds/test/big_map_collision_2.png";
import foreground_1 from "../../assets/backgrounds/test/big_map_foreground_2.png";
import cursor_1 from "../../assets/hand_cursor.png";
import {
  grass_1,
  grass_low_1,
  grass_2,
  grass_3,
  barrel_1,
  barrel_2,
  barrel_low_1,
} from "./AnimatedObjects";

import cMasks from "./CollisionMasks";

import globalVars from "./GlobalVars";
import heroRender from "./HeroRender";
import cursorRender from "./CursorRender";
import hudRender from "./HUDRender";
import attackRender from "./AttackRender";
import animatedObjectsRender, {
  generatePatch,
  Patch,
} from "./AnimatedObjectsRender";

import { wolfen } from "./EnemyObjects";

import inputEngine from "./InputEngine";
import baseHeroGet from "./BaseHero";

import sword_fx from "../../assets/sounds/sword/damage_sound.wav";

const upscale = globalVars.upscale; // multiplier for resolution - 2 means each visible pixel is 2 x 2 real pixels etc
const height = globalVars.height;
const width = globalVars.width;
const blockSize = globalVars.blockSize; // size of each grid block in pixels for collison objects
let baseHero = { ...baseHeroGet };
let cursorX = -400; // sets cursor starting coordinates outside the canvas so it is invisible
let cursorY = -400;

// these limit how often a frame is drawn to the screen
const frameRatePeak = 3;
let frameRateCounter = 0;

// this gets the coordinates of the cursor so it can be rendered on the canvas
document.addEventListener("mousemove", (action) => {});
onmousemove = (event) => {
  cursorX = event.x;
  cursorY = event.y;
  // cursorX = event.x - globalVars.windowSpacerWidth
  // cursorY = event.y - globalVars.windowSpacerHeight
};

// const grassPatch = generatePatch(-16, 0, 47, 28, [grass_1, grass_2, grass_3])
// const grassPatch = generatePatch(920, 300, 7, 6, [grass_1, grass_2, grass_3])
// const grassPatch2 = generatePatch(980, 628, 5, 4, [grass_1, grass_2, grass_3])
// const grassPatch3 = generatePatch(1000, 140, 5, 4, [grass_1, grass_2, grass_3])
// const grassPatch4 = generatePatch(352, 420, 8, 3, [grass_1, grass_2, grass_3])
// const grassPatch5 = generatePatch(460, 560, 5, 4, [grass_1, grass_2, grass_3])
// const barrelPatch = generatePatch(600, 300, 5, 4, [barrel_1, barrel_2])

// const grassPatch = generatePatch(760, 560, 5, 6, [grass_low_1])
// const barrelPatch = generatePatch(400, 500, 3, 3, [barrel_low_1])

const grassPatch1 = new Patch(500, 500, 14, 14, [grass_1, grass_2, grass_3], 0.05);
const grassPatch2 = new Patch(
  -500,
  -500,
  20,
  20,
  [grass_1, grass_2, grass_3],
  0.05
);
const grassPatch3 = new Patch(
  1100,
  1000,
  20,
  20,
  [grass_1, grass_2, grass_3],
  0.05
);
const barrelPatch = new Patch(100, 500, 4, 4, [barrel_1, barrel_2], 0.2);

let bufferIntervalSet = true; // makes sure that the sprite buffer interval is set only once

const BasicRender = ({}) => {
  const swordFx = new Audio(sword_fx);
  // let eventObj = {}

  // declare the 3 (current) canvases. background is rendered first, then sprite, then foreground on top
  // foregroundCanvas is for scenery and objects that the hero or other sprites can go behind
  // it is partly transparent so you don't lose sprites behind it
  // const backgroundCanvas = useRef(null)
  // const spriteCanvas = useRef(null)
  // const foregroundCanvas = useRef(null)
  // const cursorCanvas = useRef(null)
  // const collisionCanvas = useRef(null)
  const backgroundCanvas = new OffscreenCanvas(
    globalVars.width,
    globalVars.height
  );
  const spriteCanvas = new OffscreenCanvas(globalVars.width, globalVars.height);
  const foregroundCanvas = new OffscreenCanvas(
    globalVars.width,
    globalVars.height
  );
  const cursorCanvas = new OffscreenCanvas(globalVars.width, globalVars.height);
  const collisionCanvas = new OffscreenCanvas(
    globalVars.width,
    globalVars.height
  );
  // const pixelCanvas = useRef(null)
  const comboCanvas = useRef(null);

  const wolfenGroupCreator = [
    {
      base: wolfen,
      x: -100,
      y: -100,
    },
    {
      base: wolfen,
      x: 1564,
      y: 1500,
    },
    {
      base: wolfen,
      x: 1500,
      y: 1564,
    },
    {
      base: wolfen,
      x: 436,
      y: 500,
    },
    {
      base: wolfen,
      x: 1436,
      y: 564,
    },
  ];

  // creates an enemy group
  let wolfenGroup = enemyGenerator(wolfenGroupCreator);

  // sets an interval to re-load sprites since they flicker if they have been
  // de-loaded by the browser after not being used for a while
  // if (bufferIntervalSet) {
  //   bufferIntervalSet = false;
  //   spriteBuffer(baseHero, wolfenGroup);
  //   setInterval(() => {
  //     console.log("buffering");
  //     spriteBuffer(baseHero, wolfenGroup);
  //   }, 3000);
  // }

  // this is the main useEffect for rendering - it runs input checks,
  // updates positions and animations, and then renders the frame using
  // the animate() function
  useEffect(() => {
    // creates context for each canvas. Invoke all drawing/rendering to canvas
    // using the context for the layer you want to render to
    // const backgroundCtx = backgroundCanvas.current.getContext('2d', { alpha: false })
    // const spriteCtx = spriteCanvas.current.getContext('2d')
    // const foregroundCtx = foregroundCanvas.current.getContext('2d')
    // const cursorCtx = cursorCanvas.current.getContext('2d')
    // const collisionCtx = collisionCanvas.current.getContext('2d', { willReadFrequently: true })
    const backgroundCtx = backgroundCanvas.getContext("2d");
    const spriteCtx = spriteCanvas.getContext("2d");
    const foregroundCtx = foregroundCanvas.getContext("2d");
    const cursorCtx = cursorCanvas.getContext("2d");
    const collisionCtx = collisionCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    const comboCtx = comboCanvas.current.getContext("2d");
    // const pixelCtx = pixelCanvas.current.getContext('2d', { alpha: false })

    // makes foreground transparent so you can see sprites under it
    foregroundCtx.globalAlpha = 0.85;

    // this next function sends the keys object of the hero to the inputEngine where all the event listeners live
    // for inputs. returns keys object which is checked for what keys are currently pressed each frame
    baseHero.keys = inputEngine(baseHero.keys);

    // Sprite is the main class for hero and enemy sprites
    // image is the .png for the spritesheet you are rendering
    // position is an object with global x and y coordinates for the
    // upper lefthand corner of the sprite (where it is currently being rendered on the screen)
    // crop is the upper lefthand corner where the spritesheet is being
    // cropped - crop size is based on rectWidth and rectHeight which is
    // currently set globally

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

      draw() {
        spriteCtx.drawImage(
          this.image,
          this.crop.x,
          this.crop.y,
          this.blocksize,
          this.blocksize,
          this.position.x,
          this.position.y,
          this.blocksize,
          this.blocksize
        );
      }
    }

    class Background {
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

      draw() {
        backgroundCtx.drawImage(
          this.image,
          this.crop.x,
          this.crop.y,
          globalVars.width,
          globalVars.height,
          this.position.x,
          this.position.y,
          globalVars.width,
          globalVars.height
        );
      }
    }

    class Foreground {
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

      draw() {
        foregroundCtx.drawImage(
          this.image,
          this.crop.x,
          this.crop.y,
          globalVars.width,
          globalVars.height,
          this.position.x,
          this.position.y,
          globalVars.width,
          globalVars.height
        );
      }
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

      draw() {
        collisionCtx.drawImage(
          this.image,
          this.crop.x,
          this.crop.y,
          globalVars.width,
          globalVars.height,
          this.position.x,
          this.position.y,
          globalVars.width,
          globalVars.height
        );
      }
    }

    // we create the sprite, background, and foreground instances we will be rendering
    const playerImage = new Image();
    playerImage.src = baseHero.currentHeroSprite;

    const playerSprite = new Sprite({
      image: playerImage,
      position: {
        x: globalVars.heroCenterX,
        y: globalVars.heroCenterY,
      },
      crop: {
        x: baseHero.heroCropX,
        y: baseHero.heroCropY,
      },
      blockSize: baseHero.blockSize,
    });

    const equipImage = new Image();
    equipImage.src = baseHero.currentEquipmentSprite;

    const swordSprite = new Sprite({
      image: equipImage,
      position: {
        x: globalVars.heroCenterX,
        y: globalVars.heroCenterY,
      },
      crop: {
        x: baseHero.heroCropX,
        y: baseHero.heroCropY,
      },
      blockSize: baseHero.blockSize,
    });

    const cursor = new Image();
    cursor.src = cursor_1;

    const background = new Image();
    background.src = background_1;
    const backgroundWidthCenter = background.naturalWidth / 2;
    const backgroundHeightCenter = background.naturalHeight / 2;

    const foreground = new Image();
    foreground.src = foreground_1;

    const collisions = new Image();
    collisions.src = collision_1;

    const backgroundSprite = new Background({
      image: background,
      position: {
        x: 0,
        y: 0,
      },
      crop: {
        x: backgroundWidthCenter,
        y: backgroundHeightCenter,
      },
    });

    const foregroundSprite = new Foreground({
      image: foreground,
      position: {
        x: 0,
        y: 0,
      },
      crop: {
        x: backgroundWidthCenter,
        y: backgroundHeightCenter,
      },
    });

    const collisionSprite = new Collisions({
      image: collisions,
      position: {
        x: 0,
        y: 0,
      },
      crop: {
        x: backgroundWidthCenter,
        y: backgroundHeightCenter,
      },
    });

    const animate = () => {
      // clears all canvases for a new animation frame

      backgroundCtx.clearRect(0, 0, globalVars.width, globalVars.height);
      spriteCtx.clearRect(0, 0, globalVars.width, globalVars.height);
      foregroundCtx.clearRect(0, 0, globalVars.width, globalVars.height);
      cursorCtx.clearRect(0, 0, globalVars.width, globalVars.height);

      // moveEngine runs less than every frame to keep the hero sprite slower
      if (baseHero.frameCountLimiter >= baseHero.maxFrameCountLimiter) {
        baseHero.frameCountLimiter = 0;
        // moveEngine handles inputs and collisions for hero sprite
        baseHero = moveEngine(baseHero, collisionCtx, foregroundCtx);
        wolfenGroup = coordinateChange(baseHero, wolfenGroup);
        // coordinateChange moves elements in relation to the hero to keep them at the right coordinates
      }

      baseHero.frameCountLimiter += baseHero.moveSpeed;

      collisionCtx.clearRect(0, 0, globalVars.width, globalVars.height);

      backgroundSprite.cropChange(baseHero.cameraX, baseHero.cameraY);
      foregroundSprite.cropChange(baseHero.cameraX, baseHero.cameraY);
      collisionSprite.cropChange(baseHero.cameraX, baseHero.cameraY);

      playerSprite.position = { x: baseHero.x, y: baseHero.y };
      swordSprite.position = { x: baseHero.x, y: baseHero.y };

      playerImage.src = baseHero.currentHeroSprite;

      equipImage.src = baseHero.currentEquipmentSprite;

      // wolfenImage.src = wolfen_1.currentSprite

      // this handles an attack/ability usage by user - sets vars that will trigger attack/ability animation and
      // puts ability on cooldown. Current cooldown is set manually, but once there are other abilities
      // we will use their specific attributes to set the cooldown and effect duration
      // activates if there is enough stamina for attack
      if (
        baseHero.currentFatigue >= baseHero.fatigueDrain * baseHero.fatigueAttack &&
        baseHero.keys.mouse1.pressed &&
        baseHero.attackCooldownOff
      ) {
        baseHero.attackCooldownOff = false;
        baseHero.attackActive = true;
        baseHero.attackAnimation = true;
        // baseHero.currentFatigue -= baseHero.fatigueDrain * baseHero.fatigueAttack;
        // baseHero.coolDownLevel = 0; // sets the var for animating HUD cooldown level

        // calculates and draws attack effects on keypress with cooldown

        let eventObj = {
          // object passed to EventEngine to trigger appropriate event
          x: playerSprite.position.x,
          y: playerSprite.position.y,
          direction: baseHero.direction,
          eventX: 0,
          eventY: 0,
          blockSize: blockSize,
          eventType: "attack",
          eventDirection: "heroFront",
          eventAreaShape: "rectangle",
          eventXDim: 1,
          eventYDim: 3,
          eventEffect: {
            damage: 10,
          },
          eventDuration: 0.1,
          eventTimeout: 0.8,
          eventAnim: null,
        };
        // spriteCtx.fillStyle = 'rgb(255, 0, 0)'
        // spriteCtx.fillRect(baseHero.eventX, baseHero.eventY, baseHero.attackBlockSize, baseHero.attackBlockSize)

        baseHero = eventEngine(baseHero, "attack");
        // cooldown setTimeout sets the cooldown on an event ability - eventObj.eventTimeout determines the length in seconds
        const cooldown = setTimeout(() => {
          // enables this attack again after eventTimeout # of seconds, essentially a cooldown
          baseHero.attackCooldownOff = true;
          clearTimeout(cooldown);
          // console.log('cooldown over')
        }, eventObj.eventTimeout * 1000);

        // sets duration of event, set by eventObj.eventDuration in seconds
        const eventDuration = setTimeout(() => {
          clearTimeout(eventDuration);
          baseHero.attackActive = false;
          baseHero.eventX = -400;
          baseHero.eventY = -400;
          // console.log('attack over')
        }, eventObj.eventDuration * 1000);
      }

      // // this increments coolDownLevel which controls the visual cooldown HUD
      // if (!baseHero.attackCooldownOff) {
      //   baseHero.coolDownLevel += baseHero.coolDownLevelMax / 120;
      //   // coolDownLevel = Math.round(coolDownLevel)
      //   if (baseHero.coolDownLevel >= baseHero.coolDownLevelMax) {
      //     baseHero.coolDownLevel = baseHero.coolDownLevelMax;
      //   }
      // } else {
      //   baseHero.coolDownLevel = 0;
      // }

      if (baseHero.keys.e.pressed) {
        baseHero.bloodDrainActive = true;
        let eventObj = {
          // object passed to EventEngine to trigger appropriate event
          x: playerSprite.position.x,
          y: playerSprite.position.y,
          direction: baseHero.direction,
          eventX: 0,
          eventY: 0,
          blockSize: blockSize,
          eventType: "drain",
          eventDirection: "heroFront",
          eventAreaShape: "rectangle",
          eventXDim: 1,
          eventYDim: 1,
          eventEffect: {
            drain: 1,
          },
          eventDuration: 0.1,
          eventTimeout: 0.8,
          eventAnim: null,
        };

        // spriteCtx.fillRect(baseHero.eventX, baseHero.eventY, baseHero.attackBlockSize, baseHero.attackBlockSize)
        baseHero = eventEngine(baseHero, "drain");
      } else {
        if (baseHero.bloodDrainActive) {
          baseHero.eventX = -400;
          baseHero.eventY = -400;
        }
        baseHero.bloodDrainActive = false;
        // baseHero.attackActive = false
      }

      // makes the canvases render a frame
      window.requestAnimationFrame(animate);

      // renders collision sprite, which is behind the background and not visible on canvas
      // you can change the z-index of the collision div in the css if you want to see it visualized
      collisionSprite.draw();
      // renders current background sprite
      backgroundSprite.draw();

      foregroundCtx.globalAlpha = 1;

      animatedObjectsRender(
        grassPatch1.definition(),
        baseHero,
        backgroundCtx,
        foregroundCtx,
        collisionCtx
      );
      animatedObjectsRender(
        grassPatch2.definition(),
        baseHero,
        backgroundCtx,
        foregroundCtx,
        collisionCtx
      );
      animatedObjectsRender(
        grassPatch3.definition(),
        baseHero,
        backgroundCtx,
        foregroundCtx,
        collisionCtx
      );
      animatedObjectsRender(
        barrelPatch.definition(),
        baseHero,
        backgroundCtx,
        foregroundCtx,
        collisionCtx
      );
      foregroundCtx.globalAlpha = 0.85;

      const enemyUpdateArr = enemyUpdate(
        wolfenGroup,
        baseHero,
        collisionCtx,
        spriteCtx
      );
      wolfenGroup = enemyUpdateArr[0];
      baseHero = enemyUpdateArr[1];

      enemyRender(wolfenGroup, baseHero, spriteCtx, "back");

      // draws hero sprite and equipment in attack animation if there is an ongoing attack
      if (baseHero.attackAnimation) {
        const attackRet = attackRender(
          baseHero.heroCropX,
          baseHero.heroSpriteSize,
          swordFx,
          baseHero.attackAnimation
        );
        baseHero.heroCropX = attackRet.heroCropX;
        baseHero.attackAnimation = attackRet.attackAnimation;
        playerSprite.cropChange(baseHero.heroCropX, baseHero.heroCropY);
        swordSprite.cropChange(baseHero.heroCropX, baseHero.heroCropY);
        baseHero = heroRender([playerSprite, swordSprite], baseHero, spriteCtx);
      } else {
        // draws hero sprite image to canvas without attack animation
        // feed in sprite class instances in the order you want them rendered
        // eg typically base player sprite first, then clothing, then equipment
        playerSprite.cropChange(baseHero.heroCropX, baseHero.heroCropY);
        swordSprite.cropChange(baseHero.heroCropX, baseHero.heroCropY);
        baseHero = heroRender([playerSprite, swordSprite], baseHero, spriteCtx);
      }

      enemyRender(wolfenGroup, baseHero, spriteCtx, "front");

      // this renders foreground objects with opacity so that you can see the hero behind them
      foregroundSprite.draw();
      baseHero = hudRender(spriteCtx, cursorCtx, foregroundCtx, baseHero);
      cursorRender(cursorCtx, cursor, cursorX, cursorY);

      // this was used to visualize the hitbox coordinate checkers for collision detection, might use again to tweak that
      // backgroundCtx.fillStyle = 'rgba(255, 0, 0, 1)'
      // backgroundCtx.fillRect( globalVars.heroStartXCoord - baseHero.cameraX, globalVars.heroStartYCoord - baseHero.cameraY, 8, 8)
      // backgroundCtx.fillStyle = 'rgba(0, 255, 0, 1)'
      // backgroundCtx.fillRect(baseHero.eventX, baseHero.eventY, 4, 4)

      const drawToComboCanvas = (canvases) => {
        for (let el of canvases) {
          // const canvas = document.getElementById(el)
          const renderImg = el.transferToImageBitmap();
          // console.log(renderImg)
          // const canvas = document.getElementById('backgroundCanvas')
          // const dataURL = canvas.toDataURL()
          // console.log(dataURL)
          comboCtx.drawImage(renderImg, 0, 0);
        }
      };
      if (frameRateCounter === frameRatePeak) {
        // pixelator(comboCtx, pixelCtx, backgroundCanvas, spriteCanvas, foregroundCanvas, cursorCanvas) // turn this on to burn it all down
        // drawToComboCanvas(['backgroundCanvas', 'spriteCanvas', 'foregroundCanvas', 'cursorCanvas'])
        drawToComboCanvas([
          backgroundCanvas,
          spriteCanvas,
          foregroundCanvas,
          cursorCanvas,
        ]);
        frameRateCounter = 0;
      }
      frameRateCounter++;
    };

    animate();
  }, []);

  return (
    <div id="main-container">
      {/* <div id='instructions'>WASD to move - SHIFT to dash - LEFT MOUSE BUTTON to attack</div> */}
      <div id="canvas-container">
        <div
          id="sizing"
          style={{ height: window.innerHeight, width: window.innerWidth }}
        ></div>
        {/* <canvas id='collisionCanvas' ref={collisionCanvas} height={window.innerHeight} width={window.innerWidth} />
        <canvas id='backgroundCanvas' ref={backgroundCanvas} height={window.innerHeight} width={window.innerWidth} />
        <canvas id='spriteCanvas' ref={spriteCanvas} height={window.innerHeight} width={window.innerWidth} />
        <canvas id='foregroundCanvas' ref={foregroundCanvas} height={window.innerHeight} width={window.innerWidth} />
        <canvas id='cursorCanvas' ref={cursorCanvas} height={window.innerHeight} width={window.innerWidth} /> */}
        <canvas
          id="comboCanvas"
          ref={comboCanvas}
          height={window.innerHeight}
          width={window.innerWidth}
        />
        {/* <canvas id='pixelCanvas' ref={pixelCanvas} height={window.innerHeight} width={window.innerWidth} /> */}
        {/* <div className='blur'></div> */}
        {/* <div className='scanline-tone'></div> */}
        {/* <div className='pixel-tone'></div> */}
        {/* <div className='pixel-mask'></div> */}
      </div>
    </div>
  );
};

export default BasicRender;
