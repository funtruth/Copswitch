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
        nomination: null,
        timeout: null,
    },
    news: [],
    events: [],
    ready: {},
    myReady: false,
}

const PUSH_LISTENER_PATH = 'lobby/push_listener_path'
const CLEAR_LISTENERS = 'lobby/clear_listeners'

//lobby
const LOBBY_LISTENER = 'lobby/lobby_listener'
const CONFIG_LISTENER = 'lobby/config-listener'

//game
const GAMESTATE_LISTENER = 'game/gamestate-listener'
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
            for (var key in snap.val()) {
                dispatch(newLobbyInfo(snap.val()[key], key))
            }
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
            
                break
            case listenerType.ready:
            
                break
            case listenerType.news:
            
                break
            case listenerType.events:
            
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

        case GAMESTATE_LISTENER:
            return { ...state, gameState: action.payload }
        case READY_LISTENER:
            return { ...state, ready: action.payload }
        case NEWS_LISTENER:
            return { ...state, news: [...state.news, action.payload] }
        case EVENTS_LISTENER:
            return { ...state, events: [...state.events, action.payload] }
            
        case RESET: 
            return initialState
        default:
            return state;
    }
}