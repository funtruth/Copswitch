const initialState = {
    section: null,
}

const SECTION_CHANGED = 'home/section_changed'

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
        case SECTION_CHANGED:
            return { ...state, section: action.payload }
        default:
            return state;
    }

}