import { combineReducers } from 'redux'

import LoadingReducer from '../modules/loading/LoadingReducer'
import MenuReducer from '../menu/MenuReducer'
import HomeReducer from '../modules/home/HomeReducer'
import LobbyReducer from '../modules/lobby/LobbyReducer'
import GameReducer from '../modules/game/GameReducer'
import OwnerReducer from '../modules/game/engine/OwnerReducer'

const reducers = {
    loading: LoadingReducer,
    menu: MenuReducer,
    home: HomeReducer,
    lobby: LobbyReducer,
    game: GameReducer,
    owner: OwnerReducer
}

export default combineReducers( reducers )