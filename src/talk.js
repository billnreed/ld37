import inkjs from 'inkjs'
import Phaser from './phaser'

export default class Talk {
  constructor (game) {
    this.game = game
  }

  preload () {
    this.game.load.json('talk', 'assets/story.json')
  }

  create () {
    this.mainText = this.game.add.text(0, 0, '', { fill: '#ffffff' })
    this.story = new inkjs.Story(this.game.cache.getJSON('talk'))
    this.continueStory()
  }

  update () {

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
      const choiceText = this.game.add.text(0, i * 30 + (this.mainText.y + this.mainText.height + 20), choice.text, { fill: '#ffffff' })
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
