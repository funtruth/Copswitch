import { combineReducers } from 'redux';

import MenuReducer from '../menu/MenuReducer';
import HomeReducer from '../home/HomeReducer';

const reducers = {
    home: HomeReducer,
    menu: MenuReducer
}

export default combineReducers( reducers )