import { firebaseService } from '@services'

initialState = {}

export function setProfile(profile) {
    return (dispatch) => {
        let myUid = firebaseService.getUid()
        firebaseService.update(`users/${myUid}`, profile)
    }
}

export default (state = initialState, action) => {
    switch(action.type){
        default:
            return state;
    }
}