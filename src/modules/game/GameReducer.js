import { firebaseService } from '@services'
import { inGameStatus } from '../loading/LoadingReducer'

const initialState = {
    activeListeners: [],

    nomination: null,
    counter: null,
    phase: 0,
    dayNum: null,
    ready: {},
    myReady: null,
    myInfo: {},
    news: [],
    events: [],

    timeout: null
}

/*
NOTES:

NEWS formatting:
    Firebase:
        news: {
            ${timestamp}: <message STRING>,
            ${timestamp}: <message STRING> ...
        }
    Redux:
        news: [
            0: {message: <STRING>, key: ${timestamp}},
            1: {message: <STRING>, key: ${timestamp}} ...
        ]
    'child_added' listener will push NEWS messages into the array chronologically,
    FlatList component works directly with the given array.

EVENTS formatting:
    Firebase:
        events: {
            ${uid}: {
                ${timestamp}: <message STRING>,
                ${timestamp + 1}: <message STRING> ...
            },
            ${uid}: {
                ${timestamp}: <message STRING>,
                ${timestamp + 1}: <message STRING> ...
            } ...
        }
    Redux:
        events: [
            0: {message: <STRING>, key: ${timestamp}},
            1: {message: <STRING>, key: ${timestamp}} ...
        ]
    'child_added' listener attached to each individual uid child will push EVENTS chronologically,
    FlatList components works directly with the given array.

READY formatting:
    Firebase & Redux:
        ready: {
            ${uid}: <BOOL>,
            ${uid}: <BOOL> ...
        }
    Will eventually be JOINed with placeList
*/

const PUSH_LISTENER_PATH = 'game/push_listener_path'
const CLEAR_LISTENERS = 'game/clear_listeners'
const SET_ROOM_INFO = 'game/set_room_info'

const NOMINATION_LISTENER = 'game/nomination_listener'
const READY_LISTENER = 'game/ready_listener'
const MY_READY_LISTENER = 'game/my_ready_listener'
const NEWS_LISTENER = 'game/news_listener'
const EVENTS_LISTENER = 'game/events_listener'

const TIMEOUT_LISTENER = 'game/timeout_listener'

const RESET = 'game/reset'

export function turnOnGameListeners(){
    return (dispatch) => {
        dispatch(inGameStatus())

        dispatch(gameListenerOn('nomination','nomination','value'))
        dispatch(gameListenerOn('counter','counter','value'))
        dispatch(gameListenerOn('ready','ready','value'))
        dispatch(gameListenerOn('news','news','child_added'))
        dispatch(gameListenerOn('events','events','child_added'))
        dispatch(gameListenerOn('timeout','timeout','value'))
    }
}

function gameListenerOn(listener,listenerPath,listenerType){
    return (dispatch) => {
        //TODO FirebaseService hasn't init roomId ...
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
                dispatch(
                    setRoomInfo({
                        counter: snap.val(),
                        phase: snap.val()%3,
                        dayNum: Math.floor(snap.val()/3) + 1
                    })
                )
                break
            case 'ready':
                dispatch({
                    type: READY_LISTENER,
                    payload: snap.val()
                })
                dispatch({
                    type: MY_READY_LISTENER,
                    payload: snap.val()[firebaseService.getUid()]
                })
                break
            case 'news':
                //TODO stylingUtil here???
                dispatch({
                    type: NEWS_LISTENER,
                    payload: {
                        val: snap.val(),
                        key: snap.key
                    }
                })
                break
            case 'events':
                //HANDLE SNAP -> OBJ/ARR
                console.log('event listener', snap)
                dispatch({
                    type: EVENTS_LISTENER,
                    payload: snap.val()
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
        case PUSH_LISTENER_PATH:
            return { ...state, activeListeners: [...state.activeListeners, action.payload] }
        case CLEAR_LISTENERS:
            return { ...state, activeListeners: [] }
        case SET_ROOM_INFO:
            return { ...state, ...action.payload }
            
        case NOMINATION_LISTENER:
            return { ...state, nomination: action.payload }
        case READY_LISTENER:
            return { ...state, ready: action.payload }
        case MY_READY_LISTENER:
            return { ...state, myReady: action.payload }
        case NEWS_LISTENER:
            return { ...state, news: [ ...state.news, {message: action.payload.val, key: action.payload.key} ] }
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