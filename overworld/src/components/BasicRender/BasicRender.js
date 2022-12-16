import React, { useContext, useEffect, useRef, useState } from "react";
import "./BasicRender.css";
// import moveEngine from "./MoveEngine";
// import enemyMoveEngine from "./EnemyMoveEngine";
import enemyUpdate from "./EnemyUpdate";
import enemyRender from "./EnemyRender";
import enemyGenerator from "./EnemyGenerator";
// import coordinateChange from "./CoordinateChange";
// import eventEngine from "./EventEngine";
import spriteBuffer from "./SpriteBuffer";
// import pixelator from "./Pixelator";
import { backgroundSprite, foregroundSprite, collisionSprite, cursor } from "./SpriteClasses";

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
import animatedObjectsRender, {
  generatePatch,
  Patch,
} from "./AnimatedObjectsRender";

import { wolfen } from "./EnemyObjects";

import inputEngine from "./InputEngine";
import { baseHeroTemplate, baseHeroSprite, swordSprite } from "./BaseHero";

import heroUpdate from "./HeroUpdate";
import dropItemRender from "./DropItemRender";


let baseHeroObj = {...baseHeroTemplate}

// const upscale = globalVars.upscale; // multiplier for resolution - 2 means each visible pixel is 2 x 2 real pixels etc
// const height = globalVars.height;
// const width = globalVars.width;
// const blockSize = globalVars.blockSize; // size of each grid block in pixels for collison objects
// let baseHeroObj = baseHeroSprite;
// console.log(baseHeroObj)
let cursorX = -400; // sets cursor starting coordinates outside the canvas so it is invisible
let cursorY = -400;

// these limit how often a frame is drawn to the screen
const frameRatePeak = 3;
let frameRateCounter = 0;

// this gets the coordinates of the cursor so it can be rendered on the canvas
document.addEventListener("mousemove", (action) => {});
onmousemove = (event) => {
  // console.log('moving', event)
  cursorX = event.layerX;
  cursorY = event.layerY;
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

const grassPatch1 = new Patch(100, 100, 20, 20, [grass_1, grass_2, grass_3], 0.05);
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

let dropItemArr = [] // array that stores all items that are on the ground

let bufferIntervalSet = true; // makes sure that the sprite buffer interval is set only once

const BasicRender = () => {
  // let eventObj = {}


  // declare the 3 (current) canvases. background is rendered first, then sprite, then foreground on top
  // foregroundCanvas is for scenery and objects that the hero or other sprites can go behind
  // it is partly transparent so you don't lose sprites behind it
  // const backgroundCanvas = useRef(null)
  // const spriteCanvas = useRef(null)
  // const foregroundCanvas = useRef(null)
  // const cursorCanvas = useRef(null)
  const backgroundCanvas = new OffscreenCanvas(
    globalVars.width,
    globalVars.height
    );
    const spriteCanvas = new OffscreenCanvas(globalVars.width, globalVars.height);
    const foregroundCanvas = new OffscreenCanvas(globalVars.width, globalVars.height);
    const cursorCanvas = new OffscreenCanvas(globalVars.width - globalVars.blockSize, globalVars.height - globalVars.blockSize);
    const visionCanvas = new OffscreenCanvas(globalVars.width, globalVars.height);
    const collisionCanvas = new OffscreenCanvas(globalVars.width, globalVars.height);
    // const collisionCanvas = useRef(null)
    const dataVisCanvas = new OffscreenCanvas(globalVars.width, globalVars.height); // used for development to visualize coordinates, hitboxes, radiuses, etc.

  // const pixelCanvas = useRef(null)
  const comboCanvas = useRef(null); // only visible canvas, combines all the other asset canvases and renders them except the collision canvas

  const wolfenGroupCreator = [
    {
      base: wolfen,
      x: 700,
      y: 500,
    },
    // {
    //   base: wolfen,
    //   x: 700,
    //   y: 500,
    // },
    // {
    //   base: wolfen,
    //   x: 500,
    //   y: 500,
    // },
    // {
    //   base: wolfen,
    //   x: 572,
    //   y: 664,
    // },
    // {
    //   base: wolfen,
    //   x: 500,
    //   y: 464,
    // },

  ];

  // creates an enemy group
  let wolfenGroup = enemyGenerator(wolfenGroupCreator);

  let enemyArr = [wolfenGroup]

  // sets an interval to re-load sprites since they flicker if they have been
  // de-loaded by the browser after not being used for a while
  // if (bufferIntervalSet) {
  //   bufferIntervalSet = false;
  //   spriteBuffer(baseHeroObj, wolfenGroup);
  //   setInterval(() => {
  //     console.log("buffering");
  //     spriteBuffer(baseHeroObj, wolfenGroup);
  //   }, 2000);
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
    const visionCtx = visionCanvas.getContext("2d");
    const collisionCtx = collisionCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    const dataVisCtx = dataVisCanvas.getContext("2d");
    const comboCtx = comboCanvas.current.getContext("2d");

    // const pixelCtx = pixelCanvas.current.getContext('2d', { alpha: false })

    // makes foreground transparent so you can see sprites under it
    foregroundCtx.globalAlpha = 0.85;

    // this next function sends the keys object of the hero to the inputEngine where all the event listeners live
    // for inputs. returns keys object which is checked for what keys are currently pressed each frame
    baseHeroObj.keys = inputEngine(baseHeroObj.keys);

    // Sprite is the main class for hero and enemy sprites
    // image is the .png for the spritesheet you are rendering
    // position is an object with global x and y coordinates for the
    // upper lefthand corner of the sprite (where it is currently being rendered on the screen)
    // crop is the upper lefthand corner where the spritesheet is being
    // cropped - crop size is based on rectWidth and rectHeight which is
    // currently set globally


    // const collisionSprite = new Collisions({
    //   image: collisions,
    //   position: {
    //     x: 0,
    //     y: 0,
    //   },
    //   crop: {
    //     x: backgroundWidthCenter,
    //     y: backgroundHeightCenter,
    //   },
    // });

    // console.log(collisions.width, collisions.height)

    const animate = () => {



      // console.log(baseHeroObj.bloodDrainActive, baseHeroObj.bloodDrainAnimation)
      // clears all canvases for a new animation frame
      backgroundCtx.clearRect(0, 0, globalVars.width, globalVars.height);
      spriteCtx.clearRect(0, 0, globalVars.width, globalVars.height);
      foregroundCtx.clearRect(0, 0, globalVars.width, globalVars.height);
      cursorCtx.clearRect(0, 0, globalVars.width, globalVars.height);



      // handles hero inputs, actions, and movement
      const heroUpdateRet = heroUpdate(baseHeroObj, enemyArr, dropItemArr, collisionCtx, dataVisCtx, spriteCtx)
      baseHeroObj = heroUpdateRet[0]
      enemyArr = heroUpdateRet[1]
      dropItemArr = heroUpdateRet[2]


      // SHOULD MOVE THIS INTO HEROUPDATE ONCE HERO IS A CONTAINED CLASS LIKE ENEMIES
      // sets hero and equipment positions based on moveEngine output
      // and sets spritesheet for direction they are facing as well
      baseHeroSprite.position = { x: baseHeroObj.x, y: baseHeroObj.y };
      swordSprite.position = { x: baseHeroObj.x, y: baseHeroObj.y };
      baseHeroSprite.image.src = baseHeroObj.currentHeroSprite;
      swordSprite.image.src = baseHeroObj.currentEquipmentSprite;


      collisionCtx.clearRect(0, 0, globalVars.width, globalVars.height);



      backgroundSprite.cropChange(baseHeroObj.cameraX + globalVars.offscreenBoundaryTotal, baseHeroObj.cameraY + globalVars.offscreenBoundaryTotal);
      foregroundSprite.cropChange(baseHeroObj.cameraX + globalVars.offscreenBoundaryTotal, baseHeroObj.cameraY + globalVars.offscreenBoundaryTotal);
      collisionSprite.cropChange(baseHeroObj.cameraX + globalVars.offscreenBoundarySide, baseHeroObj.cameraY + globalVars.offscreenBoundarySide);
      // collisionSprite.cropChange(baseHeroObj.cameraX, baseHeroObj.cameraY);


      // makes the canvases render a frame
      window.requestAnimationFrame(animate);

      // renders collision sprite, which is behind the background and not visible on canvas
      // you can change the z-index of the collision div in the css if you want to see it visualized
      // collisionSprite.draw();



      collisionCtx.drawImage(
            collisionSprite.image,
            collisionSprite.crop.x,
            collisionSprite.crop.y,
            globalVars.width,
            globalVars.height,
            collisionSprite.position.x,
            collisionSprite.position.y,
            globalVars.width,
            globalVars.height
          );
        // renders current background sprite
        // backgroundSprite.draw();
        backgroundCtx.drawImage(
          backgroundSprite.image,
          backgroundSprite.crop.x - globalVars.offscreenBoundaryTotal,
          backgroundSprite.crop.y - globalVars.offscreenBoundaryTotal,
          globalVars.width,
          globalVars.height,
          backgroundSprite.position.x - globalVars.offscreenBoundarySide,
          backgroundSprite.position.y - globalVars.offscreenBoundarySide,
          globalVars.width,
          globalVars.height
      );

      foregroundCtx.globalAlpha = 1;


      animatedObjectsRender(
        grassPatch1.definition(),
        baseHeroObj,
        backgroundCtx,
        foregroundCtx,
        collisionCtx,
        dataVisCtx
      );
      animatedObjectsRender(
        grassPatch2.definition(),
        baseHeroObj,
        backgroundCtx,
        foregroundCtx,
        collisionCtx,
        dataVisCtx
      );
      animatedObjectsRender(
        grassPatch3.definition(),
        baseHeroObj,
        backgroundCtx,
        foregroundCtx,
        collisionCtx,
        dataVisCtx
      );
      animatedObjectsRender(
        barrelPatch.definition(),
        baseHeroObj,
        backgroundCtx,
        foregroundCtx,
        collisionCtx,
        dataVisCtx
      );
      foregroundCtx.globalAlpha = 0.85;
      // console.log('after animated objects render', baseHeroObj)



      // let startTime = performance.now()
      // let endTime = performance.now()
      // console.log(`took ${endTime - startTime} milliseconds`)


      const enemyUpdateArr = enemyUpdate(
        wolfenGroup,
        baseHeroObj,
        dropItemArr,
        collisionCtx,
        dataVisCtx
        );
        // console.log('enemy update arr', enemyUpdateArr[1])
        wolfenGroup = enemyUpdateArr[0];
        baseHeroObj = enemyUpdateArr[1];
        // console.log('enemy update arr', baseHeroObj)
        dropItemArr = enemyUpdateArr[2];



        enemyRender(wolfenGroup, baseHeroObj, spriteCtx, "back");

      dropItemArr = dropItemRender(dropItemArr, spriteCtx, {x: cursorX, y: cursorY}) // renders items that are on the ground


      baseHeroObj = heroRender(baseHeroObj, baseHeroSprite, swordSprite, spriteCtx)


      enemyRender(wolfenGroup, baseHeroObj, spriteCtx, "front");

      // this renders foreground objects with opacity so that you can see the hero behind them
      // foregroundSprite.draw();
      foregroundCtx.drawImage(
        foregroundSprite.image,
        foregroundSprite.crop.x - globalVars.offscreenBoundaryTotal,
        foregroundSprite.crop.y - globalVars.offscreenBoundaryTotal,
        globalVars.width,
        globalVars.height,
        foregroundSprite.position.x - globalVars.offscreenBoundarySide,
        foregroundSprite.position.y - globalVars.offscreenBoundarySide,
        globalVars.width,
        globalVars.height
    );
      baseHeroObj = hudRender(spriteCtx, cursorCtx, foregroundCtx, baseHeroObj);
      cursorRender(cursorCtx, cursor, cursorX, cursorY);

      // this was used to visualize the hitbox coordinate checkers for collision detection, might use again to tweak that
      // backgroundCtx.fillStyle = 'rgba(255, 0, 0, 1)'
      // backgroundCtx.fillRect( globalVars.heroStartXCoord - baseHeroObj.cameraX, globalVars.heroStartYCoord - baseHeroObj.cameraY, 8, 8)
      // dataVisCtx.fillStyle = 'rgba(0, 255, 0, 1)'
      // dataVisCtx.fillRect(baseHeroObj.eventX, baseHeroObj.eventY, 4, 4)
      // dataVisCtx.fillStyle = 'rgba(255, 0, 0, 1)'
      // dataVisCtx.fillRect(globalVars.middleX, globalVars.middleY, 4, 4) // shows true middle pixel of screen, at least as far as the pixel upscale allows



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

        // this clears the edges if the canvas is smaller than the current window size
        backgroundCtx.clearRect(globalVars.width - globalVars.offscreenBoundarySide, 0, globalVars.offscreenBoundarySide, globalVars.height);
        spriteCtx.clearRect(globalVars.width - globalVars.offscreenBoundarySide, 0, globalVars.offscreenBoundarySide, globalVars.height);
        foregroundCtx.clearRect(globalVars.width - globalVars.offscreenBoundarySide, 0, globalVars.offscreenBoundarySide, globalVars.height);
        cursorCtx.clearRect(globalVars.width - globalVars.offscreenBoundarySide, 0, globalVars.offscreenBoundarySide, globalVars.height);
        backgroundCtx.clearRect(0, globalVars.height - globalVars.offscreenBoundarySide, globalVars.width, globalVars.offscreenBoundarySide);
        spriteCtx.clearRect(0, globalVars.height - globalVars.offscreenBoundarySide, globalVars.width, globalVars.offscreenBoundarySide);
        foregroundCtx.clearRect(0, globalVars.height - globalVars.offscreenBoundarySide, globalVars.width, globalVars.offscreenBoundarySide);
        cursorCtx.clearRect(0, globalVars.height - globalVars.offscreenBoundarySide, globalVars.width, globalVars.offscreenBoundarySide);

        drawToComboCanvas([
          backgroundCanvas,
          spriteCanvas,
          foregroundCanvas,
          cursorCanvas,
          dataVisCanvas,
          // collisionCanvas
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
          style={{ height: globalVars.height, width: globalVars.width, position: 'relative'}}
        ></div>
        {/* <canvas id='collisionCanvas' ref={collisionCanvas} height={globalVars.height} width={globalVars.width}
        /> */}
        {/* <canvas id='backgroundCanvas' ref={backgroundCanvas} height={window.innerHeight} width={window.innerWidth} />
        <canvas id='spriteCanvas' ref={spriteCanvas} height={window.innerHeight} width={window.innerWidth} />
        <canvas id='foregroundCanvas' ref={foregroundCanvas} height={window.innerHeight} width={window.innerWidth} />
        <canvas id='cursorCanvas' ref={cursorCanvas} height={window.innerHeight} width={window.innerWidth} /> */}
        <canvas
          id="comboCanvas"
          ref={comboCanvas}
          height={globalVars.height} width={globalVars.width}
          // style={{ top: -globalVars.offscreenBoundarySide, left: -globalVars.offscreenBoundarySide }}
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
