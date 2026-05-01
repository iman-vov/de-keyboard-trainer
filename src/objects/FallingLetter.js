import Phaser from 'phaser'

export default class FallingLetter extends Phaser.GameObjects.Container {
  constructor(scene, x, letter) {
    super(scene, x, -55)

    const tile = scene.add.image(0, 0, 'letter_tile')

    const text = scene.add.text(0, 2, letter.toUpperCase(), {
      fontSize: '42px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#55ccff',
      stroke: '#003366',
      strokeThickness: 3
    }).setOrigin(0.5)

    this.add([tile, text])
    this.letter = letter

    scene.add.existing(this)

    // Subtle floating animation while falling
    scene.tweens.add({
      targets: this,
      scaleX: 1.06,
      scaleY: 1.06,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }
}
