import Intro from './intro'
import GamePlay from './gameplay'
import game from './game'

game.state.add('Intro', new Intro(game))
game.state.add('Gameplay', new GamePlay(game))
game.state.start('Gameplay')
