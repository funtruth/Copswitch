const initialState = {
    nameState: 'name',
    lobbyModal: false,
}

const TOGGLE_NAME_STATE = 'game/toggle_name_state'
const SHOW_MODAL_BY_KEY = 'game/show-modal-by-key'

export function toggleNameState() {
    return (dispatch, getState) => {
        const { nameState } = getState().ui

        dispatch({
            type: TOGGLE_NAME_STATE,
            payload: nameState === 'name' ? 'fullName' : 'name'
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

export default (state = initialState, action) => {
    switch(action.type){
        case TOGGLE_NAME_STATE:
            return { ...state, nameState: action.payload }
        case SHOW_MODAL_BY_KEY:
            return { ...state, [`${action.payload}Modal`]: true }
        default:
            return state;
    }
}