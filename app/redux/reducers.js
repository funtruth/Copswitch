import { combineReducers } from 'redux';

import HomeReducer from '../home/HomeReducer';

const reducers = {
    home: HomeReducer,
}

export default combineReducers( reducers )