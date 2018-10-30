import _ from 'lodash'
import * as helpers from '../common/helpers'

import {db} from '@services'
import {statusType, listenerType} from '../common/types'
import { myReadyChanged } from '../game/GameReducer';

const initialState = {
    //lobby
    config: {
        owner: null,
        status: statusType.lobby,
        roles: [],
    },
    lobby: [],
    myInfo: {
        name: '',
    },

    //game
    gameState: {
        counter: 0,
        phase: 0,
        dayNum: 0,
        nominate: null,
    },
    timeout: null,
    news: [],
    events: [],
    ready: {},
}

//lobby
const LOBBY_LISTENER = 'lobby/lobby_listener'
const CONFIG_LISTENER = 'lobby/config-listener'

//game
const GAMESTATE_LISTENER = 'game/gamestate-listener'
const TIMEOUT_LISTENER = 'game/timeout-listener'
const READY_LISTENER = 'game/ready_listener'
const NEWS_LISTENER = 'game/news_listener'
const EVENTS_LISTENER = 'game/events_listener'

const RESET = 'lobby/reset'

export function leaveLobby(){
    return (dispatch, getState) => {
        //const { owner } = getState().lobby.config

        dispatch(clearListeners())
        
        //if(owner) db.deleteRoom()
        //else db.leaveLobby()

        dispatch({
            type: RESET
        })
    }
}

export function turnOnListeners() {
    return (dispatch, getState) => {
        const { roomId } = getState().loading
        let roomRef = db.ref(`rooms/${roomId}`)

        roomRef.on('child_added', snap => {
            dispatch(newLobbyInfo(snap.key, snap.val()))
        })

        roomRef.on('child_changed', snap => {
            dispatch(newLobbyInfo(snap.key, snap.val()))
        })

        roomRef.on('child_removed', snap => {
            dispatch(childRemoved(snap.key))
        })
    }
}

function childRemoved(key) {
    return (dispatch) => {
        switch(key) {
            case listenerType.ready:
                dispatch({
                    type: READY_LISTENER,
                    payload: {}
                })
                dispatch(myReadyChanged(null))
                break
            default:
        }
    }
}

function newLobbyInfo(key, snap){
    return (dispatch) => {
        switch(key){
            case listenerType.config:
                dispatch({
                    type: CONFIG_LISTENER,
                    payload: {
                        owner: snap.owner,
                        status: snap.status,
                        roles: helpers.sortRoles(snap.roles),
                    }
                })
                break
            case listenerType.lobby:
                dispatch({
                    type: LOBBY_LISTENER,
                    payload: {
                        lobby: _.sortBy(snap, i => i.joinedAt),
                        myInfo: snap[db.getUid()],
                    }
                })
                break
            case listenerType.gameState:
                dispatch({
                    type: GAMESTATE_LISTENER,
                    payload: snap
                })
                break
            case listenerType.timeout:
                dispatch({
                    type: TIMEOUT_LISTENER,
                    payload: snap
                })
                break
            case listenerType.ready:
                dispatch({
                    type: READY_LISTENER,
                    payload: snap
                })
                dispatch(myReadyChanged(snap[db.getUid()]))
                break
            case listenerType.news:
                dispatch({
                    type: NEWS_LISTENER,
                    payload: _.sortBy(snap, i => -i.timestamp)
                })
                break
            case listenerType.events:
                dispatch({
                    type: EVENTS_LISTENER,
                    payload: _.sortBy(snap[db.getUid()], i => -i.key)
                })
                break
            default:
        }
    }
}

function clearListeners(){
    return (dispatch, getState) => {
        const { roomId } = getState().loading
        let roomRef = db.ref(`rooms/${roomId}`)

        if (roomRef) roomRef.off()
    }
}

export function startPregame() {
    return (dispatch, getState) => {
        const { lobby, loading } = getState()
        const { roles } = lobby.config

        //TODO show error message
        if (areThereDuplicateNames(lobby.lobby)) {
            return
        }

        let rolesLen = 0

        for(var i=0; i<roles.length; i++){
            rolesLen += roles[i].count
        }

        if(rolesLen === lobby.lobby.length){
            let statusRef = db.fetchRoomRef('config', loading.roomId)
            statusRef.update({ status: statusType.pregame })
        } else {
            //TODO show extra logic
        }
    }
}

const areThereDuplicateNames = (lobby) => {
    let names = {}
    for (var i=0; i<lobby.length; i++) {
        if (names[lobby[i].name]) return true
        names[lobby[i].name] = true
    }
    return false
} 

export default (state = initialState, action) => {
    switch(action.type){
        case CONFIG_LISTENER:
            return { ...state, config: action.payload }
        case LOBBY_LISTENER:
            return { ...state, ...action.payload }

        case GAMESTATE_LISTENER:
            return { ...state, gameState: action.payload }
        case TIMEOUT_LISTENER:
            return { ...state, timeout: action.payload }
        case READY_LISTENER:
            return { ...state, ready: action.payload }
        case NEWS_LISTENER:
            return { ...state, news: action.payload }
        case EVENTS_LISTENER:
            return { ...state, events: action.payload }
            
        case RESET: 
            return initialState
        default:
            return state;
    }
}