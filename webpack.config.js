'use strict'

require('webpack')
const path = require('path')
const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')

module.exports = {
  context: path.join(__dirname, '/src'),
  entry: {
    app: './app.js'
  },
  output: {
    path: path.join(__dirname, 'deploy'),
    filename: '[name].bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, '/src')
  },
  // From https://github.com/photonstorm/phaser/tree/master/v2-community#browserify
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /pixi.js/, loader: 'script' }
    ]
  },
  resolve: {
    alias: {
      'phaser': phaser,
      'pixi.js': pixi
    }
  },
  devtool: 'source-map'
}
