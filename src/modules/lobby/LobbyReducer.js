import { firebaseService } from '@services'
import { NavigationTool } from '@navigation';
import { ownershipMode } from '../game/engine/OwnerReducer'

const initialState = {
    inLobby: false,
    roomId: null,
    
    activeListeners: [],

    username: null,
    owner: null,
    roomStatus: 'Lobby',
    lobbyList: {},
    placeList: null,
    place: null,
    roleList: {}
}

/*
NOTES:

activeListeners holds firebase paths as strings relative to the roomRef.
This is because firebase ref objects cannot be persisted through redux

placeList is kept as a snap inside LobbyReducer in order to ensure order is kept.
Order of items in an object are not guaranteed to stay chronological
TODO: persist is changing placeList from a snap -> object
*/

const JOIN_ROOM = 'lobby/join_room'

const PUSH_LISTENER_PATH = 'lobby/push_listener_path'
const CLEAR_LISTENERS = 'lobby/clear_listeners'

const OWNER_LISTENER = 'lobby/room_owner_listener'
const NAME_LISTENER = 'lobby/name_listener'
const LOBBY_LISTENER = 'lobby/lobby_listener'
const PLACE_LISTENER = 'lobby/place_listener'
const SET_MY_PLACE = 'lobby/set_my_place'
const ROLE_LIST_LISTENER = 'lobby/role_list_listener'
const ROOM_STATUS_LISTENER = 'lobby/status_listener'

const RESET = 'lobby/reset'

export function joinRoom(roomId){
    return (dispatch) => {
        dispatch({
            type: JOIN_ROOM,
            payload: roomId
        })
    }
}

export function leaveLobby(){
    return (dispatch, getState) => {
        const { owner, username } = getState().lobby

        dispatch(clearListeners())
        
        if(owner) firebaseService.deleteRoom()
        else firebaseService.leaveLobby(username)

        NavigationTool.navigate("Home")
        dispatch({
            type: RESET
        })
    }
}

export function turnOnLobbyListeners() {
    return (dispatch) => {
        dispatch(lobbyListenerOn('owner','owner','value'))
        dispatch(lobbyListenerOn('name',`lobby/${firebaseService.getUid()}`,'value'))
        dispatch(lobbyListenerOn('lobby','lobby','value'))
        dispatch(lobbyListenerOn('place','place','value'))
        dispatch(lobbyListenerOn('roles','roles','value'))
        dispatch(lobbyListenerOn('status','status','value'))
    }
}

function lobbyListenerOn(listener,listenerPath,listenerType){
    return (dispatch) => {
        let listenerRef = firebaseService.fetchRoomRef(listenerPath)
        dispatch({
            type: PUSH_LISTENER_PATH,
            payload: listenerPath
        })
        listenerRef.on(listenerType, snap => {
            dispatch(newLobbyInfo(snap, listener))
        })
    }
}

function newLobbyInfo(snap, listener){
    return (dispatch) => {
        if (!snap.val()) return
        switch(listener){
            case 'owner':
                let ownership = snap.val() === firebaseService.getUid()
                dispatch(ownershipMode(ownership))
                dispatch({
                    type: OWNER_LISTENER,
                    payload: snap.val()
                })
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
                break
            case 'place':
                let myUid = firebaseService.getUid()
                let j = 0
                snap.forEach(child => {
                    if (child.val() === myUid){
                        dispatch({
                            type: SET_MY_PLACE,
                            payload: j
                        })
                    }
                    j++
                })
                dispatch({
                    type: PLACE_LISTENER,
                    payload: snap
                })
                break
            case 'roles':
                dispatch({
                    type: ROLE_LIST_LISTENER,
                    payload: snap.val()
                })
                break
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

function clearListeners(){
    return (dispatch, getState) => {
        const { activeListeners } = getState().lobby
        for(var i=0; i<activeListeners.length; i++){
            let listenerRef = firebaseService.fetchRoomRef(activeListeners[i])
            listenerRef.off()
        }
        dispatch({
            type: CLEAR_LISTENERS
        })
    }
}

export function startPregame() {
    return (dispatch, getState) => {
        const { roleList, lobbyList } = getState().lobby
        let rolesLen = 0
        let lobbyLen = Object.keys(lobbyList).length

        for(var i in roleList){
            rolesLen += roleList[i]
        }

        if(rolesLen === lobbyLen){
            let statusRef = firebaseService.fetchRoomRef('status')
            statusRef.set('Starting')
        } else {
            //TODO show extra logic
        }
    }
}

export default (state = initialState, action) => {

    switch(action.type){
        case JOIN_ROOM:
            return { ...state, inLobby: true, roomId: action.payload }

        case PUSH_LISTENER_PATH:
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
        case ROLE_LIST_LISTENER:
            return { ...state, roleList: action.payload }
        case ROOM_STATUS_LISTENER:
            return { ...state, roomStatus: action.payload }
            
        case RESET: 
            return initialState
        default:
            return state;
    }

}