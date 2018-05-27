import firebaseService from '../firebase/firebaseService'

const initialState = {
    roomId: null,
    modalView: null,
    username: null,
    owner: null,
    roomStatus: 'Lobby',
    activityLog: []
}

const JOIN_ROOM = 'lobby/join_room'
const CHANGE_MODAL = 'lobby/change_modal'

const OWNER_LISTENER = 'lobby/room_owner_listener'
const NAME_LISTENER = 'lobby/name_listener'
const ACTIVITY_LOG_LISTENER = 'lobby/activity_log_listener'
const ROOM_STATUS_LISTENER = 'lobby/status_listener'

export function joinRoom(roomId){
    return (dispatch) => {
        dispatch({
            type: JOIN_ROOM,
            payload: roomId
        })
    }
}

export function changeModalView(modalView){
    return (dispatch) => {
        dispatch({
            type: CHANGE_MODAL,
            payload: modalView
        })
    }
}

export function newLobbyInfo(snap, listenerPath){
    return (dispatch) => {
        switch(listenerPath){
            case 'owner':
                dispatch({
                    type: OWNER_LISTENER,
                    payload: snap.val() === firebaseService.getUid()
                })
                break
            case 'name':
                dispatch({
                    type: NAME_LISTENER,
                    payload: snap.val().name
                })
                break
            case 'log':
                dispatch({
                    type: ACTIVITY_LOG_LISTENER,
                    payload: snap 
                })
                break
            case 'roles':
            case 'status':
                dispatch({
                    type: ROOM_STATUS_LISTENER,
                    payload: snap.val()
                })
                break
            default:
        }
    }
}

export default (state = initialState, action) => {

    switch(action.type){
        case JOIN_ROOM:
            return { ...state, roomId: action.payload }
        case CHANGE_MODAL:
            return { ...state, modalView: action.payload }
        case OWNER_LISTENER:
            return { ...state, owner: action.payload }
        case NAME_LISTENER:
            return { ...state, username: action.payload }
        case ROOM_STATUS_LISTENER:
            return { ...state, roomStatus: action.payload }
        case ACTIVITY_LOG_LISTENER:
            return { ...state, activityLog: [{message: action.payload.val(), key: action.payload.key}, ...state.activityLog] }
        default:
            return state;
    }

}