const initialState = {
    modalView: null,

    alertView: null,
    alertConfig: {
        onPress: null,
    },
}

const SHOW_MODAL_BY_KEY = 'views/show-modal-by-key'
const SHOW_ALERT_BY_KEY = 'views/show-alert-by-key'

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

export default (state = initialState, action) => {
    switch(action.type){
        case SHOW_MODAL_BY_KEY:
            return { ...state, modalView: action.payload }
        case SHOW_ALERT_BY_KEY:
            return { ...state, alertView: action.payload }
        default:
            return state;
    }
}