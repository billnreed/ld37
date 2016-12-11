import inkjs from 'inkjs'
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
    this.game.load.image('Background', 'assets/background.png')
    this.game.load.image('Lady', 'assets/Lady.png')
    this.game.load.json('map', 'assets/map.json')
    this.game.load.audio('hungry', 'assets/hungry.wav')
    this.game.load.audio('hair', 'assets/hair.wav')

    this.game.load.json('story', 'assets/story.json')

    loadMouseCursor.call(this)
  }

  create () {
    observeSounds['Pizza'] = this.game.add.audio('hungry')
    observeSounds['Hair'] = this.game.add.audio('hair')

    const map = this.game.cache.getJSON('map')

    // Add all of the image layers from tiled
    const imageLayers = map.layers.filter(layer => layer.type === 'imagelayer')
    imageLayers.forEach(layer => {
      const image = this.game.add.image(layer.offsetx * 0.75 || 0, layer.offsety * 0.75 || 0, layer.name)
      image.scale.setTo(0.75, 0.75)
    })

    const hotspots = map.layers.find(layer => layer.name === 'Hotspots').objects
    const hotspotSprites = hotspots.map(spot => {
      const width = spot.width * 0.75
      const height = spot.height * 0.75
      // Take the larger of the two dimensions to account for rotated objects
      const size = Math.max(width, height)
      const bmd = this.game.add.bitmapData(size, size)

      bmd.ctx.beginPath()
      if (spot.ellipse) {
        const rotation = (spot.rotation * Math.PI) / 180
        bmd.ctx.ellipse(size / 2, size / 2, width / 2, height / 2, rotation, 0, 2 * Math.PI)
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

    // Add dialogue
    this.dialogueGroup = this.game.add.group()

    const myBitmap = this.game.add.bitmapData(this.game.width, 250)
    const grd = myBitmap.context.createLinearGradient(0, 0, 0, 250)
    grd.addColorStop(0, 'black')
    grd.addColorStop(1, 'rgba(31,0,0,0.2)')
    myBitmap.context.fillStyle = grd
    myBitmap.context.fillRect(0, 0, this.game.width, 250)
    const gradient = this.game.add.sprite(0, 0, myBitmap)
    this.dialogueGroup.add(gradient)
    this.mainText = this.game.add.text(0, 0, '', { fill: '#ffffff' }, this.dialogueGroup)

    this.story = new inkjs.Story(this.game.cache.getJSON('story'))
    this.continueStory()

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

  continueStory () {
    this.mainText.text = ''
    this.mainText.alpha = 0.1

    // Generate story text - loop through available content
    while (this.story.canContinue) {
      // Get ink to generate the next paragraph
      const paragraphText = this.story.Continue()
      this.mainText.text += paragraphText
    }

    // Fade in text
    this.game.add.tween(this.mainText).to({ alpha: 1 }, 1000, 'Linear', true)

    // Present choices after a short delay
    this.game.time.events.add(Phaser.Timer.HALF, this.presentChoices, this)
  }

  presentChoices () {
    const choicesText = []
    this.story.currentChoices.forEach((choice, i) => {
      const choiceText = this.game.add.text(0, i * 30 + (this.mainText.y + this.mainText.height + 20), choice.text, { fill: '#ffffff' }, this.dialogueGroup)
      choicesText.push(choiceText)
      choiceText.inputEnabled = true

      // Highlight text on hover
      choiceText.stroke = '#de77ae'
      choiceText.strokeThickness = 0
      choiceText.events.onInputOut.add(() => { choiceText.strokeThickness = 0 })
      choiceText.events.onInputOver.add(() => { choiceText.strokeThickness = 4 })

      // Click on choice
      choiceText.events.onInputDown.add(() => {
        // Remove all existing choices
        choicesText.forEach(text => text.destroy())

        // Tell the story where to go next
        this.story.ChooseChoiceIndex(choice.index)

        // Aaand loop
        this.continueStory()
      }, this)
    })

    // Fade in choices
    choicesText.forEach(text => {
      text.alpha = 0.1
      this.game.add.tween(text).to({ alpha: 1 }, 1000, 'Linear', true)
    })
  }
}
