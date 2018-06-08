import firebaseService from '../firebase/firebaseService'

const initialState = {
    loaded: false
}

const APP_LOADED = 'appState/app_loaded'

export function appStateLoaded() {
    return (dispatch) => {
        dispatch({
            type: APP_LOADED
        })
    }
}

export default (state = initialState, action) => {

    switch(action.type){
        case APP_LOADED:
            return { ...state, loaded: true }
        default:
            return state;
    }

}