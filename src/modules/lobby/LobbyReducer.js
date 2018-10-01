import { db } from '@services'
import {statusType, listenerType} from '../common/types'
import NavigationTool from '../navigation/NavigationTool'

import { setRoomInfo } from '../game/GameReducer'
import { ownershipMode } from '../game/engine/OwnerReducer'

const initialState = {
    activeListeners: [],

    owner: null,
    lobbyList: {},
    placeList: [],
    place: null,
    roleList: {},
    status: statusType.lobby,
}

/*
NOTES:

activeListeners holds firebase paths as strings relative to the roomRef.

placeList is kept as an ARRAY inside LobbyReducer in order to ensure order is kept,
Order of items in an OBJECT are not guaranteed to stay chronological.
cannot be kept as a SNAP because redux persist does not store snaps(?)
*/

const PUSH_LISTENER_PATH = 'lobby/push_listener_path'
const CLEAR_LISTENERS = 'lobby/clear_listeners'

const OWNER_LISTENER = 'lobby/room_owner_listener'
const LOBBY_LISTENER = 'lobby/lobby_listener'
const PLACE_LISTENER = 'lobby/place_listener'
const SET_MY_PLACE = 'lobby/set_my_place'
const ROLE_LIST_LISTENER = 'lobby/role_list_listener'
const ROOM_STATUS_LISTENER = 'lobby/status_listener'

const RESET = 'lobby/reset'

export function leaveLobby(){
    return (dispatch, getState) => {
        const { owner } = getState().lobby

        dispatch(clearListeners())
        
        if(owner) db.deleteRoom()
        else db.leaveLobby()

        NavigationTool.navigate("Home")
        dispatch({
            type: RESET
        })
    }
}

export function turnOnLobbyListeners() {
    return (dispatch) => {
        dispatch(lobbyListenerOn(listenerType.owner))
        dispatch(lobbyListenerOn(listenerType.lobby))
        dispatch(lobbyListenerOn(listenerType.place))
        dispatch(lobbyListenerOn(listenerType.roles))
        dispatch(lobbyListenerOn(listenerType.status))
    }
}

function lobbyListenerOn(listener){
    return (dispatch) => {
        let listenerRef = db.fetchRoomRef(listener)
        dispatch({
            type: PUSH_LISTENER_PATH,
            payload: listener
        })
        listenerRef.on('value', snap => {
            dispatch(newLobbyInfo(snap, listener))
        })
    }
}

function newLobbyInfo(snap, listener){
    return (dispatch, getState) => {
        if (!snap.val()) return
        var { lobby } = getState()
        let myUid = db.getUid()

        switch(listener){
            case listenerType.owner:
                let ownership = snap.val() === myUid
                dispatch(ownershipMode(ownership))
                dispatch({
                    type: OWNER_LISTENER,
                    payload: snap.val()
                })
                break
            case listenerType.lobby:
                let alivePlayers = 0;
                for (var i in snap.val()) {
                    if (!snap.val()[i].dead) alivePlayers++
                }
                dispatch(
                    setRoomInfo({
                        myInfo: snap.val()[myUid],
                        playerNum: alivePlayers,
                        triggerNum: ((alivePlayers - alivePlayers%2)/2) + 1
                    })
                )
                
                dispatch({
                    type: LOBBY_LISTENER,
                    payload: snap.val()
                })
                break
            case listenerType.place:
                let placeArr = []

                snap.forEach(child => {
                    placeArr.push(child.val())
                })
                dispatch({
                    type: SET_MY_PLACE,
                    payload: placeArr.indexOf(myUid)
                })
                dispatch({
                    type: PLACE_LISTENER,
                    payload: placeArr
                })
                break
            case listenerType.roles:
                dispatch({
                    type: ROLE_LIST_LISTENER,
                    payload: snap.val()
                })
                break
            case listenerType.status:
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
            let listenerRef = db.fetchRoomRef(activeListeners[i])
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

        //TODO show error message
        if (areThereDuplicateNames()) {

            return
        }

        let rolesLen = 0
        let lobbyLen = Object.keys(lobbyList).length

        for(var i in roleList){
            rolesLen += roleList[i]
        }

        if(rolesLen === lobbyLen){
            let statusRef = db.fetchRoomRef('status')
            statusRef.set(statusType.pregame)
        } else {
            //TODO show extra logic
        }
    }
}

const areThereDuplicateNames = (lobbyList) => {
    let names = {}
    for (uid in lobbyList) {
        if (names[lobbyList[uid].name]) return true
        names[lobbyList[uid].name] = true
    }
    return false
} 

export default (state = initialState, action) => {

    switch(action.type){
        case PUSH_LISTENER_PATH:
            return { ...state, activeListeners: [...state.activeListeners, action.payload] }
        case CLEAR_LISTENERS:
            return { ...state, activeListeners: [] }

        case OWNER_LISTENER:
            return { ...state, owner: action.payload }
        case LOBBY_LISTENER:
            return { ...state, lobbyList: action.payload }
        case PLACE_LISTENER:
            return { ...state, placeList: action.payload }
        case SET_MY_PLACE:
            return { ...state, place: action.payload }
        case ROLE_LIST_LISTENER:
            return { ...state, roleList: action.payload }
        case ROOM_STATUS_LISTENER:
            return { ...state, status: action.payload }
            
        case RESET: 
            return initialState
        default:
            return state;
    }

}