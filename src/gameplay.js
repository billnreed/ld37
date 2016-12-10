import Phaser from './phaser'

export default class GamePlay {
  constructor (game) {
    this.game = this.game
  }

  preload () {
    this.game.load.image('room', 'assets/room.png')
    this.game.load.json('map', 'assets/map.json')
    this.game.load.image('pic', 'assets/jim_sachs_time_crystal.png')
  }

  create () {
    const roomImage = this.game.add.image(0, 0, 'room')
    roomImage.scale.setTo(0.75, 0.75)

    const map = this.game.cache.getJSON('map')
    const hotspots = map.layers.find(layer => layer.name === 'Hotspots').objects
    const hotspotSprites = hotspots.map(spot => {
      var width = spot.width * 0.75 // example;
      var height = spot.height * 0.75 // example;
      var bmd = this.game.add.bitmapData(width, height)
      
      bmd.ctx.beginPath()
      bmd.ctx.rect(0, 0, width, height)
      bmd.ctx.fillStyle = '#ff0000'
      bmd.ctx.fill()

      const sprite = this.game.add.sprite(spot.x * 0.75, spot.y * 0.75, bmd)
      // sprite.scale.x = spot.width * 0.75
      // sprite.scale.y = spot.height * 0.75
      sprite.inputEnabled = true
      sprite.events.onInputOver.add(() => { this.hoverText.text = spot.name })
      sprite.events.onInputOut.add(() => { this.hoverText.text = '' })
    })

    this.hoverText = this.game.add.text(this.game.width / 2, this.game.height - 100, '')
  }

  update () {

  }
}
