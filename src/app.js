import Intro from './intro'
import GamePlay from './gameplay'
import Talk from './talk'
import game from './game'

game.state.add('Intro', new Intro(game))
game.state.add('Gameplay', new GamePlay(game))
game.state.add('Talk', new Talk(game))
game.state.start('Gameplay')
