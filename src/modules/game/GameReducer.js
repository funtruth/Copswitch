import { firebaseService } from '@services'
import { NavigationTool } from '@navigation'

const initialState = {
    inGame: false,
    roomId: null,

    activeListeners: [],

    nomination: null,
    counter: null,
    phase: 0,
    dayNum: null,
    myReady: null,
    roleid: null,
    alive: null,
    playerList: [],
    news: [],
    events: [],

    timeout: null
}

const IN_GAME_STATUS = 'game/in_game_status'

const PUSH_LISTENER_PATH = 'game/push_listener_path'
const CLEAR_LISTENERS = 'game/clear_listeners'

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
const EVENTS_LISTENER = 'game/events_listener'

const TIMEOUT_LISTENER = 'game/timeout_listener'

const RESET = 'game/reset'

export function turnOnGameListeners(){
    return (dispatch, getState) => {
        const { place } = getState().lobby
        dispatch({
            type: IN_GAME_STATUS,
            payload: true
        })
        dispatch(gameListenerOn('nomination','nomination','value'))
        dispatch(gameListenerOn('counter','counter','value'))
        dispatch(gameListenerOn('myReady',`ready/${place}`,'value'))
        dispatch(gameListenerOn('myInfo',`list/${place}`,'value'))
        dispatch(gameListenerOn('list','list','value'))
        dispatch(gameListenerOn('news','news','child_added'))
        dispatch(gameListenerOn('events','events','child_added'))
        dispatch(gameListenerOn('timeout','timeout','value'))
    }
}

function gameListenerOn(listener,listenerPath,listenerType){
    return (dispatch) => {
        let listenerRef = firebaseService.fetchRoomRef(listenerPath)
        dispatch({
            type: PUSH_LISTENER_PATH,
            payload: listenerPath
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
            let listenerRef = firebaseService.fetchRoomRef(activeListeners[i])
            listenerRef.off()
        }
        dispatch({
            type: CLEAR_LISTENERS
        })
    }
}

function newRoomInfo(snap, listener){
    return (dispatch) => {
        if (!snap.val()) return
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
            case 'events':
                console.log('event listener', snap)
                dispatch({
                    type: EVENTS_LISTENER,
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

export default (state = initialState, action) => {

    switch(action.type){
        case IN_GAME_STATUS:
            return { ...state, inGame: action.payload }

        case PUSH_LISTENER_PATH:
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
        case EVENTS_LISTENER:
            return { ...state, events: [ ...state.events, action.payload ] }
        case TIMEOUT_LISTENER:
            return { ...state, timeout: action.payload }

        case RESET:
            return initialState
        default:
            return state;
    }

}