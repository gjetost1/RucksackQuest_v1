import { animateDyingAndBloodDrain } from "./Animate";

const bloodDrain = (target, baseHero, enemyCollision) => {
  // handles blood draining of enemies
  if (
    baseHero.bloodDrainActive &&
    !enemyCollision &&
    target.data.dead &&
    target.data.currentBloodLevel > 0 &&
    baseHero.equipment.bloodTanks.currentFillTank
  ) {
    if (
      baseHero.equipment.bloodTanks.currentFillTank.data.currentVolume <
      baseHero.equipment.bloodTanks.currentFillTank.data.maxVolume
    ) {
      // animates blood effect on enemy corpse when draining
      // target.data.damageAnim.data.spriteAnimSpeed = 20;
      const animated = animateDyingAndBloodDrain(target.data.damageAnim);
      target.data.damageActive = animated[0];
      target.data.damageAnim = animated[1];
      target.data.currentBloodLevel -= baseHero.bloodDrainRate;
      baseHero.equipment.bloodTanks.currentFillTank.data.currentVolume +=
        baseHero.bloodDrainRate;
      baseHero.equipment.bloodTanks.bloodSound.play();
      if (target.data.currentBloodLevel <= 0) {
        target.crop.x = target.data.bloodlessFrame * target.data.blockSize;
        baseHero.equipment.bloodTanks.bloodSound.pause();
      }
      if (!baseHero.keys.e.pressed) {
        baseHero.equipment.bloodTanks.bloodSound.pause();
      }
      if (
        baseHero.equipment.bloodTanks.currentFillTank.data.currentVolume >
        baseHero.equipment.bloodTanks.currentFillTank.data.maxVolume
      ) {
        baseHero.equipment.bloodTanks.currentFillTank.data.currentVolume =
        baseHero.equipment.bloodTanks.currentFillTank.data.maxVolume;
        baseHero.equipment.bloodTanks.changeCurrentTank = false
        baseHero.equipment.bloodTanks.bloodSound.pause();
      }
    } else if (!baseHero.equipment.bloodTanks.changeCurrentFillTank) {
      baseHero.equipment.bloodTanks.changeCurrentFillTank = true;
      // console.log('tank change')
      baseHero.equipment.bloodTanks.bloodSound.pause();
    }
  } else if (baseHero.bloodDrainActive && enemyCollision) {
    baseHero.bloodDrainActive = false;
    baseHero.equipment.bloodTanks.bloodSound.pause();
  } else {
    baseHero.equipment.bloodTanks.bloodSound.pause();
  }

  return [target, baseHero]
}

export default bloodDrain
