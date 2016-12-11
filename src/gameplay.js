import Phaser from './phaser'
import { loadMouseCursor, createMouseCursor, setMouseCursorState, hideMouseCursor, showMouseCursor } from './mouse'

const observe = {
  'Pizza': {
    count: 0,
    text: ['I get so hungry in the morning ...']
  },
  'Hair': {
    count: 0,
    text: ['Wow, I have a great head of hair.']
  },
  'Key': {
    count: 0,
    text: ['The key to my freedom, and more ...']
  },
  'Window': {
    count: 0,
    text: ['On either side the river lie.', "No ... I can't look ..."]
  }
}

function getObserveText (key) {
  const index = observe[key].count
  const text = observe[key].text[index]
  // If there are multiple observations, move to the next
  if (index < observe[key].text.length - 1) {
    ++observe[key].count
  }

  return text
}

const observeSounds = {}

export default class GamePlay {
  constructor (game) {
    this.game = game
    this.mode = 'INTERACT'
  }

  preload () {
    this.game.load.image('room', 'assets/background.png')
    this.game.load.json('map', 'assets/map.json')
    this.game.load.audio('hungry', 'assets/hungry.wav')
    this.game.load.audio('hair', 'assets/hair.wav')
    loadMouseCursor.call(this)
  }

  create () {
    const roomImage = this.game.add.image(0, 0, 'room')
    roomImage.scale.setTo(0.75, 0.75)

    observeSounds['Pizza'] = this.game.add.audio('hungry')
    observeSounds['Hair'] = this.game.add.audio('hair')

    const map = this.game.cache.getJSON('map')
    const hotspots = map.layers.find(layer => layer.name === 'Hotspots').objects
    const hotspotSprites = hotspots.map(spot => {
      const width = spot.width * 0.75
      const height = spot.height * 0.75
      const bmd = this.game.add.bitmapData(width, height)

      bmd.ctx.beginPath()
      if (spot.ellipse) {
        bmd.ctx.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI)
      } else {
        bmd.ctx.rect(0, 0, width, height)
      }
      bmd.ctx.fillStyle = '#ff0000'
      bmd.ctx.fill()

      const sprite = this.game.add.sprite(spot.x * 0.75, spot.y * 0.75, bmd)
      sprite.boundsPadding = 0
      // sprite.width = spot.width * 0.75
      // sprite.height = spot.height * 0.75
      sprite.inputEnabled = true
      sprite.events.onInputOver.add(() => {
        this.hoverText.text = spot.name
        setMouseCursorState('highlight')
      })
      sprite.events.onInputOut.add(() => {
        this.hoverText.text = ''
        setMouseCursorState('neutral')
      })
      sprite.events.onInputDown.add(() => {
        this.say(getObserveText(spot.name))
        if (observeSounds[spot.name]) observeSounds[spot.name].play()
      })
    })

    this.hoverText = this.game.add.text(this.game.width / 2, this.game.height - 100, '', { fill: '#ff0000' })
    this.speechText = this.game.add.text(this.game.width / 2, this.game.height - 100, '', { fill: '#ff0000' })
    this.speechText.visible = false

    createMouseCursor.call(this)
  }

  update () {

  }

  switchMode (newMode) {
    if (newMode === 'TALKING') {
      this.hoverText.visible = false
      this.speechText.visible = true
      hideMouseCursor()
    } else if (newMode === 'INTERACT') {
      this.hoverText.visible = true
      this.speechText.visible = false
      showMouseCursor()
    }
  }

  say (text) {
    const oldMode = this.mode
    this.switchMode('TALKING')
    this.speechText.text = text

    this.game.time.events.add(Phaser.Timer.SECOND * 3, () => this.switchMode(oldMode), this)
  }
}
