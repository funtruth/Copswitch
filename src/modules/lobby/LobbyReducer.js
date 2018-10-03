import _ from 'lodash'

import {db} from '@services'
import {statusType, listenerType} from '../common/types'
import NavigationTool from '../navigation/NavigationTool'

const initialState = {
    activeListeners: [],

    config: {
        owner: false,
        status: statusType.lobby,
        roles: [],
    },
    lobby: [],
    myInfo: {},
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

const LOBBY_LISTENER = 'lobby/lobby_listener'
const CONFIG_LISTENER = 'lobby/config-listener'
const RESET = 'lobby/reset'

export function leaveLobby(){
    return (dispatch, getState) => {
        const { owner } = getState().lobby.config

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
        dispatch(lobbyListenerOn(listenerType.config))
        dispatch(lobbyListenerOn(listenerType.lobby))
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
    return (dispatch) => {
        if (!snap.val()) return

        switch(listener){
            case listenerType.config:
                dispatch({
                    type: CONFIG_LISTENER,
                    payload: {
                        owner: snap.val().owner,
                        status: snap.val().status,
                        roles: _.sortBy(snap.val(), i => i),
                    }
                })
                break
            case listenerType.lobby:
                dispatch({
                    type: LOBBY_LISTENER,
                    payload: {
                        lobby: _.sortBy(snap.val(), i => i.joinedAt),
                        myInfo: snap.val()[db.getUid()],
                    }
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
        const { config, lobby } = getState().lobby
        const { roles } = config

        //TODO show error message
        if (areThereDuplicateNames()) {

            return
        }

        let rolesLen = 0
        let lobbyLen = Object.keys(lobby).length

        for(var i in roleList){
            rolesLen += roles[i]
        }

        if(rolesLen === lobbyLen){
            let statusRef = db.fetchRoomRef('status')
            statusRef.set(statusType.pregame)
        } else {
            //TODO show extra logic
        }
    }
}

const areThereDuplicateNames = (lobby) => {
    let names = {}
    for (uid in lobby) {
        if (names[lobby[uid].name]) return true
        names[lobby[uid].name] = true
    }
    return false
} 

export default (state = initialState, action) => {
    switch(action.type){
        case PUSH_LISTENER_PATH:
            return { ...state, activeListeners: [...state.activeListeners, action.payload] }
        case CLEAR_LISTENERS:
            return { ...state, activeListeners: [] }

        case CONFIG_LISTENER:
            return { ...state, config: action.payload }
        case LOBBY_LISTENER:
            return { ...state, ...action.payload }
            
        case RESET: 
            return initialState
        default:
            return state;
    }
}