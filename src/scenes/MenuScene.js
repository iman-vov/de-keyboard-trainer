import Phaser from 'phaser'
import { PLANETS } from '../data/levels.js'
import { getProgress, saveProgress } from '../utils/progress.js'
import { t, setLang } from '../utils/i18n.js'

const LANG_OPTIONS = [
  { code: 'de', label: 'DE 🇩🇪' },
  { code: 'ru', label: 'RU 🇷🇺' },
  { code: 'uk', label: 'UK 🇺🇦' },
]

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  create() {
    const progress = getProgress()
    setLang(progress.lang)

    this.createBackground()
    this.createTitle()
    this.createPlanetMap(progress)
    this.createLangSelector(progress)
  }

  createBackground() {
    this.add.rectangle(640, 360, 1280, 720, 0x050510)
    const rng = this.makeRng(99)
    for (let i = 0; i < 160; i++) {
      const x = rng() * 1280
      const y = rng() * 720
      const r = rng() * 1.6 + 0.3
      this.add.circle(x, y, r, 0xffffff, rng() * 0.7 + 0.3)
    }
  }

  makeRng(seed) {
    let h = seed
    return () => {
      h = (h * 1664525 + 1013904223) & 0xffffffff
      return (h >>> 0) / 0xffffffff
    }
  }

  createTitle() {
    this.add.text(640, 55, t('title'), {
      fontSize: '46px',
      fontFamily: 'Georgia, serif',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 5,
      shadow: { offsetX: 0, offsetY: 0, color: '#FFD700', blur: 20, fill: true }
    }).setOrigin(0.5)

    this.add.text(640, 108, t('subtitle'), {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#8899cc'
    }).setOrigin(0.5)
  }

  createPlanetMap(progress) {
    const cols = 3
    const xSpacing = 300
    const ySpacing = 190
    const startX = 640 - (cols - 1) * xSpacing / 2
    const startY = 290

    PLANETS.forEach((planet, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = startX + col * xSpacing
      const y = startY + row * ySpacing
      const unlocked = progress.unlockedPlanets.includes(planet.id)
      const stars = progress.stars[planet.id] || 0
      this.createPlanetButton(x, y, planet, unlocked, stars)
    })
  }

  createPlanetButton(x, y, planet, unlocked, stars) {
    const alpha = unlocked ? 1 : 0.45

    // Outer glow ring
    if (unlocked) {
      const glow = this.add.circle(x, y, 64, planet.accent, 0.15)
      this.tweens.add({
        targets: glow,
        scaleX: 1.15,
        scaleY: 1.15,
        alpha: 0,
        duration: 1800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    }

    const circle = this.add.circle(x, y, 55, planet.color).setAlpha(alpha)
    circle.setStrokeStyle(unlocked ? 3 : 1, unlocked ? planet.accent : 0x444466)

    const icon = this.add.text(x, y, unlocked ? planet.icon : '🔒', {
      fontSize: '30px'
    }).setOrigin(0.5).setAlpha(alpha)

    this.add.text(x, y + 72, t(planet.nameKey), {
      fontSize: '17px',
      fontFamily: 'Arial',
      fontStyle: unlocked ? 'bold' : 'normal',
      color: unlocked ? '#ffffff' : '#555577'
    }).setOrigin(0.5)

    if (stars > 0) {
      this.add.text(x, y + 94, '★'.repeat(stars) + '☆'.repeat(3 - stars), {
        fontSize: '17px',
        color: '#FFD700'
      }).setOrigin(0.5)
    }

    if (!unlocked) return

    circle.setInteractive({ useHandCursor: true })
    circle.on('pointerover', () => {
      this.tweens.add({ targets: [circle, icon], scaleX: 1.12, scaleY: 1.12, duration: 120 })
    })
    circle.on('pointerout', () => {
      this.tweens.add({ targets: [circle, icon], scaleX: 1, scaleY: 1, duration: 120 })
    })
    circle.on('pointerdown', () => {
      this.cameras.main.fadeOut(250, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene', { planetId: planet.id })
      })
    })
  }

  createLangSelector(progress) {
    const totalW = LANG_OPTIONS.length * 70
    const startX = 1280 - totalW / 2 - 20

    this.add.text(startX - totalW / 2 + 10, 690, t('language'), {
      fontSize: '14px',
      color: '#556677'
    }).setOrigin(0.5)

    LANG_OPTIONS.forEach(({ code, label }, i) => {
      const x = startX - totalW / 2 + i * 72 + 56
      const isActive = progress.lang === code

      const bg = this.add.rectangle(x, 690, 64, 28, isActive ? 0x1a2a5a : 0x0a0a2a)
        .setStrokeStyle(1, isActive ? 0x4466cc : 0x333355)
        .setInteractive({ useHandCursor: true })

      this.add.text(x, 690, label, {
        fontSize: '14px',
        color: isActive ? '#ffffff' : '#556688'
      }).setOrigin(0.5)

      bg.on('pointerdown', () => {
        const p = getProgress()
        p.lang = code
        saveProgress(p)
        setLang(code)
        this.scene.restart()
      })
    })
  }
}
