const initialState = {
    visible: false,
    section: null,

    routes: [],
    
}

const TOGGLE_MENU = 'menu/toggle_menu'
const SECTION_CHANGED = 'menu/section_changed'

export function toggleMenu(payload){
    return (dispatch) => {
        dispatch({
            type: TOGGLE_MENU,
            payload: !payload
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

export default (state = initialState, action) => {

    switch(action.type){
        case TOGGLE_MENU:
            return { ...state, visible: action.payload }
        case SECTION_CHANGED:
            return { ...state, section: action.payload }
        default:
            return state;
    }

}