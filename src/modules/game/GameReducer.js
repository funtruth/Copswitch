import { db } from '@services'

const initialState = {}


function gameListenerOn(listener, listenerPath, listenerType){
    return (dispatch) => {
        //TODO FirebaseService hasn't init roomId ...
        let listenerRef = db.fetchRoomRef(listenerPath)
        dispatch({
            type: PUSH_LISTENER_PATH,
            payload: listenerPath
        })
        listenerRef.on(listenerType, snap => {
            dispatch(newRoomInfo(snap, listener))
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
                    payload: snap.val()[db.getUid()]
                })
                break
            case 'news':
                dispatch({
                    type: NEWS_LISTENER,
                    payload: {
                        message: snap.val(),
                        key: snap.key
                    }
                })
                break
            case 'events':
                dispatch({
                    type: EVENTS_LISTENER,
                    payload: {
                        message: snap.val(),
                        key: snap.key
                    }
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
    let uid = db.getUid()

    let myChoiceRef = db.fetchRoomRef(`choice/${uid}`)
    let myReadyRef = db.fetchRoomRef(`ready/${uid}`)

    myChoiceRef.set(choice)
        .then(() => myReadyRef.set(choice !== null))
    
}

export default (state = initialState, action) => {
    switch(action.type){
        default:
            return state;
    }
}