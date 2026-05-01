import Phaser from 'phaser'
import { PLANETS } from '../data/levels.js'
import { t } from '../utils/i18n.js'
import Jedi from '../objects/Jedi.js'
import FallingLetter from '../objects/FallingLetter.js'
import KeyboardDisplay from '../objects/KeyboardDisplay.js'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  init(data) {
    this.planetId = data.planetId || 'coruscant'
  }

  create() {
    this.planet       = PLANETS.find(p => p.id === this.planetId)
    this.hits         = 0
    this.misses       = 0
    this.spawnedCount = 0
    this.activeLetter = null
    this.busy         = false
    this.paused       = false

    this.cameras.main.fadeIn(300)

    this.createBackground()
    this.createUI()
    // origin (0.5, 1) → feet at y — align with ground line at y=506
    this.jedi = new Jedi(this, 200, 506)
    this.keyboard = new KeyboardDisplay(this)
    this.createPauseMenu()
    this.startMusic()

    this.input.keyboard.on('keydown', this.handleKey, this)
    this.time.delayedCall(600, () => this.spawnNext())
  }

  // ─── Music ───────────────────────────────────────────────────────────────

  startMusic() {
    this.sound.stopByKey('bg_game')
    this.bgMusic = this.sound.add('bg_game', { loop: true, volume: 0.25 })
    this.bgMusic.play()
  }

  stopMusic() {
    this.bgMusic?.stop()
  }

  // ─── Background ──────────────────────────────────────────────────────────

  createBackground() {
    const bg = this.add.image(640, 260, `bg_${this.planetId}`).setOrigin(0.5, 0.5)
    const scaleX = 1280 / bg.width
    const scaleY = 520  / bg.height
    bg.setScale(Math.max(scaleX, scaleY))

    this.add.rectangle(640, 508, 1280, 3, 0x1a1a4a, 0.5)
    this.add.rectangle(640, 615, 1280, 215, 0x07071a)
  }

  // ─── UI ──────────────────────────────────────────────────────────────────

  createUI() {
    this.add.text(20, 18, t(this.planet.nameKey), {
      fontSize: '22px', fontFamily: 'Arial', fontStyle: 'bold', color: '#aabbff'
    })

    this.add.rectangle(640, 20, 500, 18, 0x111133).setStrokeStyle(1, 0x333366)
    this.progressBar = this.add.rectangle(390, 20, 0, 14, 0x0066ff).setOrigin(0, 0.5)

    this.scoreText = this.add.text(1260, 18, `0/${this.planet.lettersPerRound}`, {
      fontSize: '20px', fontFamily: 'Arial', color: '#FFD700'
    }).setOrigin(1, 0)

    // Music toggle
    this.musicVol = 0.25
    this.musicBtn = this.add.text(26, 695, '🔊', {
      fontSize: '22px', backgroundColor: '#0a0a1a', padding: { x: 6, y: 3 }
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true })
    this.musicBtn.on('pointerdown', () => {
      this.musicVol = this.musicVol > 0 ? 0 : 0.25
      this.bgMusic?.setVolume(this.musicVol)
      this.musicBtn.setText(this.musicVol > 0 ? '🔊' : '🔇')
    })

    // ESC hint
    this.add.text(80, 695, t('esc_hint'), {
      fontSize: '14px', color: '#334455', fontFamily: 'Arial'
    }).setOrigin(0, 1)
  }

  // ─── Pause menu ──────────────────────────────────────────────────────────

  createPauseMenu() {
    this.pauseContainer = this.add.container(640, 360).setVisible(false).setDepth(50)

    const dim   = this.add.rectangle(0, 0, 1280, 720, 0x000000, 0.72).setOrigin(0.5)
    const panel = this.add.rectangle(0, 0, 360, 260, 0x080820).setStrokeStyle(2, 0x2244aa)
    const title = this.add.text(0, -95, t('paused'), {
      fontSize: '32px', fontFamily: 'Georgia', fontStyle: 'bold', color: '#FFD700'
    }).setOrigin(0.5)

    const btnContinue = this.makePauseBtn(0, -28, t('continue_game'), () => this.togglePause())
    const btnRestart  = this.makePauseBtn(0,  34, t('restart'),       () => {
      this.stopMusic()
      this.scene.start('GameScene', { planetId: this.planetId })
    })
    const btnMenu     = this.makePauseBtn(0,  96, t('back_to_map'),   () => {
      this.stopMusic()
      this.scene.start('MenuScene')
    })

    this.pauseContainer.add([dim, panel, title, ...btnContinue, ...btnRestart, ...btnMenu])

    // ESC toggles pause (but NOT during victory sequence)
    this.input.keyboard.on('keydown-ESC', () => {
      if (!this.roundEnded) this.togglePause()
    })
  }

  makePauseBtn(x, y, label, onClick) {
    const bg = this.add.rectangle(x, y, 280, 46, 0x0d1a3a).setStrokeStyle(1, 0x2244aa)
      .setInteractive({ useHandCursor: true })
    const txt = this.add.text(x, y, label, {
      fontSize: '19px', fontFamily: 'Arial', color: '#ccddf0'
    }).setOrigin(0.5)
    bg.on('pointerover',  () => bg.setFillColor(0x1a2e5a))
    bg.on('pointerout',   () => bg.setFillColor(0x0d1a3a))
    bg.on('pointerdown',  onClick)
    return [bg, txt]
  }

  togglePause() {
    this.paused = !this.paused
    this.pauseContainer.setVisible(this.paused)
    if (this.paused) {
      this.letterTween?.pause()
      this.bgMusic?.pause()
    } else {
      this.letterTween?.resume()
      if (this.musicVol > 0) this.bgMusic?.resume()
    }
  }

  // ─── Spawning ─────────────────────────────────────────────────────────────

  spawnNext() {
    if (this.spawnedCount >= this.planet.lettersPerRound) {
      this.endRound()
      return
    }

    const letters = this.planet.letters
    const letter  = letters[Math.floor(Math.random() * letters.length)]
    const x       = Phaser.Math.Between(350, 1100)

    this.activeLetter = new FallingLetter(this, x, letter)
    this.spawnedCount++

    if (this.planet.showHint) this.keyboard.setHint(letter)

    this.letterTween = this.tweens.add({
      targets:  this.activeLetter,
      y:        468,
      duration: this.planet.fallDuration,
      ease:     'Linear',
      onComplete: () => { if (this.activeLetter) this.onMissed() }
    })
  }

  // ─── Input ────────────────────────────────────────────────────────────────

  handleKey(event) {
    if (this.paused || this.busy || !this.activeLetter) return

    const pressed  = event.key.toLowerCase()
    const expected = this.activeLetter.letter

    if (pressed === expected) {
      this.onHit(pressed)
    } else if (this.planet.letters.includes(pressed)) {
      this.keyboard.flashKey(pressed, false)
    }
  }

  // ─── Hit / Miss ───────────────────────────────────────────────────────────

  onHit(letter) {
    this.busy = true
    this.letterTween?.stop()
    this.keyboard.flashKey(letter, true)
    this.keyboard.clearHint()
    this.hits++
    this.updateUI()

    const tile = this.activeLetter
    this.activeLetter = null

    this.sound.play('sword_swing', { volume: 0.7 })
    this.jedi.swing(() => {
      this.showSlash(tile.x, tile.y)
      this.showParticles(tile.x, tile.y)
      this.time.delayedCall(90, () => this.sound.play('letter_burst', { volume: 0.5 }))

      this.tweens.add({
        targets: tile, scaleX: 1.3, scaleY: 1.3, duration: 55,
        onComplete: () => {
          this.tweens.add({
            targets: tile, scaleX: 0, scaleY: 0, alpha: 0,
            duration: 155, ease: 'Back.easeIn',
            onComplete: () => {
              tile.destroy()
              this.busy = false
              this.time.delayedCall(320, () => this.spawnNext())
            }
          })
        }
      })
    })
  }

  onMissed() {
    this.busy = true
    this.keyboard.clearHint()
    this.misses++
    this.sound.play('miss', { volume: 0.5 })
    this.jedi.stumble()

    const tile = this.activeLetter
    this.activeLetter = null

    this.tweens.add({
      targets: tile, alpha: 0, y: tile.y + 30, duration: 250,
      onComplete: () => {
        tile.destroy()
        this.busy = false
        this.time.delayedCall(500, () => this.spawnNext())
      }
    })
  }

  // ─── Effects ─────────────────────────────────────────────────────────────

  showSlash(x, y) {
    const g = this.add.graphics()
    g.lineStyle(18, 0x0044cc, 0.2)
    g.beginPath(); g.moveTo(x - 55, y + 45); g.lineTo(x + 55, y - 45); g.strokePath()
    g.lineStyle(8, 0x0088ff, 0.55)
    g.beginPath(); g.moveTo(x - 55, y + 45); g.lineTo(x + 55, y - 45); g.strokePath()
    g.lineStyle(3, 0xaaddff, 1)
    g.beginPath(); g.moveTo(x - 55, y + 45); g.lineTo(x + 55, y - 45); g.strokePath()
    this.tweens.add({ targets: g, alpha: 0, duration: 280, ease: 'Power2', onComplete: () => g.destroy() })
  }

  showParticles(x, y) {
    const colors = [0x55ccff, 0x0099ff, 0xffffff, 0x88eeff, 0xFFD700]
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2
      const dist  = Phaser.Math.Between(35, 90)
      const dot   = this.add.circle(x, y, Phaser.Math.Between(2, 5), colors[i % colors.length])
      this.tweens.add({
        targets: dot,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0, scaleX: 0.2, scaleY: 0.2,
        duration: Phaser.Math.Between(280, 440), ease: 'Power2',
        onComplete: () => dot.destroy()
      })
    }
  }

  // ─── UI update ───────────────────────────────────────────────────────────

  updateUI() {
    const total = this.planet.lettersPerRound
    this.progressBar.width = (this.spawnedCount / total) * 500
    this.scoreText.setText(`${this.hits}/${total}`)
  }

  // ─── End round ───────────────────────────────────────────────────────────

  endRound() {
    this.roundEnded = true
    this.input.keyboard.off('keydown', this.handleKey, this)
    this.stopMusic()

    const total = this.planet.lettersPerRound
    const ratio = this.hits / total
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1

    // Show victory pose, then transition
    this.jedi.victory()
    this.time.delayedCall(1600, () => {
      this.cameras.main.fadeOut(400, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('ResultScene', { planetId: this.planetId, stars, hits: this.hits, total })
      })
    })
  }
}
