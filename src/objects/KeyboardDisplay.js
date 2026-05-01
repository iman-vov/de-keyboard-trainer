import Phaser from 'phaser'

// Real QWERTZ stagger: each row shifts right like a physical keyboard
// Q row is reference; A row shifts +0.5 key; Y row shifts +1.25 keys
const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä'],
  ['y', 'x', 'c', 'v', 'b', 'n', 'm'],
]

const KEY_W = 64
const KEY_H = 52
const GAP   = 6
const STEP  = KEY_W + GAP

// Vertical center of each row
const ROW_Y = [536, 594, 652]

// Horizontal stagger offsets (fraction of STEP) relative to Q row
const STAGGER = [0, 0.5, 1.25]

// Q row left edge so the full keyboard block looks centered on 1280px canvas
// Total width of Q row: 11 * 64 + 10 * 6 = 764px
// We want the keyboard block (including max stagger) centered
// Max right edge: startX + 764 + 1.25 * STEP = startX + 764 + 88 = startX + 852
// For that to be centered: startX = (1280 - 852) / 2 = 214
const BASE_LEFT = 214

export default class KeyboardDisplay {
  constructor(scene) {
    this.scene = scene
    this.keys  = {}

    // Keyboard panel background
    scene.add.rectangle(640, 608, 1280, 220, 0x06061a)
    scene.add.rectangle(640, 507, 1280, 4, 0x0d0d30)

    ROWS.forEach((row, ri) => {
      const startX = BASE_LEFT + STAGGER[ri] * STEP
      const y = ROW_Y[ri]

      row.forEach((letter, ci) => {
        const cx = startX + ci * STEP + KEY_W / 2
        const bg  = scene.add.image(cx, y, 'key_normal').setDisplaySize(KEY_W, KEY_H)
        const txt = scene.add.text(cx, y - 1, letter.toUpperCase(), {
          fontSize: '19px',
          fontFamily: 'monospace',
          fontStyle: 'bold',
          color: '#4a5a99'
        }).setOrigin(0.5)
        this.keys[letter] = { bg, txt }
      })
    })
  }

  setHint(letter) {
    this.clearHint()
    const key = this.keys[letter.toLowerCase()]
    if (!key) return
    key.bg.setTexture('key_hint')
    key.txt.setColor('#33bbff')
    this._hinted = letter.toLowerCase()
    this.scene.tweens.add({
      targets: key.bg,
      scaleX: 1.12, scaleY: 1.12,
      duration: 450,
      yoyo: true, repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  clearHint() {
    if (this._hinted) {
      this._resetKey(this._hinted)
      this._hinted = null
    }
  }

  flashKey(letter, correct) {
    const key = this.keys[letter.toLowerCase()]
    if (!key) return
    this.scene.tweens.killTweensOf(key.bg)
    key.bg.setTexture(correct ? 'key_correct' : 'key_wrong').setScale(1)
    key.txt.setColor(correct ? '#00ff88' : '#ff5555')
    this.scene.time.delayedCall(340, () => this._resetKey(letter.toLowerCase()))
  }

  _resetKey(letter) {
    const key = this.keys[letter]
    if (!key) return
    this.scene.tweens.killTweensOf(key.bg)
    key.bg.setTexture('key_normal').setScale(1)
    key.txt.setColor('#4a5a99')
  }
}
