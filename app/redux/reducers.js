import { combineReducers } from 'redux'

import AppReducer from '../appState/AppReducer'
import MenuReducer from '../menu/MenuReducer'
import HomeReducer from '../home/HomeReducer'
import RoomReducer from '../room/RoomReducer'

const reducers = {
    appState: AppReducer,
    menu: MenuReducer,
    home: HomeReducer,
    room: RoomReducer
}

export default combineReducers( reducers )