// renderArr is an array of all the sprite class elements
// that you want to render for the hero sprite -
// this includes the base hero sprite and any outfits or equipment

export const heroRender = (renderArr) => {
  for (let el of renderArr) {
    el.draw()
  }
}
