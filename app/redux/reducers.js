import { combineReducers } from 'redux';

import MenuReducer from '../menu/MenuReducer';
import HomeReducer from '../home/HomeReducer';

const reducers = {
    menu: MenuReducer,
    home: HomeReducer
}

export default combineReducers( reducers )