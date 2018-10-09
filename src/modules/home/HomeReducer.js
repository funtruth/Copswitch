import { turnOnListeners } from '../lobby/LobbyReducer'
import { inLobbyStatus } from '../loading/LoadingReducer'

import randomize from 'randomatic'
import { firebase, db } from '@services'
import NavigationTool from '../navigation/NavigationTool'

import { configTypes } from '../common/types'

const initialState = {
    loading: false,
    error: null,
}

const START_LOADING = 'home/START_LOADING'
const ERROR_MESSAGE = 'home/error_message'
const RESET = 'home/reset'

//checks validity of roomId
export function checkRoom(roomId){
    return async (dispatch, getState) => {
        const { profile } = getState()

        dispatch({
            type: ERROR_MESSAGE,
            payload: null
        })

        if (!roomId) {
            dispatch({
                type: ERROR_MESSAGE,
                payload: 'Something went wrong'
            })
            return
        }

        dispatch({
            type: START_LOADING
        })

        //Takes a snap of the corresponding room
        const roomInfo = await db.get(`rooms/${roomId}`)

        //If the room does not exist ... invalid code
        if(!roomInfo){
            dispatch({
                type: ERROR_MESSAGE,
                payload: 'Invalid Room Code'
            })
        //If the room status is not Lobby ... game has started
        } else if (roomInfo.status !== 'Lobby'){
            dispatch({
                type: ERROR_MESSAGE,
                payload: 'Game has already Started.'
            })
        //Otherwise, join the room
        } else {
            dispatch({
                type: ERROR_MESSAGE,
                payload: 'Success!'
            })

            db.joinRoom(roomId, profile.fullName) //sets joined: true, firstName, lastName, etc
            
            //Move to next screen
            dispatch(moveToLobby(roomId))
        }
    }
}

//Creating a room process
export function createRoom(roomConfig){
    return async (dispatch, getState) => {
        const { profile } = getState()

        dispatch({
            type: START_LOADING,
            payload: true
        })

        //Takes a snap of all rooms
        const allRoomInfo = await db.get(`rooms`)

        let flag = false
        let roomId = null

        //Loop until we find a roomId that is NOT taken
        while(!flag){
            roomId = randomize('0',4);
            if(!allRoomInfo) flag = true
            else if(!allRoomInfo[roomId]) flag = true
        }
        
        //Write owner and room status to the database
        firebase.database().ref(`rooms/${roomId}/config`).set({
            owner: db.getUid(),
            status:'Lobby',
            roles: {},
        })

        db.joinRoom(roomId, profile.fullName)
        
        //Move to next screen
        dispatch(moveToLobby(roomId))
    }
}

export function reset() {
    return (dispatch) => {
        dispatch({
            type: RESET
        })
    }
}

//Navigates to Lobby and resets state
function moveToLobby(roomId){
    return (dispatch) => {
        dispatch(inLobbyStatus(roomId)) //Lobby reducer
        dispatch(turnOnListeners())
        NavigationTool.navigate("Lobby")
        dispatch({
            type: RESET
        })
    }
}

export default (state = initialState, action) => {

    switch(action.type){
        case START_LOADING:
            return { ...state, loading: true }
        case ERROR_MESSAGE:
            return { ...state, error: action.payload, loading: false }

        case RESET:
            return initialState
        default:
            return state;
    }

}