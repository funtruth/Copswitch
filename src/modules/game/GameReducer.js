import { firebaseService } from '@services'

const initialState = {
    inGame: false,
    activeListeners: [],

    nomination: null,
    counter: null,
    phase: 0,
    dayNum: null,
    myReady: null,
    roleid: null,
    alive: null,
    news: [],
    events: [],

    timeout: null
}

const IN_GAME_STATUS = 'game/in_game_status'

const PUSH_LISTENER_PATH = 'game/push_listener_path'
const CLEAR_LISTENERS = 'game/clear_listeners'
const SET_ROOM_INFO = 'game/set_room_info'

const NOMINATION_LISTENER = 'game/nomination_listener'
const MY_READY_LISTENER = 'game/my_ready_listener'
const MY_INFO_LISTENER = 'game/my_info_listener'
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
        dispatch(gameListenerOn('news','news','child_added'))
        dispatch(gameListenerOn('events','events','child_added'))
        dispatch(gameListenerOn('timeout','timeout','value'))
    }
}

function gameListenerOn(listener,listenerPath,listenerType){
    return (dispatch) => {
        //FirebaseService hasn't init roomId ...
        let listenerRef = firebaseService.fetchRoomRef(listenerPath)
        console.log('listener ref', listenerRef)
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

export function setRoomInfo(obj) {
    return (dispatch) => {
        dispatch({
            type: SET_ROOM_INFO,
            payload: obj
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
                dispatch(setRoomInfo({
                    counter: snap.val(),
                    phase: snap.val()%3,
                    dayNum: Math.floor(snap.val()/3) + 1
                }))
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
            //TODO remove when confident lols
            //if (!state.activeListeners) return { ...state, activeListeners: [action.payload] }
            return { ...state, activeListeners: [...state.activeListeners, action.payload] }
        case CLEAR_LISTENERS:
            return { ...state, activeListeners: [] }
        case SET_ROOM_INFO:
            return { ...state, ...action.payload }
            
        case NOMINATION_LISTENER:
            return { ...state, nomination: action.payload }
        case MY_READY_LISTENER:
            return { ...state, myReady: action.payload }
        case MY_INFO_LISTENER:
            return { ...state, roleid: action.payload.roleid, alive: !action.payload.dead }
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