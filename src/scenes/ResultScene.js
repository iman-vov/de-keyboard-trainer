import Phaser from 'phaser'
import { PLANETS } from '../data/levels.js'
import { getProgress, saveProgress } from '../utils/progress.js'
import { t } from '../utils/i18n.js'

export default class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene')
  }

  init(data) {
    this.planetId = data.planetId
    this.stars = data.stars
    this.hits = data.hits
    this.total = data.total
  }

  create() {
    this.saveResult()
    this.cameras.main.fadeIn(400)

    this.createBackground()
    this.sound.play('victory', { volume: 0.6 })
    this.showResults()
  }

  saveResult() {
    const p = getProgress()

    if (!p.stars[this.planetId] || this.stars > p.stars[this.planetId]) {
      p.stars[this.planetId] = this.stars
    }
    if (!p.completedLevels.includes(this.planetId)) {
      p.completedLevels.push(this.planetId)
    }

    const next = this.getNextPlanet()
    if (next && !p.unlockedPlanets.includes(next.id)) {
      p.unlockedPlanets.push(next.id)
    }

    saveProgress(p)
  }

  createBackground() {
    this.add.rectangle(640, 360, 1280, 720, 0x050510)
    const rng = this.makeRng(42)
    for (let i = 0; i < 120; i++) {
      this.add.circle(rng() * 1280, rng() * 720, rng() * 1.5 + 0.3, 0xffffff, rng() * 0.6 + 0.2)
    }
  }

  makeRng(seed) {
    let h = seed
    return () => {
      h = (h * 1664525 + 1013904223) & 0xffffffff
      return (h >>> 0) / 0xffffffff
    }
  }

  showResults() {
    const planet = PLANETS.find(p => p.id === this.planetId)

    this.add.text(640, 110, t('round_complete'), {
      fontSize: '52px',
      fontFamily: 'Georgia, serif',
      color: '#FFD700',
      stroke: '#000',
      strokeThickness: 5,
      shadow: { offsetX: 0, offsetY: 0, color: '#FFD700', blur: 30, fill: true }
    }).setOrigin(0.5)

    this.add.text(640, 178, `${t(planet.nameKey)}: ${this.hits} / ${this.total}`, {
      fontSize: '26px',
      fontFamily: 'Arial',
      color: '#aabbcc'
    }).setOrigin(0.5)

    this.showStars()
    this.showMessage()
    this.showButtons()
  }

  showStars() {
    for (let i = 0; i < 3; i++) {
      const x = 560 + i * 100
      const key = i < this.stars ? 'star_gold' : 'star_empty'
      const star = this.add.image(x, 290, key).setScale(0)
      this.tweens.add({
        targets: star,
        scaleX: 1.4,
        scaleY: 1.4,
        duration: 350,
        delay: 200 + i * 180,
        ease: 'Back.easeOut'
      })
    }
  }

  showMessage() {
    const msgs = {
      3: t('msg_perfect'),
      2: t('msg_great'),
      1: t('msg_good')
    }
    this.add.text(640, 380, msgs[this.stars], {
      fontSize: '30px',
      fontFamily: 'Arial',
      color: '#88ffaa'
    }).setOrigin(0.5)
  }

  showButtons() {
    const next = this.getNextPlanet()
    const hasNext = next !== null

    const backX = hasNext ? 490 : 640
    this.createButton(backX, 490, `← ${t('back_to_map')}`, () => {
      this.cameras.main.fadeOut(250, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('MenuScene'))
    })

    if (hasNext) {
      this.createButton(790, 490, `${t('next_planet')} →`, () => {
        this.cameras.main.fadeOut(250, 0, 0, 0)
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('GameScene', { planetId: next.id })
        })
      }, 0x003355, 0x0077cc)
    }

    // Play again
    this.createButton(640, 558, `↺ ${t('play_again')}`, () => {
      this.cameras.main.fadeOut(250, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene', { planetId: this.planetId })
      })
    }, 0x1a1a1a, 0x444444)
  }

  createButton(x, y, label, onClick, bg = 0x0d1a3a, stroke = 0x2244aa) {
    const btnBg = this.add.rectangle(x, y, 230, 46, bg)
      .setStrokeStyle(2, stroke)
      .setInteractive({ useHandCursor: true })

    const txt = this.add.text(x, y, label, {
      fontSize: '19px',
      fontFamily: 'Arial',
      color: '#ddeeff'
    }).setOrigin(0.5)

    btnBg.on('pointerover', () => {
      btnBg.setFillColor(Phaser.Display.Color.ValueToColor(bg).brighten(20).color)
      txt.setColor('#ffffff')
    })
    btnBg.on('pointerout', () => {
      btnBg.setFillColor(bg)
      txt.setColor('#ddeeff')
    })
    btnBg.on('pointerdown', onClick)
  }

  getNextPlanet() {
    const idx = PLANETS.findIndex(p => p.id === this.planetId)
    return idx >= 0 && idx < PLANETS.length - 1 ? PLANETS[idx + 1] : null
  }
}
