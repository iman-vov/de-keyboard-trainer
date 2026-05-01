import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    this.load.audio('sword_swing',  'assets/sounds/sword_swing.mp3')
    this.load.audio('letter_burst', 'assets/sounds/letter_burst.wav')
    this.load.audio('miss',         'assets/sounds/miss.wav')
    this.load.audio('victory',      'assets/sounds/victory.wav')
    this.load.audio('bg_game',      'assets/music/bg_game.mp3')

    this.load.image('jedi_idle',    'assets/characters/jedi_idle.png')
    this.load.image('jedi_swing',   'assets/characters/jedi_swing.png')
    this.load.image('jedi_stumble', 'assets/characters/jedi_stumble.png')
    this.load.image('jedi_victory', 'assets/characters/jedi_victory.png')

    this.load.image('bg_coruscant', 'assets/backgrounds/bg_coruscant.png')
    this.load.image('bg_tatooine', 'assets/backgrounds/bg_tatooine.png')
    this.load.image('bg_hoth',     'assets/backgrounds/bg_hoth.png')
    this.load.image('bg_dagobah',  'assets/backgrounds/bg_dagobah.png')
    this.load.image('bg_endor',    'assets/backgrounds/bg_endor.png')
  }

  create() {
    this.createLetterTileTexture()
    this.createBackgroundTextures()
    this.createStarTextures()
    this.createKeyTextures()
    this.scene.start('MenuScene')
  }

  createLetterTileTexture() {
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0x001433)
    g.fillRoundedRect(0, 0, 90, 90, 14)
    g.lineStyle(3, 0x0066cc)
    g.strokeRoundedRect(0, 0, 90, 90, 14)
    g.lineStyle(1, 0x0099ff, 0.4)
    g.strokeRoundedRect(5, 5, 80, 80, 11)
    g.generateTexture('letter_tile', 90, 90)
    g.destroy()

    // Hit burst
    const burst = this.make.graphics({ x: 0, y: 0, add: false })
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const x1 = 40 + Math.cos(angle) * 15
      const y1 = 40 + Math.sin(angle) * 15
      const x2 = 40 + Math.cos(angle) * 38
      const y2 = 40 + Math.sin(angle) * 38
      burst.lineStyle(3, 0x00ccff)
      burst.beginPath()
      burst.moveTo(x1, y1)
      burst.lineTo(x2, y2)
      burst.strokePath()
    }
    burst.generateTexture('hit_burst', 80, 80)
    burst.destroy()
  }

  createBackgroundTextures() {
    // All backgrounds are now real images loaded in preload() — nothing to generate
  }

  createStarTextures() {
    const drawStar = (g, color) => {
      const cx = 35, cy = 35, outerR = 32, innerR = 13
      const pts = []
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5 - Math.PI / 2
        const r = i % 2 === 0 ? outerR : innerR
        pts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) })
      }
      g.fillStyle(color)
      g.fillPoints(pts, true)
    }

    const gold = this.make.graphics({ x: 0, y: 0, add: false })
    drawStar(gold, 0xFFD700)
    gold.generateTexture('star_gold', 70, 70)
    gold.destroy()

    const empty = this.make.graphics({ x: 0, y: 0, add: false })
    drawStar(empty, 0x444466)
    empty.generateTexture('star_empty', 70, 70)
    empty.destroy()
  }

  createKeyTextures() {
    const normal = this.make.graphics({ x: 0, y: 0, add: false })
    normal.fillStyle(0x12123a)
    normal.fillRoundedRect(0, 0, 62, 50, 7)
    normal.lineStyle(2, 0x2a2a6a)
    normal.strokeRoundedRect(0, 0, 62, 50, 7)
    normal.generateTexture('key_normal', 62, 50)
    normal.destroy()

    const hint = this.make.graphics({ x: 0, y: 0, add: false })
    hint.fillStyle(0x00234a)
    hint.fillRoundedRect(0, 0, 62, 50, 7)
    hint.lineStyle(3, 0x0088ff)
    hint.strokeRoundedRect(0, 0, 62, 50, 7)
    hint.generateTexture('key_hint', 62, 50)
    hint.destroy()

    const correct = this.make.graphics({ x: 0, y: 0, add: false })
    correct.fillStyle(0x003300)
    correct.fillRoundedRect(0, 0, 62, 50, 7)
    correct.lineStyle(3, 0x00dd00)
    correct.strokeRoundedRect(0, 0, 62, 50, 7)
    correct.generateTexture('key_correct', 62, 50)
    correct.destroy()

    const wrong = this.make.graphics({ x: 0, y: 0, add: false })
    wrong.fillStyle(0x330000)
    wrong.fillRoundedRect(0, 0, 62, 50, 7)
    wrong.lineStyle(3, 0xdd0000)
    wrong.strokeRoundedRect(0, 0, 62, 50, 7)
    wrong.generateTexture('key_wrong', 62, 50)
    wrong.destroy()
  }
}
