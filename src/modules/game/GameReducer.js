import {db} from '@services'

const initialState = {
    nameState: 'name',
    mainView: 'game',
    modalView: null,
    myReady: false,
}

const TOGGLE_NAME_STATE = 'game/toggle_name_state'
const SHOW_VIEW_BY_KEY = 'game/show-view-by-key'
const SHOW_MODAL_BY_KEY = 'game/show-modal-by-key'
const MY_READY_CHANGED = 'game/my-ready-changed'

export function toggleNameState() {
    return (dispatch, getState) => {
        const { nameState } = getState().ui

        dispatch({
            type: TOGGLE_NAME_STATE,
            payload: nameState === 'name' ? 'fullName' : 'name'
        })
    }
}

export function showViewByKey(key) {
    return (dispatch) => {
        dispatch({
            type: SHOW_VIEW_BY_KEY,
            payload: key
        })
    }
}

export function showModalByKey(key) {
    return (dispatch) => {
        dispatch({
            type: SHOW_MODAL_BY_KEY,
            payload: key
        })
    }
}

export function playerChoice(val) {
    return (dispatch, getState) => {
        const { loading } = getState()
        const { roomId } = loading
        const uid = db.getUid()
        db.update(
            `rooms/${roomId}`,
            {
                [`choice/${uid}`]: val,
                [`ready/${uid}`]: val !== null ? true : null,
            }
        )

        dispatch({
            type: MY_READY_CHANGED,
            payload: val !== null
        })
    }
}

export function myReadyChanged(bool) {
    return (dispatch) => {
        dispatch({
            type: MY_READY_CHANGED,
            payload: bool
        })
    }
}

export default (state = initialState, action) => {
    switch(action.type){
        case TOGGLE_NAME_STATE:
            return { ...state, nameState: action.payload }
        case SHOW_VIEW_BY_KEY:
            return { ...state, mainView: action.payload }
        case SHOW_MODAL_BY_KEY:
            return { ...state, modalView: action.payload }
        case MY_READY_CHANGED:
            return { ...state, myReady: action.payload }
        default:
            return state;
    }
}