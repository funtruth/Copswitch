import _ from 'lodash'

import {db} from '@services'
import {statusType, listenerType} from '../common/types'
import NavigationTool from '../navigation/NavigationTool'

const initialState = {
    //lobby
    config: {
        owner: false,
        status: statusType.lobby,
        roles: [],
    },
    lobby: [],
    myInfo: {},

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
    myReady: false,
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

export function turnOnListeners() {
    return (dispatch, getState) => {
        const { roomId } = getState().loading
        let roomRef = db.ref(`rooms/${roomId}`)

        roomRef.on('value', snap => {
            snap.forEach(child => {
                dispatch(newLobbyInfo(child.val(), child.key))
            })
        })
    }
}

function newLobbyInfo(snap, key){
    return (dispatch) => {
        if (!snap) return

        switch(key){
            case listenerType.config:
                dispatch({
                    type: CONFIG_LISTENER,
                    payload: {
                        owner: snap.owner === db.getUid(),
                        status: snap.status,
                        roles: _.sortBy(snap.roles, i => i),
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
                    payload: {
                        ready: snap,
                        myReady: snap[db.getUid()]
                    }
                })
                break
            case listenerType.news:
                dispatch({
                    type: NEWS_LISTENER,
                    payload: snap
                })
                break
            case listenerType.events:
                dispatch({
                    type: EVENTS_LISTENER,
                    payload: snap
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
        const { config, lobby } = getState().lobby
        const { roles } = config

        //TODO show error message
        if (areThereDuplicateNames(lobby)) {

            return
        }

        let rolesLen = 0
        let lobbyLen = Object.keys(lobby).length

        for(var i in roles){
            rolesLen += roles[i]
        }

        if(rolesLen === lobbyLen){
            let statusRef = db.fetchRoomRef('config/status')
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