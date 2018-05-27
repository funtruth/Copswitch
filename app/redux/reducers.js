import { combineReducers } from 'redux'

import AppReducer from '../appState/AppReducer'
import MenuReducer from '../menu/MenuReducer'
import HomeReducer from '../home/HomeReducer'
import LobbyReducer from '../lobby/LobbyReducer'

const reducers = {
    appState: AppReducer,
    menu: MenuReducer,
    home: HomeReducer,
    lobby: LobbyReducer
}

export default combineReducers( reducers )