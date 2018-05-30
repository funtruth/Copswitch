import { combineReducers } from 'redux'

import AppReducer from '../appState/AppReducer'
import MenuReducer from '../menu/MenuReducer'
import HomeReducer from '../home/HomeReducer'
import LobbyReducer from '../lobby/LobbyReducer'
import GameReducer from '../game/GameReducer'


const reducers = {
    appState: AppReducer,
    menu: MenuReducer,
    home: HomeReducer,
    lobby: LobbyReducer,
    game: GameReducer
}

export default combineReducers( reducers )