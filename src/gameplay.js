import inkjs from 'inkjs'
import Phaser from './phaser'

import { loadMouseCursor, createMouseCursor, setMouseCursorState, hideMouseCursor, showMouseCursor, setHeldItem, releaseItem } from './mouse'

const wordDelay = 75
const inventoryWidth = 130

const observe = {
  'Pizza': {
    count: 0,
    text: ['I get so hungry in the morning ...']
  },
  'Hair': {
    count: 0,
    text: ['Wow, I have a great head of hair']
  },
  'Key': {
    count: 0,
    text: ['The key to my freedom, and more ...']
  },
  'Window': {
    count: 0,
    text: ["\"On either side the river lie\nLong fields of barley and of rye\"", "No ... I can't look ..."]
  },
  'Mirror': {
    count: 0,
    text: ['My only respite from this weary room', talkToMirror]
  },
  'Tassel': {
    count: 0,
    text: ['A little detail goes a long way']
  },
  'Book': {
    count: 0,
    text: ['Some poems by Alfred, Lord Tennyson. What a hack']
  },
  'Lantern': {
    count: 0,
    text: ['The lantern fills my heart with hope and longing']
  },
  'Yarn': {
    count: 0,
    text: ['This cursed yarn is all my hands have to play with']
  },
  'Scarf': {
    count: 0,
    text: ["What do I need a scarf for? I can't even leave this room, let alone venture outside"]
  },
  'Hook': {
    count: 0,
    text: ['A hook to hang a scarf on. What more could one ask for?']
  }
}

const inventory = [
  {
    name: 'Scarf',
    acquired: false,
    used: false,
    key: 'Scarf',
    usedWith: {
      'Lantern': {
        callback: scarfWithLantern,
        consumed: true
      }
    }
  },
  {
    name: 'Book',
    acquired: false,
    used: false,
    key: 'Book',
    usedWith: {
      'Mirror': {
        callback: bookWithMirror,
        consumed: false
      }
    }
  }
]

function talkToMirror () {
  if (!this.story.variablesState.$('mirror_alive')) {
    this.story.ChoosePathString('first_mirror')
    this.continueStory()
  } else {
    this.game.add.tween(this.mirrorGirl).to({ alpha: 0.5 }, 800, 'Linear', true)
    this.story.ChoosePathString('long_argument')
    this.continueStory().then(() => {
      if (this.story.variablesState.$('win')) {
        this.youWin()
      } else {
        this.youDie()
      }
    })
  }
}

function scarfWithLantern () {
  this.story.ChoosePathString('scarf_with_lantern')
  this.continueStory().then(() => this.youDie())
}

function bookWithMirror () {
  this.story.ChoosePathString('book_with_mirror')
  this.continueStory()
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

export default class GamePlay {
  constructor (game) {
    this.game = game
    this.mode = 'OBSERVE'
  }

  preload () {
    this.game.load.image('Basket', 'assets/basket.png')
    this.game.load.image('Background', 'assets/background.png')
    this.game.load.image('Book', 'assets/book.png')
    this.game.load.image('Lady', 'assets/Lady.png')
    this.game.load.image('Yarn', 'assets/yarn.png')
    this.game.load.image('EyeButton', 'assets/eyeButton.png')
    this.game.load.image('HandButton', 'assets/handButton.png')
    this.game.load.image('LadyArms', 'assets/arms.png')
    this.game.load.image('Scarf', 'assets/scarfWall.png')
    this.game.load.image('CutOutMirrorGirl', 'assets/CutOutMirrorGirl.png')

    this.game.load.image('GameOverWin', 'assets/gameover_win.png')
    this.game.load.image('GameOverDie', 'assets/gameover_die.png')

    this.game.load.atlasJSONHash('LadyHead', 'assets/ladyblink.png', 'assets/ladyblink.json')
    this.game.load.json('map', 'assets/map.json')
    this.game.load.audio('music', 'assets/Star Commander1.wav')
    this.game.load.audio('ClickButton', 'assets/clickButton.wav')
    this.game.load.audio('PickupItem', 'assets/pickupItem.wav')
    this.game.load.audio('text', 'assets/murmurs/mweep.wav')

    this.game.load.json('story', 'assets/test.json')

    loadMouseCursor.call(this)
  }

  create () {
    // Background music
    this.game.add.audio('music').loopFull()

    // Sound effects
    this.clickButtonSound = this.game.add.audio('ClickButton')
    this.pickupItemSound = this.game.add.audio('PickupItem')
    this.textsound = this.game.add.audio('text')

    const map = this.game.cache.getJSON('map')

    // Add all of the image layers from tiled
    const imageLayers = map.layers.filter(layer => layer.type === 'imagelayer')
    imageLayers.forEach(layer => {
      const x = layer.offsetx * 0.75 || 0
      const y = layer.offsety * 0.75 || 0
      if (layer.name === 'LadyHead') {
        const lady = this.game.add.sprite(x, y, 'LadyHead', 'LadyHead000')
        lady.scale.setTo(0.75, 0.75)
        lady.animations.add('blink', Phaser.Animation.generateFrameNames('LadyHead', 1, 4, '', 3), 10, false, false)
        this.game.time.events.loop(Phaser.Timer.SECOND * 3, () => lady.animations.play('blink'), this)
      } else if (layer.name === 'CutOutMirrorGirl') {
        this.mirrorGirl = this.game.add.sprite(x, y, layer.name)
        this.mirrorGirl.scale.setTo(0.75, 0.75)
        this.mirrorGirl.alpha = 0.0
      } else {
        const sprite = this.game.add.sprite(x, y, layer.name)
        sprite.scale.setTo(0.75, 0.75)

        // Give observe object a reference back to its visualization
        if (observe[layer.name]) {
          observe[layer.name].sprite = sprite
        }
      }
    })

    // Add the hotspots from tiled
    const hotspots = map.layers.find(layer => layer.name === 'Hotspots').objects
    hotspots.forEach(spot => {
      const width = spot.width * 0.75
      const height = spot.height * 0.75

      const bmd = this.game.add.bitmapData(width, height)

      bmd.ctx.beginPath()
      if (spot.ellipse) {
        bmd.ctx.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI)
      } else {
        bmd.ctx.rect(0, 0, width, height)
      }
      bmd.ctx.fillStyle = '#00ff00'
      bmd.ctx.fill()

      const x = spot.x * 0.75
      const y = spot.y * 0.75
      const sprite = this.game.add.sprite(x, y, bmd)

      // comment for DEBUG
      sprite.alpha = 0.0
      sprite.angle = spot.rotation
      sprite.boundsPadding = 0
      // sprite.width = spot.width * 0.75
      // sprite.height = spot.height * 0.75
      sprite.inputEnabled = true
      sprite.input.pixelPerfectOver = true
      sprite.events.onInputOver.add(() => {
        // Don't let the user touch objects when dialogue is present
        if (!(this.mode === 'OBSERVE' || this.mode === 'INTERACT')) return

        if (this.mode === 'INTERACT' && this.heldItem) {
          this.hoverText.text = `Use ${this.heldItem.name} with ${spot.name}`
        } else {
          this.hoverText.text = spot.name
        }

        setMouseCursorState('highlight')
      })
      sprite.events.onInputOut.add(() => {
        // Don't let the user touch objects when dialogue is present
        if (!(this.mode === 'OBSERVE' || this.mode === 'INTERACT')) return

        this.hoverText.text = ''
        setMouseCursorState('neutral')
      })
      sprite.events.onInputDown.add(() => {
        if (this.mode === 'OBSERVE') {
          const text = getObserveText(spot.name)
          if (typeof text === 'function') {
            text.call(this)
          } else {
            this.say(text)
          }
        } else if (this.mode === 'INTERACT') {
          if (this.heldItem) {
            this.tryUseItem(spot.name)
          } else {
            this.tryGetItem(spot.name)
          }
        } else {
          // Don't let the user touch objects when dialogue is present
        }
      })

      // Give the observe object a reference back to its hotspot
      if (observe[spot.name]) {
        observe[spot.name].hotspot = sprite
      }
    })

    this.hoverText = this.game.add.text(this.game.width / 2, this.game.height - 50, '', { fill: '#ffffff' })
    this.hoverText.stroke = '#000000'
    this.hoverText.strokeThickness = 4

    // Add dialogue
    this.dialogueGroup = this.game.add.group()

    this.speechText = this.game.add.text(140, 0, '', { fill: '#ffffff', wordWrap: true, wordWrapWidth: 800 }, this.dialogueGroup)
    this.speechText.stroke = '#000000'
    this.speechText.strokeThickness = 4
    this.speechText.visible = false

    const myBitmap = this.game.add.bitmapData(this.game.width, 250)
    const grd = myBitmap.context.createLinearGradient(0, 0, 0, 250)
    grd.addColorStop(0, 'black')
    grd.addColorStop(1, 'rgba(31,0,0,0.2)')
    myBitmap.context.fillStyle = grd
    myBitmap.context.fillRect(0, 0, this.game.width, 250)
    // const gradient = this.game.add.sprite(0, 0, myBitmap)
    // this.dialogueGroup.add(gradient)
    this.mainText = this.game.add.text(140, 0, '', { fill: '#ffffff', wordWrap: true, wordWrapWidth: 800 }, this.dialogueGroup)
    this.mainText.stroke = '#000000'
    this.mainText.strokeThickness = 4

    this.setupCursorButtons()
    this.updateEyeAndHandVisibilty()
    this.setupInventory()

    this.story = new inkjs.Story(this.game.cache.getJSON('story'))

    createMouseCursor.call(this)
  }

  switchMode (newMode) {
    if (this.mode === newMode) return
    if (newMode === 'TALKING') {
      this.hoverText.visible = false
      this.speechText.visible = true
      showMouseCursor()
    } else if (newMode === 'OBSERVE') {
      this.hoverText.visible = true
      this.speechText.visible = false
      showMouseCursor()
    } else if (newMode === 'INTERACT') {
      this.hoverText.visible = true
      this.speechText.visible = false
      showMouseCursor()
    } else if (newMode === 'DIALOGUE') {
      this.hoverText.visible = false
      this.speechText.visible = false
      showMouseCursor()
    }

    this.mode = newMode
    this.updateEyeAndHandVisibilty()
  }

  say (text) {
    const oldMode = this.mode
    this.switchMode('TALKING')
    this.speechText.text = text

    // Scale delay by the length of the text
    const delay = Phaser.Timer.SECOND * text.length * 0.05
    this.game.time.events.add(delay, () => this.switchMode(oldMode), this)
  }

  continueStory () {
    this.switchMode('DIALOGUE')

    this.mainText.text = ''
    this.mainText.alpha = 0.0

    return this.writeDialogue().then(state => {
      if (state === 'NO_MORE') {
        return this.endDialogue()
      } else if (state === 'MORE_TEXT') {
        return this.presentChoices()
      } else {
        throw new Error(`Unknown state ${state}`)
      }
    })
  }

  writeDialogue () {
    const sectionsPerPage = 4
    const sections = []

    // Generate story text - loop through available content
    while (this.story.canContinue) {
      // Get ink to generate the next paragraph
      const line = this.story.Continue()

      // Don't make a new section for a blank line
      if (line !== '') {
        // I think each character has a single line of dialogue, don't need to split up by name
        sections.push(line)
      }
    }

    let sectionIndex = 0

    // Tracks the number of sections that appear on screen at once
    let sectionCounter = 0

    // Display first section of text
    if (sections.length > 0) {
      ++sectionCounter
      this.nextLine(sections[sectionIndex])
      this.game.add.tween(this.mainText).to({ alpha: 1 }, 1000, 'Linear', true)
    } else {
      // Early out for when there is no more text to display
      // in this case, we don't want to register an input handler and wait
      return Promise.resolve('NO_MORE')
    }

    // Loop through the rest of text. Resolve promise when there is no more
    return new Promise((resolve, reject) => {
      const onDownHandler = () => {
        // Check if we are already murmuring, only allow clicks
        // after murmuring is completeu
        if (this.murmuring > 0) {
          return
        }

        ++sectionIndex

        if (sectionIndex < sections.length) {
          ++sectionCounter

          // Reset the displayed text once we've hit the onscreen section limit
          if (sectionCounter >= sectionsPerPage - 1) {
            this.mainText.text = ''
            sectionCounter = 0
          }

          this.nextLine(sections[sectionIndex])
        } else {
          // We hit the last section
          // Remove handler and resolve
          this.game.input.mousePointer.leftButton.onDown.remove(onDownHandler, this)
          if (this.haveMoreChoices()) {
            resolve('MORE_TEXT')
          } else {
            resolve('NO_MORE')
          }
        }
      }

      this.game.input.mousePointer.leftButton.onDown.add(onDownHandler, this)
    })
  }

  endDialogue () {
    return new Promise((resolve, reject) => {
      // Fade out text
      this.game.add.tween(this.mainText).to({ alpha: 0.0 }, 500, 'Linear', true)
                  .onComplete.add(() => {
                    this.mainText.text = ''
                    this.mainText.alpha = 0.0

                    this.switchMode('OBSERVE')
                    resolve()
                  })
    })
  }

  haveMoreChoices () {
    return this.story.currentChoices.length !== 0
  }

  presentChoices () {
    // At end of dialogue, switch back to regular OBSERVEion
    if (!this.haveMoreChoices()) {
      return new Promise((resolve, reject) => {
        const onDownHandler = () => {
          resolve(this.endDialogue())

          // Remove handler
          this.game.input.mousePointer.leftButton.onDown.remove(onDownHandler, this)
        }

        this.game.input.mousePointer.leftButton.onDown.add(onDownHandler, this)
      })
    }

    const choicesText = []
    const choicePromises = this.story.currentChoices.map((choice, i) => {
      const choiceText = this.game.add.text(140, i * 30 + (this.mainText.y + this.mainText.height + 20), choice.text, { fill: '#ffffff' }, this.dialogueGroup)
      choicesText.push(choiceText)
      choiceText.inputEnabled = true

      // Highlight text on hover
      choiceText.stroke = '#0099FF'
      choiceText.strokeThickness = 4
      choiceText.events.onInputOut.add(() => { choiceText.stroke = '#0099FF' })
      choiceText.events.onInputOver.add(() => { choiceText.stroke = '#de77ae' })

      // Click on choice
      return new Promise((resolve, reject) => {
        choiceText.events.onInputDown.add(() => {
          // Remove all existing choices
          choicesText.forEach(text => text.destroy())

          // Tell the story where to go next
          this.story.ChooseChoiceIndex(choice.index)

          // Aaand loop
          resolve(this.continueStory())
        }, this)
      })
    })

    // Fade in choices
    choicesText.forEach(text => {
      text.alpha = 0.1
      this.game.add.tween(text).to({ alpha: 1 }, 500, 'Linear', true)
    })

    return Promise.race(choicePromises)
  }

  setupCursorButtons () {
    this.handButton = this.game.add.button(this.game.world.width - 95, this.game.world.height - 85, 'HandButton', this.handButtonHandler, this, 0, 0, 0)
    this.handButton.scale.setTo(0.25, 0.25)
    this.handButton.onInputOver.add(() => { this.handButton.alpha = 1.0 })
    this.handButton.onInputOut.add(() => {
      if (this.mode !== 'INTERACT') this.handButton.alpha = 0.5
    })

    this.eyeButton = this.game.add.button(this.game.world.width - 200, this.game.world.height - 85, 'EyeButton', this.eyeButtonHandler, this, 0, 0, 0)
    this.eyeButton.scale.setTo(0.25, 0.25)
    this.eyeButton.onInputOver.add(() => { this.eyeButton.alpha = 1.0 })
    this.eyeButton.onInputOut.add(() => {
      if (this.mode !== 'OBSERVE') this.eyeButton.alpha = 0.5
    })
  }

  handButtonHandler () {
    // Don't let the user interact with these buttons when they are in talking or dialogue modes
    if (this.mode !== 'OBSERVE') return

    this.clickButtonSound.play()
    this.switchMode('INTERACT')
  }

  eyeButtonHandler () {
    // Don't let the user interact with these buttons when they are in talking or dialogue modes
    if (this.mode !== 'INTERACT') return

    this.clickButtonSound.play()
    this.switchMode('OBSERVE')
  }

  setupInventory () {
    const myBitmap = this.game.add.bitmapData(inventoryWidth, this.game.height)
    const grd = myBitmap.context.createLinearGradient(0, 0, inventoryWidth, 0)
    grd.addColorStop(0, 'black')
    grd.addColorStop(1, 'rgba(31,0,0,0.2)')
    myBitmap.context.fillStyle = grd
    myBitmap.context.fillRect(0, 0, inventoryWidth, this.game.height)

    const gradient = this.game.add.sprite(-inventoryWidth, 0, myBitmap)
    gradient.isOpen = false
    this.dialogueGroup.add(gradient)

    const basket = this.game.add.button(0, this.game.world.height - 120, 'Basket', () => {
      if (gradient.isOpen) {
        this.game.add.tween(gradient).to({ x: -inventoryWidth }, 200, Phaser.Easing.Cubic.In, true)
        gradient.isOpen = false
      } else {
        this.game.add.tween(gradient).to({ x: 0 }, 200, Phaser.Easing.Cubic.In, true)
        gradient.isOpen = true
      }

      this.clickButtonSound.play()
    }, this, 0, 0, 0)

    basket.onInputOver.add(() => { basket.alpha = 1.0 })
    basket.onInputOut.add(() => {
      if (!gradient.isOpen) basket.alpha = 0.5
    })

    basket.scale.setTo(0.5, 0.5)
    basket.alpha = 0.5

    // Add items in inventory as children of the background gradient so they move relatively
    this.setupInventoryItems().forEach(sprite => gradient.addChild(sprite))
  }

  setupInventoryItems () {
    let accumItemHeight = 0
    return inventory.map((item, i) => {
      const sprite = this.game.add.sprite(0, accumItemHeight, item.key, i)

      // Accumulate the height of the items as they are added,
      // so we can position them correctly
      const image = this.game.cache.getImage(item.key)
      accumItemHeight += image.height + 10

      // If the item is too wide for the inventory, scale it to fit
      if (image.width > inventoryWidth) {
        const scale = inventoryWidth / image.width
        sprite.scale.setTo(scale, scale)
      }

      item.sprite = sprite
      sprite.inputEnabled = true

      sprite.events.onInputDown.add(() => {
        this.holdItem(item)
      })

      sprite.visible = item.acquired

      return sprite
    })
  }

  resetInventoryVisibility () {
    return inventory.map((item, i) => {
      item.sprite.visible = item.acquired && !(item.used)
    })
  }

  updateEyeAndHandVisibilty () {
    if (this.mode === 'OBSERVE') {
      this.eyeButton.alpha = 1.0
      this.handButton.alpha = 0.5
    } else if (this.mode === 'INTERACT') {
      this.eyeButton.alpha = 0.5
      this.handButton.alpha = 1.0
    } else {
      this.eyeButton.alpha = 0.0
      this.handButton.alpha = 0.0
    }
  }

  holdItem (item) {
    this.switchMode('INTERACT')

    if (this.heldItem) {
      // Reset visiblity on previously held item
      this.heldItem.sprite.visible = this.heldItem.acquired
    }

    this.heldItem = item
    item.sprite.visible = false

    setHeldItem(this.heldItem)
  }

  tryUseItem (targetName) {
    if (!this.heldItem) {
      throw new Error(`Invalid state. No item is held`)
    }
    if (!this.heldItem.acquired) {
      throw new Error(`Invalid state. Held item ${this.heldItem.name} isn't acquired`)
    }

    const action = this.heldItem.usedWith[targetName]
    if (action.callback) {
      action.callback.call(this)
      if (action.consumed) {
        this.heldItem.used = true
      }

      // Release item from mouse cursor
      releaseItem()

      this.heldItem = null

      this.resetInventoryVisibility()
    } else {
      console.log(`Can't use with ${targetName}`)
    }
  }

  tryGetItem (name) {
    const item = inventory.find(item => item.name === name)
    if (item) {
      if (item.acquired) {
        throw new Error(`Invalid state. Item ${name} already acquired`)
      }

      // Remove item from scene
      if (observe[name] && observe[name].sprite) {
        observe[name].sprite.destroy()
        observe[name].hotspot.destroy()
      }

      // TODO: Generalize this logic
      if (name === 'Book') {
        this.story.variablesState.$('have_book', true)
      }

      this.pickupItemSound.play()

      item.acquired = true
      this.resetInventoryVisibility()
    } else {
      console.log(`Can't grab item ${name}`)
    }
  }

  youDie () {
    // Switch to dialogue so user can't interact with environment anymore
    this.switchMode('DIALOGUE')

    const image = this.game.cache.getImage('GameOverDie')
    const gameOver = this.game.add.image(this.game.width / 2 - image.width / 2, this.game.height / 2 - image.height / 2, 'GameOverDie')

    // Add to group to ensure mouse cursor can go over it
    this.dialogueGroup.add(gameOver)
  }

  youWin () {
    // Switch to dialogue so user can't interact with environment anymore
    this.switchMode('DIALOGUE')

    const image = this.game.cache.getImage('GameOverWin')
    const gameOver = this.game.add.image(this.game.width / 2 - image.width / 2, this.game.height / 2 - image.height / 2, 'GameOverWin')

    // Add to group to ensure mouse cursor can go over it
    this.dialogueGroup.add(gameOver)
  }

  // Following functions all for murmuring
  nextLine (line) {
    //  Split the current line on spaces, so one word per array element
    const splitLine = line.split(' ')  // Word-wise murmur

    // This counter controls when murmuring is finished
    this.murmuring = splitLine.length + 1

    //  Reset the word index to zero (the first word in the line)
    this.wordIndex = 0

    //  Call the 'nextWord' function once for each word in the line (line.length)
    this.game.time.events.repeat(wordDelay, splitLine.length + 1, this.nextWord, this, splitLine)
  }

  nextWord (line) {
    --this.murmuring

    //  Last word?
    if (this.wordIndex === line.length) {
      //  Add a carriage return
      this.mainText.text = this.mainText.text.concat('\n')
    } else {
      //  Add the next word onto the text string, followed by a space
      this.mainText.text = this.mainText.text.concat(line[this.wordIndex] + ' ')
      this.textsound.play()

      //  Advance the word index to the next word in the line
      this.wordIndex++
    }
  }
}
