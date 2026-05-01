export default class Jedi {
  constructor(scene, x, y) {
    this.scene = scene
    this.x     = x
    this.baseY = y

    // Origin (0.5, 1) — pivot at feet so character stands on the ground line
    this.sprite = scene.add.image(x, y, 'jedi_idle')
      .setOrigin(0.5, 1)
      .setScale(0.55)
  }

  swing(onSlash) {
    const s = this.sprite
    s.setTexture('jedi_swing')
    scene_tweens_killAll(this.scene, s)

    this.scene.tweens.add({
      targets: s,
      x: this.x + 50,
      duration: 85,
      ease: 'Power2',
      onComplete: () => {
        onSlash?.()
        this.scene.tweens.add({
          targets: s,
          x: this.x,
          duration: 220,
          ease: 'Power1',
          onComplete: () => s.setTexture('jedi_idle')
        })
      }
    })
  }

  stumble() {
    const s = this.sprite
    scene_tweens_killAll(this.scene, s)
    s.setTexture('jedi_stumble')
    s.setTint(0xff9999)

    this.scene.tweens.add({
      targets: s,
      x: this.x - 18,
      duration: 75,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        s.setTexture('jedi_idle')
        s.clearTint()
        s.setX(this.x)
      }
    })
  }

  victory() {
    const s = this.sprite
    scene_tweens_killAll(this.scene, s)
    s.setTexture('jedi_victory')

    this.scene.tweens.add({
      targets: s,
      y: this.baseY - 18,
      duration: 260,
      yoyo: true,
      repeat: 3,
      ease: 'Sine.easeOut',
      onComplete: () => {
        s.setTexture('jedi_idle')
        s.setY(this.baseY)
      }
    })
  }
}

function scene_tweens_killAll(scene, target) {
  scene.tweens.killTweensOf(target)
  target.setX(target.x) // flush position
}
