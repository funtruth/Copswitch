import { AsyncStorage } from 'react-native'
import firebaseService from '../firebase/firebaseService'
import ownerModule from './mods/ownerModule'

const initialState = {
    roomId: null,
    activeListeners: [],
    refreshed: false,

    nomination: null,
    counter: null,
    phase: 0,
    dayNum: null,
    myReady: null,
    roleid: null,
    alive: null,
    playerList: [],
    news: []
}

const REFRESH_ROOM_ID = 'game/refresh_room_id'
const REFRESH_REDUCER = 'game/refresh_reducer'

const PUSH_NEW_LISTENER = 'game/push_new_listener'
const CLEAR_LISTENERS = 'game/clear_listeners'

//Listeners initialized in Game
const NOMINATION_LISTENER = 'game/nomination_listener'
const COUNTER_LISTENER = 'game/counter_listener'
const MY_READY_LISTENER = 'game/my_ready_listener'
const MY_INFO_LISTENER = 'game/my_info_listener'
const PLAYER_LIST_LISTENER = 'game/player_list_listener'
const NEWS_LISTENER = 'game/news_listener'

export function refreshGameReducer() {
    return (dispatch) => {
        AsyncStorage.getItem('GAME-KEY',(error,result)=>{
            dispatch({
                type: REFRESH_ROOM_ID,
                payload: result
            })
            dispatch({
                type: REFRESH_REDUCER
            })
        })
    }
}

export function turnOnGameListeners(){
    return (dispatch, getState) => {
        const { place } = getState().lobby
        dispatch(gameListenerOn('nomination','nomination','value'))
        dispatch(gameListenerOn('counter','counter','value'))
        dispatch(gameListenerOn('myReady',`ready/${place}`,'value'))
        dispatch(gameListenerOn('myInfo',`list/${place}`,'value'))
        dispatch(gameListenerOn('list','list','value'))
        dispatch(gameListenerOn('news','news','child_added'))
    }
}

function gameListenerOn(listener,listenerPath,listenerType){
    return (dispatch) => {
        let listenerRef = firebaseService.fetchRoomRef(listenerPath)
        dispatch({
            type: PUSH_NEW_LISTENER,
            payload: listenerRef
        })
        listenerRef.on(listenerType, snap => {
            dispatch(newRoomInfo(snap, listener))
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

function newRoomInfo(snap, listener){
    return (dispatch) => {
        switch(listener){
            case 'nomination':
                dispatch({
                    type: NOMINATION_LISTENER,
                    payload: snap.val()
                })
                break
            case 'counter':
                dispatch({
                    type: COUNTER_LISTENER,
                    payload: snap.val()
                })
                ownerModule.passCounterInfo(snap.val()%2, snap.val())
                break
            case 'myReady':
                dispatch({
                    type: MY_READY_LISTENER,
                    payload: snap.val()
                })
                break
            case 'myInfo':
                dispatch({
                    type: MY_INFO_LISTENER,
                    payload: snap.val()
                })
                break
            case 'list':
                //TODO player list is not keyed in redux right now
                ownerModule.passPlayerList(snap.val())
                dispatch({
                    type: PLAYER_LIST_LISTENER,
                    payload: snap.val()
                })
                break
            case 'news':
                dispatch({
                    type: NEWS_LISTENER,
                    payload: snap
                })
            default:
        }
    }
}

export function gameChoice(choice) {
    return (dispatch, getState) => {
        const { place } = getState().lobby
        let myChoiceRef = firebaseService.fetchRoomRef(`choice/${place}`)
        let myReadyRef = firebaseService.fetchRoomRef(`ready/${place}`)

        myChoiceRef.set(choice)
            .then(()=>{myReadyRef.set(choice !== null)})
    }
}

export default (state = initialState, action) => {

    switch(action.type){
        case REFRESH_ROOM_ID:
            return { ...state, roomId: action.payload }
        case REFRESH_REDUCER:
            return { ...state, refreshed: true }
        case PUSH_NEW_LISTENER:
            return { ...state, activeListeners: [...state.activeListeners, action.payload] }
        case CLEAR_LISTENERS:
            return { ...state, activeListeners: [] }
        case NOMINATION_LISTENER:
            return { ...state, nomination: action.payload }
        case COUNTER_LISTENER:
            return { ...state, counter: action.payload, phase: action.payload%2, dayNum: (action.payload-action.payload%2)/2+1 }
        case MY_READY_LISTENER:
            return { ...state, myReady: action.payload }
        case MY_INFO_LISTENER:
            return { ...state, roleid: action.payload.roleid, alive: !action.payload.dead }
        case PLAYER_LIST_LISTENER:
            return { ...state, playerList: action.payload }
        case NEWS_LISTENER:
            return { ...state, news: [{message: action.payload.val(), key: action.payload.key}, ...state.news] }
        default:
            return state;
    }

}