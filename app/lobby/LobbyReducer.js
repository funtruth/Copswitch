import firebaseService from '../firebase/firebaseService'
import ownerModule from '../game/mods/ownerModule'
import playerModule from '../game/mods/playerModule'

const initialState = {
    roomId: null,
    modalView: null,
    activeListeners: [],

    username: null,
    owner: false,
    roomStatus: 'Lobby',
    lobbyList: [],
    placeList: [],
    place: null,
    activityLog: [],
}

const JOIN_ROOM = 'lobby/join_room'
const CHANGE_MODAL = 'lobby/change_modal'
const PUSH_NEW_LISTENER = 'lobby/push_new_listener'
const CLEAR_LISTENERS = 'lobby/clear_listeners'

const OWNER_LISTENER = 'lobby/room_owner_listener'
const NAME_LISTENER = 'lobby/name_listener'
const LOBBY_LISTENER = 'lobby/lobby_listener'
const PLACE_LISTENER = 'lobby/place_listener'
const SET_MY_PLACE = 'lobby/set_my_place'
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

export function pushNewListener(listenerRef){
    return (dispatch) => {
        dispatch({
            type: PUSH_NEW_LISTENER,
            payload: listenerRef
        })
    }
}

export function clearListeners(){
    return (dispatch, getState) => {
        const { activeListeners } = getState().room
        for(var i=0; i<activeListeners.length; i++){
            activeListeners[i].off()
        }
        dispatch({
            type: CLEAR_LISTENERS
        })
    }
}

export function newLobbyInfo(snap, listener){
    return (dispatch) => {
        switch(listener){
            case 'owner':
                if(snap.val() === firebaseService.getUid()){
                    ownerModule.ownerMode(true)
                    dispatch({
                        type: OWNER_LISTENER,
                        payload: snap.val() === firebaseService.getUid()
                    })
                }
                break
            case 'name':
                dispatch({
                    type: NAME_LISTENER,
                    payload: snap.val().name
                })
                break
            case 'lobby':
                dispatch({
                    type: LOBBY_LISTENER,
                    payload: snap.val()
                })
            case 'place':
                for(var i=0; i<snap.val().length; i++){
                    if(snap.val()[i] === firebaseService.getUid()){
                        dispatch({
                            type: SET_MY_PLACE,
                            payload: i
                        })
                    }
                }
                dispatch({
                    type: PLACE_LISTENER,
                    payload: snap.val()
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
        case PUSH_NEW_LISTENER:
            return { ...state, activeListeners: [...state.activeListeners, action.payload] }
        case CLEAR_LISTENERS:
            return { ...state, activeListeners: [] }
        case OWNER_LISTENER:
            return { ...state, owner: action.payload }
        case NAME_LISTENER:
            return { ...state, username: action.payload }
        case LOBBY_LISTENER:
            return { ...state, lobbyList: action.payload }
        case PLACE_LISTENER:
            return { ...state, placeList: action.payload }
        case SET_MY_PLACE:
            return { ...state, place: action.payload }
        case ROOM_STATUS_LISTENER:
            return { ...state, roomStatus: action.payload }
        default:
            return state;
    }

}