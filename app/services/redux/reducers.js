import { combineReducers } from 'redux'

import AppReducer from '../../scenes/appState/AppReducer'
import MenuReducer from '../../scenes/menu/MenuReducer'
import HomeReducer from '../../scenes/home/HomeReducer'
import LobbyReducer from '../../scenes/lobby/LobbyReducer'
import GameReducer from '../../scenes/game/GameReducer'
import OwnerReducer from '../../scenes/game/engine/OwnerReducer'

const reducers = {
    appState: AppReducer,
    menu: MenuReducer,
    home: HomeReducer,
    lobby: LobbyReducer,
    game: GameReducer,
    owner: OwnerReducer
}

export default combineReducers( reducers )