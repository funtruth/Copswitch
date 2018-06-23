import { AsyncStorage } from 'react-native'
import firebaseService from '../firebase/firebaseService'
import NavigationTool from '../navigation/NavigationTool';
import { ownershipMode } from '../game/engine/OwnerReducer'

const LOBBY_KEY = 'LOBBY-KEY'

const initialState = {
    roomId: null,
    activeListeners: [],
    refreshed: false,

    username: null,
    owner: null,
    roomStatus: 'Lobby',
    lobbyList: [],
    placeList: [],
    place: null,
    log: [],
    roleList: []
}

const JOIN_ROOM = 'lobby/join_room'
const REFRESH_ROOM_ID = 'lobby/refresh_room_id'
const REFRESH_REDUCER = 'lobby/refresh_reducer'

const PUSH_NEW_LISTENER = 'lobby/push_new_listener'
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

        AsyncStorage.removeItem(LOBBY_KEY)
        NavigationTool.navigate("Home")
        dispatch({
            type: RESET
        })
    }
}

export function refreshLobbyReducer() {
    return (dispatch) => {
        console.log('checkpoint')
        AsyncStorage.getItem(LOBBY_KEY,(error,result) => {
            //TODO sometimes this doesn't return anything - major BUG
            console.log('error', error, 'result', result)
            dispatch({
                type: REFRESH_ROOM_ID,
                payload: result
            })
            dispatch({
                type: REFRESH_REDUCER
            })
        })
        console.log('finished ...?')
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
            type: PUSH_NEW_LISTENER,
            payload: listenerRef
        })
        listenerRef.on(listenerType, snap => {
            dispatch(newLobbyInfo(snap, listener))
        })
    }
}

function newLobbyInfo(snap, listener){
    return (dispatch) => {
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
                    payload: snap
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
                    payload: snap
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
            activeListeners[i].off()
        }
        dispatch({
            type: CLEAR_LISTENERS
        })
    }
}

export function startPregame() {
    return (dispatch, getState) => {
        const { roleList, lobbyList } = getState().lobby
        const roles = roleList.val()
        const lobby = lobbyList.val()
        let rolesLen = 0
        let lobbyLen = Object.keys(lobby).length

        for(var i in roles){
            rolesLen += roles[i]
        }

        if(rolesLen === lobbyLen){
            let statusRef = firebaseService.fetchRoomRef('status')
            statusRef.set('Starting')
        }
    }
}

export default (state = initialState, action) => {

    switch(action.type){
        case JOIN_ROOM:
            return { ...state, roomId: action.payload }
        case REFRESH_ROOM_ID:
            return { ...state, roomId: action.payload }
        case REFRESH_REDUCER:
            return { ...state, refreshed: true }
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