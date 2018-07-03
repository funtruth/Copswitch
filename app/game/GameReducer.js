import { AsyncStorage } from 'react-native'
import firebaseService from '../firebase/firebaseService'

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
    news: [],

    timeout: null
}

const REFRESH_ROOM_ID = 'game/refresh_room_id'
const REFRESH_REDUCER = 'game/refresh_reducer'

const PUSH_NEW_LISTENER = 'game/push_new_listener'
const CLEAR_LISTENERS = 'game/clear_listeners'

//Listeners initialized in Game
const NOMINATION_LISTENER = 'game/nomination_listener'
const COUNTER_LISTENER = 'game/counter_listener'
const PHASE_LISTENER = 'game/phase_listener'
const DAYNUM_LISTENER = 'game/daynum_listener'
const MY_READY_LISTENER = 'game/my_ready_listener'
const MY_INFO_LISTENER = 'game/my_info_listener'
const PLAYER_LIST_LISTENER = 'game/player_list_listener'
const PLAYER_NUM_LISTENER = 'game/player_num_listener'
const TRIGGER_NUM_LISTENER = 'game/trigger_num_listener'
const NEWS_LISTENER = 'game/news_listener'

const TIMEOUT_LISTENER = 'game/timeout_listener'

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
        dispatch(gameListenerOn('timeout','timeout','value'))
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
                }),
                dispatch({
                    type: PHASE_LISTENER,
                    payload: snap.val()%3
                }),
                dispatch({
                    type: DAYNUM_LISTENER,
                    payload: Math.floor(snap.val()/3) + 1
                })
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
                let alivePlayers = 0;
                for(i=0; i<snap.val().length; i++){
                    if (!snap.val()[i].dead) alivePlayers++
                }
                dispatch({
                    type: PLAYER_NUM_LISTENER,
                    payload: alivePlayers
                })
                dispatch({
                    type: TRIGGER_NUM_LISTENER,
                    payload: ((alivePlayers - alivePlayers%2)/2) + 1
                })
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
                break
            case 'timeout':
                dispatch({
                    type: TIMEOUT_LISTENER,
                    payload: snap.val()
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
            .then(() => myReadyRef.set(choice !== null))
    }
}

export function gameOver() {
    return (dispatch) => {
        AsyncStorage.removeItem('LOBBY-KEY');
        AsyncStorage.removeItem('GAME-KEY');
        
        NavigationTool.navigate('Home')
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
            return { ...state, counter: action.payload }
        case PHASE_LISTENER:
            return { ...state, phase: action.payload }
        case DAYNUM_LISTENER:
            return { ...state, dayNum: action.payload }
        case MY_READY_LISTENER:
            return { ...state, myReady: action.payload }
        case MY_INFO_LISTENER:
            return { ...state, roleid: action.payload.roleid, alive: !action.payload.dead }
        case PLAYER_LIST_LISTENER:
            return { ...state, playerList: action.payload }
        case PLAYER_NUM_LISTENER:
            return { ...state, playerNum: action.payload }
        case TRIGGER_NUM_LISTENER:
            return { ...state, triggerNum: action.payload }
        case NEWS_LISTENER:
            return { ...state, news: [{message: action.payload.val(), key: action.payload.key}, ...state.news] }
        case TIMEOUT_LISTENER:
            return { ...state, timeout: action.payload }
        default:
            return state;
    }

}