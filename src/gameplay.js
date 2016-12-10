import Phaser from './phaser'

export default class GamePlay {
  constructor(game) {
    this.game = this.game
  }

  preload() {
    this.game.load.image('room', 'assets/background_no_window.png')
    this.game.load.json('map', 'assets/map.json')
    this.game.load.image('pic', 'assets/window.png')
  }

  create() {

    this.game.stage.backgroundColor = '#0055ff'
// 'Bounce.easeInOut'
    //  Generate our motion data
    var motion = { x: 0 }
    var tween = this.game.add.tween(motion).to({ x: 200 }, 3000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
    waveform = tween.generateData(20)

    xl = waveform.length - 1

    var sprites = this.game.add.spriteBatch()

    slices = []

    var picWidth = this.game.cache.getImage('pic').width
    var picHeight = this.game.cache.getImage('pic').height

    var ys = 4

    for (var y = 0; y < Math.floor(picHeight / ys); y++) {
      var star = this.game.make.sprite(250, 45 + (y * ys), 'pic')
      
      star.crop(new Phaser.Rectangle(0, y * ys, picWidth, ys))

      star.ox = star.x

      star.cx = this.game.math.wrap(y * 2, 0, xl)

      star.anchor.set(0.5)
      sprites.addChild(star)
      slices.push(star)
    }
    
    const roomImage = this.game.add.image(0, 0, 'room')
    roomImage.scale.setTo(0.75, 0.75)
  }

  update () {
    for (var i = 0, len = slices.length; i < len; i++) {
      slices[i].x = slices[i].ox + waveform[slices[i].cx].x / 6

      slices[i].cx++

      if (slices[i].cx > xl) {
        slices[i].cx = 0
      }
    }
  }
}

var slices
var waveform

var xl
var cx = 0
