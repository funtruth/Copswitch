import {db} from '@services'
import { showGameViewByKey } from '../common/ViewReducer'
import {gameViewType} from '../common/types'

const initialState = {
    nameState: 'name',
    myReady: null,
}

const TOGGLE_NAME_STATE = 'game/toggle_name_state'
const MY_READY_CHANGED = 'game/my-ready-changed'

export function toggleNameState() {
    return (dispatch, getState) => {
        const { nameState } = getState().ui

        dispatch({
            type: TOGGLE_NAME_STATE,
            payload: nameState === 'name' ? 'fullName' : 'name'
        })
    }
}

export function playerChoice(val) {
    return (dispatch, getState) => {
        const { loading } = getState()
        const { roomId } = loading
        const uid = db.getUid()
        const ready = val !== null
        db.update(
            `rooms/${roomId}`,
            {
                [`choice/${uid}`]: val,
                [`ready/${uid}`]: ready,
            }
        )

        dispatch({
            type: MY_READY_CHANGED,
            payload: ready
        })
        dispatch(
            showGameViewByKey(ready ? gameViewType.waiting : gameViewType.game)
        )
    }
}

export function myReadyChanged(nBool) {
    return (dispatch, getState) => {
        const { loading, game } = getState()
        const { roomId } = loading
        const { myReady } = game

        dispatch({
            type: MY_READY_CHANGED,
            payload: nBool
        })
        if (typeof nBool === 'object' && roomId) {
            db.set(
                `rooms/${roomId}/loaded/${db.getUid()}`,
                true
            )
        }
        if (!myReady && nBool) {
            dispatch(
                showGameViewByKey(gameViewType.waiting)
            )
        }
    }
}

export default (state = initialState, action) => {
    switch(action.type){
        case TOGGLE_NAME_STATE:
            return { ...state, nameState: action.payload }
        case MY_READY_CHANGED:
            return { ...state, myReady: action.payload }
        default:
            return state;
    }
}