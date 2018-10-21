const initialState = {
    modalView: null,
}

const SHOW_MODAL_BY_KEY = 'views/show-modal-by-key'

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
        case SHOW_MODAL_BY_KEY:
            return { ...state, modalView: action.payload }
        default:
            return state;
    }
}