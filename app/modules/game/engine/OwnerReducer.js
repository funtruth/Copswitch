import { firebaseService } from '@services'
import actionModule from './actionModule'
import votingModule from './votingModule';
import lynchingModule from './lynchingModule';

const initialState = {
    ownership: false,
    activeListeners: []
}

const OWNERSHIP_LISTENER = 'owner/ownership_listener'
const PUSH_NEW_LISTENER = 'owner/push_new_listener'
const CLEAR_LISTENERS = 'owner/clear_listeners'

export function ownershipMode(ownership) {
    return (dispatch) => {
        dispatch({
            type: OWNERSHIP_LISTENER,
            payload: ownership
        })
        if (ownership) {
            dispatch(turnOnListeners())
        } else {
            dispatch(turnOffListeners())
        }
    }
}

function turnOnListeners() {
    return (dispatch) => {
        dispatch(ownerListenerOn('loaded','loaded','value'))
        dispatch(ownerListenerOn('choice','choice','value'))
    }
}

function ownerListenerOn(listener, listenerPath, listenerType) {
    return (dispatch, getState) => {
        let listenerRef = firebaseService.fetchRoomRef(listenerPath)
        dispatch({
            type: PUSH_NEW_LISTENER,
            payload: listenerRef
        })
        listenerRef.on(listenerType, snap => {
            dispatch(handleNewInfo(snap, listener))
        })
    }
}

/*
Modules removes the 'ready' ref, which brings players to the loading screen.
They will write to the 'loaded' ref to indicate they are active,
The owner listens to 'loaded' ref, and will change the phase once everyone is done.
*/
function handleNewInfo(snap, listener) {
    return (dispatch, getState) => {
        if (!snap.exists()) return

        let roomRef = firebaseService.fetchRoomRef('')
        let batchUpdates = {}
        const {
            counter, phase,
            playerNum, triggerNum,
            playerList, nomination
        } = getState().game

        switch(listener){
            case 'loaded':
                if (snap.numChildren() < playerNum) return

                (ready = []).length = playerList.length
                ready.fill(false)

                roomRef.update({
                    counter: counter+1,
                    ready,
                    loaded: null,
                    choice: null
                })
                break
            case 'choice':
                let total = 0;
                for(i=0; i<snap.val().length; i++){
                    if(snap.val()[i]) total++
                }

                if (phase == 0 && total >= triggerNum){
                    lynchingModule.runModule(playerList, snap.val(), counter, triggerNum, playerNum)
                } else if (phase == 1 && total >= playerNum - 1){
                    votingModule.runModule(playerList, snap.val(), counter, nomination)
                } else if (phase == 2 && total >= playerNum){
                    actionModule.runModule(playerList, snap.val(), counter)
                }
        }
    }
}

function turnOffListeners() {
    return (dispatch, getState) => {
        const { activeListeners } = getState().owner
        for(var i=0; i<activeListeners.length; i++){
            activeListeners[i].off()
        }
        dispatch({
            type: CLEAR_LISTENERS
        })
    }
}

export default (state = initialState, action) => {

    switch(action.type){
        case OWNERSHIP_LISTENER:
            return { ...state, ownership: action.payload }
        case PUSH_NEW_LISTENER:
            return { ...state, activeListeners: [...state.activeListeners, action.payload] }
        case CLEAR_LISTENERS:
            return { ...state, activeListeners: [] }
        default:
            return state;
    }

}