import { combineReducers } from 'redux'

import MenuReducer from '../menu/MenuReducer'
import HomeReducer from '../home/HomeReducer'
import LobbyReducer from '../lobby/LobbyReducer'

const reducers = {
    menu: MenuReducer,
    home: HomeReducer,
    lobby: LobbyReducer
}

export default combineReducers( reducers )