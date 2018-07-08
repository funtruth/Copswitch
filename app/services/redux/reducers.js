import { combineReducers } from 'redux'

import AppReducer from '../../modules/appState/AppReducer'
import MenuReducer from '../../menu/MenuReducer'
import HomeReducer from '../../modules/home/HomeReducer'
import LobbyReducer from '../../modules/lobby/LobbyReducer'
import GameReducer from '../../modules/game/GameReducer'
import OwnerReducer from '../../modules/game/engine/OwnerReducer'

const reducers = {
    appState: AppReducer,
    menu: MenuReducer,
    home: HomeReducer,
    lobby: LobbyReducer,
    game: GameReducer,
    owner: OwnerReducer
}

export default combineReducers( reducers )