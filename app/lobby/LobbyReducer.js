const initialState = {
    roomId: null
}

const JOIN_ROOM = 'lobby/join_room'

export function joinRoom(roomId){
    return (dispatch) => {
        dispatch({
            type: JOIN_ROOM,
            payload: roomId
        })
    }
}

export default (state = initialState, action) => {

    switch(action.type){
        case JOIN_ROOM:
            return { ...state, roomId: action.payload }
        default:
            return state;
    }

}