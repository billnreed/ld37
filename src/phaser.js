// eslint-disable-next-line spaced-comment
/// <reference path="../node_modules/phaser-ce/typescript/phaser.comments.d.ts" />
// This needs to be left as is, this nastiness is because Phaser
// isn't designed for module support
require('pixi.js')
const p2 = require('p2')
window.p2 = p2

const Phaser = require('phaser')
window.Phaser = Phaser
export default Phaser
