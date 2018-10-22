import {gameViewType, lobbyViewType} from './types'

const initialState = {
    modalView: null,

    alertView: null,
    alertConfig: {
        onPress: null,
    },

    lobbyView: lobbyViewType.game,

    gameView: gameViewType.game,
}

const SHOW_MODAL_BY_KEY = 'views/show-modal-by-key'
const SHOW_ALERT_BY_KEY = 'views/show-alert-by-key'
const SHOW_LOBBY_VIEW_BY_KEY = 'views/show-lobby-view-by-key'
const SHOW_GAME_VIEW_BY_KEY = 'views/show-game-view-by-key'

export function showModalByKey(key) {
    return (dispatch) => {
        dispatch({
            type: SHOW_MODAL_BY_KEY,
            payload: key
        })
    }
}

export function showAlertByKey(key) {
    return (dispatch) => {
        dispatch({
            type: SHOW_ALERT_BY_KEY,
            payload: key
        })
    }
}

export function showLobbyViewByKey(key) {
    return (dispatch) => {
        dispatch({
            type: SHOW_LOBBY_VIEW_BY_KEY,
            payload: key
        })
    }
}

export function showGameViewByKey(key) {
    return (dispatch) => {
        dispatch({
            type: SHOW_GAME_VIEW_BY_KEY,
            payload: key
        })
    }
}

export default (state = initialState, action) => {
    switch(action.type){
        case SHOW_MODAL_BY_KEY:
            return { ...state, modalView: action.payload }
        case SHOW_ALERT_BY_KEY:
            return { ...state, alertView: action.payload }
        case SHOW_LOBBY_VIEW_BY_KEY:
            return { ...state, lobbyView: action.payload }
        case SHOW_GAME_VIEW_BY_KEY:
            return { ...state, gameView: action.payload } 
        default:
            return state;
    }
}