const initialState = {
    visible: false,
    section: null,

    routes: ['home']
}

const TOGGLE_MENU = 'menu/toggle_menu'
const SECTION_CHANGED = 'menu/section_changed'
const NEW_SCREEN = 'menu/new_screen'
const CLEAR_SCREENS = 'menu/clear_screens'

export function toggleMenu(){
    return (dispatch, getState) => {
        const { visible } = getState().menu
        dispatch({
            type: TOGGLE_MENU,
            payload: !visible
        })
    }
}

export function changeSection(payload){
    return (dispatch) => {
        dispatch({
            type: SECTION_CHANGED,
            payload: payload
        })
    }
}

export function pushNewScreen(payload) {
    return (dispatch) => {
        dispatch({
            type: NEW_SCREEN,
            payload: payload
        })
    }
}

export function clearMenuScreens() {
    return (dispatch) => {
        dispatch({
            type: CLEAR_SCREENS
        })
    }
}

export default (state = initialState, action) => {

    switch(action.type){
        case TOGGLE_MENU:
            return { ...state, visible: action.payload }
        case SECTION_CHANGED:
            return { ...state, section: action.payload }
        case NEW_SCREEN:
            return { ...state, routes: [ ...state.routes, action.payload ]}
        case CLEAR_SCREENS:
            return { ...state, routes: ['home'] }
        default:
            return state;
    }

}