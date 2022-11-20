let attackAnimationCounter = 0 // incremented to set timing for attack animation frames
let attackAnimationMaxCount = 35 // higher number means slower attack animations

const attackRender = (heroCropX, heroSpriteSize, swordFx, attackAnimation) => {
  attackAnimationCounter++
  if (attackAnimationCounter < attackAnimationMaxCount / 4) {
    heroCropX = heroSpriteSize * 7
    swordFx.volume = 0.1;
    swordFx.play();
  } else if (attackAnimationCounter < (attackAnimationMaxCount / 4) * 2) {
    heroCropX = heroSpriteSize * 8
  } else if (attackAnimationCounter < attackAnimationMaxCount) {
    heroCropX = heroSpriteSize * 9
  } else if (attackAnimationCounter > attackAnimationMaxCount) {
    heroCropX = 0
    attackAnimationCounter = 0
    attackAnimation = false
  }
  return {attackAnimation, heroCropX}
}

export default attackRender
