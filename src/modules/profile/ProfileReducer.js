const initialState = {
    firstName: null,
    lastName: null,
    avatar: null,

    firstNameEdit: null,
    lastNameEdit: null,

    fullName: null
}

const UPDATE_PROPERTY = 'profile/update_property'

export function updateProperty(obj) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PROPERTY,
            payload: obj
        })
    }
}

//TODO not sure if I should save profiles to firebase

export default (state = initialState, action) => {
    switch(action.type){
        case UPDATE_PROPERTY:
            return { ...state, ...action.payload }
        default:
            return state;
    }
}