import firebaseService from '../firebase/firebaseService'
import ownerModule from '../game/mods/ownerModule'
import playerModule from '../game/mods/playerModule'

const initialState = {
    roomId: null,
    modalView: null,
    activeListeners: [],

    username: null,
    owner: false,
    roomStatus: 'Lobby',
    lobbyList: [],
    placeList: [],
    place: null,
    activityLog: [],

    nomination: null,
    counter: null,
    phase: 0,
    dayNum: null,
    myReady: null,
    playerList: [],
    news: []
}

const JOIN_ROOM = 'room/join_room'
const CHANGE_MODAL = 'room/change_modal'
const PUSH_NEW_LISTENER = 'room/push_new_listener'
const CLEAR_LISTENERS = 'room/clear_listeners'

//Listeners initialized in Lobby
const OWNER_LISTENER = 'room/room_owner_listener'
const NAME_LISTENER = 'room/name_listener'
const LOBBY_LISTENER = 'room/lobby_listener'
const PLACE_LISTENER = 'room/place_listener'
const SET_MY_PLACE = 'room/set_my_place'
const ACTIVITY_LOG_LISTENER = 'room/activity_log_listener'
const ROOM_STATUS_LISTENER = 'room/status_listener'

//Listeners initialized in Game
const NOMINATION_LISTENER = 'room/nomination_listener'
const COUNTER_LISTENER = 'room/counter_listener'
const MY_READY_LISTENER = 'room/my_ready_listener'
const PLAYER_LIST_LISTENER = 'room/player_list_listener'
const NEWS_LISTENER = 'room/log_listener'

export function joinRoom(roomId){
    return (dispatch) => {
        dispatch({
            type: JOIN_ROOM,
            payload: roomId
        })
    }
}

export function changeModalView(modalView){
    return (dispatch) => {
        dispatch({
            type: CHANGE_MODAL,
            payload: modalView
        })
    }
}

export function pushNewListener(listenerRef){
    return (dispatch) => {
        dispatch({
            type: PUSH_NEW_LISTENER,
            payload: listenerRef
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

export function newLobbyInfo(snap, listener){
    return (dispatch) => {
        switch(listener){
            case 'owner':
                if(snap.val() === firebaseService.getUid()){
                    ownerModule.ownerMode(true)
                    dispatch({
                        type: OWNER_LISTENER,
                        payload: snap.val() === firebaseService.getUid()
                    })
                }
                break
            case 'name':
                dispatch({
                    type: NAME_LISTENER,
                    payload: snap.val().name
                })
                break
            case 'lobby':
                dispatch({
                    type: LOBBY_LISTENER,
                    payload: snap.val()
                })
            case 'place':
                for(var i=0; i<snap.val().length; i++){
                    if(snap.val()[i] === firebaseService.getUid()){
                        dispatch({
                            type: SET_MY_PLACE,
                            payload: i
                        })
                    }
                }
                dispatch({
                    type: PLACE_LISTENER,
                    payload: snap.val()
                })
                break
            case 'log':
                dispatch({
                    type: ACTIVITY_LOG_LISTENER,
                    payload: snap 
                })
                break
            case 'roles':
            case 'status':
                dispatch({
                    type: ROOM_STATUS_LISTENER,
                    payload: snap.val()
                })
                break
            default:
        }
    }
}

export function newRoomInfo(snap, listener){
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
            case 'list':
                playerModule.passPlayerList(snap.val())
                ownerModule.passPlayerList(snap.val())
                dispatch({
                    type: PLAYER_LIST_LISTENER,
                    payload: snap.val()
                })
                break
            case 'log':
                dispatch({
                    type: NEWS_LISTENER,
                    payload: snap
                })
            default:
        }
    }
}

export default (state = initialState, action) => {

    switch(action.type){
        case JOIN_ROOM:
            return { ...state, roomId: action.payload }
        case CHANGE_MODAL:
            return { ...state, modalView: action.payload }
        case PUSH_NEW_LISTENER:
            return { ...state, activeListeners: [...state.activeListeners, action.payload] }
        case CLEAR_LISTENERS:
            return { ...state, activeListeners: [] }
        case OWNER_LISTENER:
            return { ...state, owner: action.payload }
        case NAME_LISTENER:
            return { ...state, username: action.payload }
        case LOBBY_LISTENER:
            return { ...state, lobbyList: action.payload }
        case PLACE_LISTENER:
            return { ...state, placeList: action.payload }
        case SET_MY_PLACE:
            return { ...state, place: action.payload }
        case ROOM_STATUS_LISTENER:
            return { ...state, roomStatus: action.payload }
        case ACTIVITY_LOG_LISTENER:
            return { ...state, activityLog: [{message: action.payload.val(), key: action.payload.key}, ...state.activityLog] }
        case NOMINATION_LISTENER:
            return { ...state, nomination: action.payload }
        case COUNTER_LISTENER:
            return { ...state, counter: action.payload, phase: action.payload%2, dayNum: (action.payload-action.payload%2)/2+1 }
        case MY_READY_LISTENER:
            return { ...state, myReady: action.payload }
        case PLAYER_LIST_LISTENER:
            return { ...state, playerList: action.payload }
        case NEWS_LISTENER:
            return { ...state, news: [{message: action.payload.val(), key: action.payload.key}, ...state.news] }
        default:
            return state;
    }

}