import { combineReducers } from 'redux'

import ProfileReducer from '../modules/profile/ProfileReducer'
import LoadingReducer from '../modules/loading/LoadingReducer'
import MenuReducer from '../menu/MenuReducer'
import HomeReducer from '../modules/home/HomeReducer'
import LobbyReducer from '../modules/lobby/LobbyReducer'
import GameReducer from '../modules/game/GameReducer'
import ViewReducer from '../modules/common/ViewReducer'

const reducers = {
    profile: ProfileReducer,
    loading: LoadingReducer,
    menu: MenuReducer,
    home: HomeReducer,
    lobby: LobbyReducer,
    game: GameReducer,
    view: ViewReducer,
}

export default combineReducers( reducers )