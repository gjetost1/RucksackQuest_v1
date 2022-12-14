import globalVars from "./GlobalVars";
import { hudHeart, hudLungs} from "./HudObjects";
import veins from "../../assets/hud/veins_2.png";
import fatigue_veins from "../../assets/hud/fatigue_veins.png";
import ui_background from "../../assets/hud/UI_background.png";
import ui_background_2 from "../../assets/hud/UI_background_2.png";
// import baseHero from "./BaseHero";
import blood_tank_full_fx_src from '../../assets/sounds/hud/blood_tank_full.mp3'


let lastStam = 0;
let bloodAnimation = false;

const blood_tank_full_fx = new Audio(blood_tank_full_fx_src);
blood_tank_full_fx.volume = .3;

const veins_img = new Image();
veins_img.src = veins;

const fatigue_veins_img = new Image();
fatigue_veins_img.src = fatigue_veins;

const ui_background_img_left = new Image();
ui_background_img_left.src = ui_background;

const ui_background_img_right = new Image();
ui_background_img_right.src = ui_background_2;

// checks current bloodTanks and moves empties to the back of the queue
// also sets the first tank with blood in it as the active tank
const bloodTankSort = (baseHero) => {
  // console.log('sorting')
  baseHero.equipment.bloodTanks.inventory.sort((a, b) => {
    const tankA = a.data.currentVolume;
    const tankB = b.data.currentVolume;
    if (tankA > tankB) {
      return 1;
    } else if (tankB > tankA) {
      return -1;
    }
    return 0;
  });
  // console.log( baseHero.equipment.bloodTanks)
  return baseHero;
};


// bloodTankSet determines which blood tank should be filled next, and which one is active
const bloodTankSet = (baseHero) => {
  let firstTank = true;
  let nextTank = false
  for (let i = 0; i < baseHero.equipment.bloodTanks.inventory.length; i++) {
    const tank = baseHero.equipment.bloodTanks.inventory[i];
    if (firstTank) {
      firstTank = false
      baseHero.equipment.bloodTanks.currentTank = tank
      baseHero.equipment.bloodTanks.currentFillTank = tank
    }
    if (tank.data.currentVolume < tank.data.maxVolume) {
      // console.log(tank)
      baseHero.equipment.bloodTanks.currentFillTank = tank
    }
    if (nextTank) {
      baseHero.equipment.bloodTanks.currentTank = tank
      nextTank = false
    }
    if (tank.data.currentVolume <= 0) {
      nextTank = true
    }

  }

  return baseHero;
};

const bloodAnimate = (element) => {
  element.animCounter++;
  if (element.animCounter >= element.animFrames) {
    element.crop.x += element.blockSize;
    element.animCounter = 0;
    if (element.crop.x >= element.blockSize * element.totalAnimFrames) {
      element.crop.x = 0;
    }
  }
};

const bloodTankRender = (baseHero, cursorCtx, foregroundCtx, stamDrain) => {
  let tankCount = baseHero.equipment.bloodTanks.inventory.length - 1; // used to space out tanks properly on render
  let currentTankCount = 0 // used to render the active tank in the right position
  for (let i = 0; i < baseHero.equipment.bloodTanks.inventory.length; i++) {
    const el = baseHero.equipment.bloodTanks.inventory[i];
    if (el === baseHero.equipment.bloodTanks.currentTank) {
      currentTankCount = tankCount
    }


    // draw contents of tank first
    foregroundCtx.drawImage(
      el.contentsImage,
      el.crop.x,
      el.crop.y,
      el.blockSize,
      el.blockSize,
      el.position.x + globalVars.offscreenBoundarySide,
      perfectYPos(el) - el.blockSize * tankCount + globalVars.offscreenBoundarySide,
      el.blockSize,
      el.blockSize
    );
    // clears out contents that are sticking out underneath each tank,
    // which happens when the level is about 50% or less
    foregroundCtx.clearRect(
      el.position.x + globalVars.offscreenBoundarySide,
      el.position.y + el.blockSize - el.blockSize * tankCount + globalVars.offscreenBoundarySide,
      el.blockSize,
      el.blockSize
    );

    // draws tank container off image
    cursorCtx.drawImage(
      el.offImage,
      0,
      0,
      el.blockSize,
      el.blockSize,
      el.position.x + globalVars.offscreenBoundarySide,
      el.position.y - el.blockSize * tankCount + globalVars.offscreenBoundarySide,
      el.blockSize,
      el.blockSize
    );
    tankCount--;
  }

  // draws active tank on top of all rendered tanks
  const activeTank = baseHero.equipment.bloodTanks.currentTank // currently active tank
  const fillTank = baseHero.equipment.bloodTanks.currentFillTank
  // changes fill tanks if current one is full
  if (fillTank.data.currentVolume >= fillTank.data.maxVolume) {
    // console.log('current tank change')
    baseHero = bloodTankSet(baseHero);
  }
  if (baseHero.equipment.bloodTanks.tankDrainActive) {
     if (stamDrain > 0 && baseHero.currentVitality < baseHero.maxVitality) {
        activeTank.data.currentVolume -= stamDrain;
        bloodAnimation = true;
      } else if (
        baseHero.currentVitality >= baseHero.maxVitality &&
        activeTank.crop.x === 0
      ) {
        bloodAnimation = false;
        activeTank.crop.x = 0;
        activeTank.animCounter = 0;
      }
      if (activeTank.data.currentVolume <= 0) {
        activeTank.crop.x = 0
        blood_tank_full_fx.play()
        activeTank.data.currentVolume = 0
        baseHero = bloodTankSet(baseHero);
      }
      if (bloodAnimation) {
        bloodAnimate(activeTank);
      }

    if (baseHero.equipment.bloodTanks.changeCurrentFillTank) {
      baseHero.equipment.bloodTanks.changeCurrentFillTank = false;
      baseHero = bloodTankSet(baseHero);
    }


    cursorCtx.drawImage(
      activeTank.onImage,
      0,
      0,
      activeTank.blockSize,
      activeTank.blockSize,
      activeTank.position.x + globalVars.offscreenBoundarySide,
      activeTank.position.y - activeTank.blockSize * currentTankCount + globalVars.offscreenBoundarySide,
      activeTank.blockSize,
      activeTank.blockSize
    );
  } else {
    cursorCtx.drawImage(
      activeTank.offImage,
      0,
      0,
      activeTank.blockSize,
      activeTank.blockSize,
      activeTank.position.x + globalVars.offscreenBoundarySide,
      activeTank.y - activeTank.blockSize * currentTankCount + globalVars.offscreenBoundarySide,
      activeTank.blockSize,
      activeTank.blockSize
    );
  }
};

const perfectYPos = (element) => {
  if (element.data.currentVolume === element.data.maxVolume) {
    return element.position.y;
  }
  if (element.data.currentVolume <= 0) {
    return element.position.y + element.blockSize - element.blockSize / 4;
  }
  // console.log(element.blockSize - (Math.round(element.blockSize * (element.data.currentVolume / element.data.maxVolume) / globalVars.upscale)* globalVars.upscale))
  // console.log(element.data.currentVolume)
  // console.log(element.blockSize - (Math.round(element.blockSize * (element.data.currentVolume / element.data.maxVolume) / globalVars.upscale) * globalVars.upscale))
  return (
    element.position.y +
    element.blockSize / 2 -
    Math.round(
      (element.blockSize *
        (element.data.currentVolume / element.data.maxVolume)) /
        globalVars.upscale /
        2
    ) *
      globalVars.upscale +
    globalVars.upscale * 2
  );
};

let firstTankSort = true; // true if code is running for first time in session
let tankActivateCooldown = false;

const hudRender = (spriteCtx, cursorCtx, foregroundCtx, baseHeroObj) => {
  // console.log(baseHeroObj.data)
  let baseHero = baseHeroObj
  // console.log(baseHero)
  // runs every time game is booted up to make sure tanks are sorted
  if (firstTankSort) {
    baseHero = bloodTankSort(baseHero);
    baseHero = bloodTankSet(baseHero);
    firstTankSort = false;
  }

  // is negative if stamina is draining this frame, positive if it is growing
  const stamDrain = baseHero.currentVitality - lastStam;
  lastStam = baseHero.currentVitality;

  // activates bloodTank on key press
  if (baseHero.keys.x.pressed && !tankActivateCooldown) {
    baseHero.equipment.bloodTanks.bloodSound.pause();
    baseHero = bloodTankSet(baseHero);
    if (baseHero.equipment.bloodTanks.currentTank) {
      baseHero.equipment.bloodTanks.currentTank.crop.x = 0;
    }
    tankActivateCooldown = true;
    baseHero.equipment.bloodTanks.tankDrainActive = !baseHero.equipment.bloodTanks.tankDrainActive
    setTimeout(() => {
      tankActivateCooldown = false;
    }, 300);
  }

  if (baseHero.equipment.bloodTanks.changeCurrentTank) {
    console.log('changing current tank')
    baseHero.equipment.bloodTanks.changeCurrentTank = false
    baseHero = bloodTankSet(baseHero);
  }

  foregroundCtx.globalAlpha = 1;

  bloodTankRender(baseHero, cursorCtx, foregroundCtx, stamDrain);



  // left ui background
  foregroundCtx.drawImage(
    ui_background_img_left,
    0,
    0,
    384,
    192,
    globalVars.offscreenBoundarySide,
    globalVars.perfectHeight - 136 + globalVars.offscreenBoundarySide,
    384,
    192
  );

  // right ui background
  foregroundCtx.drawImage(
    ui_background_img_right,
    0,
    0,
    384,
    192,
    globalVars.perfectWidth - 384 + globalVars.offscreenBoundarySide,
    globalVars.perfectHeight - 136 + globalVars.offscreenBoundarySide,
    384,
    192
  );

  cursorCtx.drawImage(
    veins_img,
    0,
    0,
    256,
    64,
    104 + globalVars.offscreenBoundarySide,
    globalVars.perfectHeight - 100 + globalVars.offscreenBoundarySide,
    256,
    64
  );

  cursorCtx.drawImage(
    fatigue_veins_img,
    0,
    0,
    256,
    64,
    globalVars.perfectWidth - 360 + globalVars.offscreenBoundarySide,
    globalVars.perfectHeight - 100 + globalVars.offscreenBoundarySide,
    256,
    64
  );


  // does a pixel perfect obstruction of vitality level
  const veinsVitalityLevel =
    72 +
    Math.round(
      (256 * (baseHero.currentVitality / baseHero.maxVitality)) /
        globalVars.upscale
    ) *
      globalVars.upscale;

  cursorCtx.clearRect( //
    veinsVitalityLevel + globalVars.offscreenBoundarySide,
    globalVars.perfectHeight - 100 + globalVars.offscreenBoundarySide,
    256,
    64
  );

  foregroundCtx.globalAlpha = 0.85;

  // does a pixel perfect obstruction of fatigue level
  const veinsFatigueLevel =
  globalVars.perfectWidth - 72 -
    Math.round(
      (256 * (baseHero.currentFatigue / baseHero.maxFatigue)) /
        globalVars.upscale
    ) *
      globalVars.upscale;

      // console.log(veinsFatigueLevel)

  cursorCtx.clearRect( //
  veinsFatigueLevel - 260 + globalVars.offscreenBoundarySide,
    globalVars.perfectHeight - 100 + globalVars.offscreenBoundarySide,
    256 ,
    64
  );


  foregroundCtx.globalAlpha = 0.85;


  //animate blood container

  // if (bloodTank_1.animCounter >= bloodTank_1.animFrames) {
  //   bloodTank_1.crop.x += bloodTank_1.blockSize
  //   bloodTank_1.animCounter = 0
  //   if (bloodTank_1.crop.x >= bloodTank_1.blockSize * bloodTank_1.totalAnimFrames) {
  //     bloodTank_1.crop.x = 0
  //   }
  // }
  // bloodTank_1.animCounter++

  // maps speed of heart beat to remaining vitality
  hudHeart.animFrames = Math.floor(
    hudHeart.animFramesBase * (baseHero.currentVitality / baseHero.maxVitality)
  );

  if (hudHeart.animFrames <= hudHeart.animFramesMin) {
    // sets a minimum speed for heart beat
    hudHeart.animFrames = hudHeart.animFramesMin;
  }

  // draws hudHeart to cursor canvas
  cursorCtx.drawImage(
    hudHeart.image,
    hudHeart.crop.x,
    hudHeart.crop.y,
    hudHeart.blockSize,
    hudHeart.blockSize,
    hudHeart.position.x,
    hudHeart.position.y,
    hudHeart.blockSize,
    hudHeart.blockSize
  );

  if (hudHeart.animCounter >= hudHeart.animFrames) {
    hudHeart.crop.x += hudHeart.blockSize;
    hudHeart.animCounter = 0;
    if (hudHeart.crop.x >= hudHeart.blockSize * hudHeart.totalAnimFrames) {
      hudHeart.crop.x = 0;
    }
  }

  hudHeart.animCounter++;

  // maps speed of lung breaths to fatigue level
  hudLungs.animFrames = Math.floor(
    hudLungs.animFramesBase * (baseHero.currentFatigue / baseHero.maxFatigue)
  );

  if (hudLungs.animFrames <= hudHeart.animFramesMin) {
    // sets a minimum speed for lung breath
    hudLungs.animFrames = hudLungs.animFramesMin;
  }

  // draws hudLungs to cursor canvas
  cursorCtx.drawImage(
    hudLungs.image,
    hudLungs.crop.x,
    hudLungs.crop.y,
    hudLungs.blockSize,
    hudLungs.blockSize,
    hudLungs.position.x,
    hudLungs.position.y,
    hudLungs.blockSize,
    hudLungs.blockSize
  );

  if (hudLungs.animCounter >= hudLungs.animFrames) {
    hudLungs.crop.x += hudLungs.blockSize;
    hudLungs.animCounter = 0;
    if (hudLungs.crop.x >= hudLungs.blockSize * hudLungs.totalAnimFrames) {
      hudLungs.crop.x = 0;
    }
  }

  hudLungs.animCounter++;

  // baseHeroObj.data = baseHero

  // console.log('end of hud render', baseHero)
  return baseHero;

};

export default hudRender;
