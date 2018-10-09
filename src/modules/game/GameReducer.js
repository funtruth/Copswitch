const initialState = {
    nameState: 'name',
    bottomView: false,
}

const TOGGLE_NAME_STATE = 'game/toggle_name_state'
const TOGGLE_BOTTOM_VIEW = 'game/toggle-bottom-view'

export function toggleNameState() {
    return (dispatch, getState) => {
        const { nameState } = getState().ui

        dispatch({
            type: TOGGLE_NAME_STATE,
            payload: nameState === 'name' ? 'fullName' : 'name'
        })
    }
}

export function toggleBottomView() {
    return (dispatch) => {
        dispatch({
            type: TOGGLE_BOTTOM_VIEW
        })
    }
}

export default (state = initialState, action) => {
    switch(action.type){
        case TOGGLE_NAME_STATE:
            return { ...state, nameState: action.payload }
        case TOGGLE_BOTTOM_VIEW:
            return { ...state, bottomView: !state.bottomView }
        default:
            return state;
    }
}