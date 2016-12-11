var content = [
  'The sky above the port was the color of television, tuned to a dead channel.',
  '',
  "The dog's name was pizza butt."
]

var line = []

var wordIndex = 0
var lineIndex = 0

var wordDelay = 55
var lineDelay = 400

export default class Intro {
  constructor (game) {
    this.game = game
  }

  transition () {
    this.game.state.start('Gameplay')
  }

  preload () {
    this.game.load.audio('text', 'assets/text.wav')
  }

  create () {
    this.text = this.game.add.text(32, 32, '', { font: '15px Arial', fill: '#19de65' })

    this.text.inputEnabled = true
    this.text.events.onInputDown.add(this.transition, this)

    this.textsound = this.game.add.audio('text')

    this.nextLine()
  }

  nextLine () {
    if (lineIndex === content.length) {
      // We're finished
      return
    }

    //  Split the current line on spaces, so one word per array element
    line = content[lineIndex].split(' ')  // Word-wise murmur
    // line = content[lineIndex]  // Character-wise murmur

    //  Reset the word index to zero (the first word in the line)
    wordIndex = 0

    //  Call the 'nextWord' function once for each word in the line (line.length)
    this.game.time.events.repeat(wordDelay, line.length + 1, this.nextWord, this)

    //  Advance to the next line
    lineIndex++
  }

  nextCharacter () {
    //  Last word?
    if (wordIndex === line.length) {
      //  Add a carriage return
      this.text.text = this.text.text.concat('\n')

      //  Get the next line after the lineDelay amount of ms has elapsed
      this.game.time.events.add(lineDelay, this.nextLine, this)
    } else {
      //  Add the next word onto the text string, followed by a space
      this.text.text = this.text.text.concat(line[wordIndex])
      if (line[wordIndex] !== ' ') {
        this.textsound.play()
      }

      //  Advance the word index to the next word in the line
      wordIndex++
    }
  }
  nextWord () {
    //  Last word?
    if (wordIndex === line.length) {
      //  Add a carriage return
      this.text.text = this.text.text.concat('\n')

      //  Get the next line after the lineDelay amount of ms has elapsed
      this.game.time.events.add(lineDelay, this.nextLine, this)
    } else {
      //  Add the next word onto the text string, followed by a space
      this.text.text = this.text.text.concat(line[wordIndex] + ' ')
      this.textsound.play()

      //  Advance the word index to the next word in the line
      wordIndex++
    }
  }
}
