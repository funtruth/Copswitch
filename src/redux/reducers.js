import { combineReducers } from 'redux'

import ProfileReducer from '../modules/profile/ProfileReducer'
import LoadingReducer from '../modules/loading/LoadingReducer'
import MenuReducer from '../menu/MenuReducer'
import HomeReducer from '../modules/home/HomeReducer'
import LobbyReducer from '../modules/lobby/LobbyReducer'
import UIReducer from '../modules/gameState/UIReducer'

const reducers = {
    profile: ProfileReducer,
    loading: LoadingReducer,
    menu: MenuReducer,
    home: HomeReducer,
    lobby: LobbyReducer,
    ui: UIReducer,
}

export default combineReducers( reducers )