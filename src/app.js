import title from './title'
import gameplay from './gameplay'
import game from './game'

game.state.add('Title', title)
game.state.add('Gameplay', gameplay)
game.state.start('Title')
