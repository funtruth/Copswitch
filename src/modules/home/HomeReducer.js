import { turnOnLobbyListeners } from '../lobby/LobbyReducer'
import { inLobbyStatus } from '../loading/LoadingReducer'

import randomize from 'randomatic'
import { firebase, db } from '@services'
import NavigationTool from '../navigation/NavigationTool'

const initialState = {
    loading: false,
    error: null,
}

const LOADING_STATUS = 'home/loading_status'
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
            type: LOADING_STATUS,
            payload: true
        })

        //Takes a snap of the corresponding room
        const roomInfo = await db.get(`rooms/${roomId}`)
        let valid = false

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
            valid = true
        }

        if (valid) {
            //Initialize references in db
            db.initRefs(roomId)
            //if there's no lobby, or I'm not there yet ...
            if (!roomInfo.lobby || !roomInfo.lobby[db.getUid()]) {
                //enter the room to set PLACE
                db.joinRoom(roomId, profile.fullName) //sets joined: true, firstName, lastName, etc
            }   

            //Move to next screen
            dispatch(moveToLobby(roomId))
        }

        dispatch({
            type: LOADING_STATUS,
            payload: false
        })
    }
}

//Creating a room process
export function createRoom(roomConfig){
    return async (dispatch, getState) => {
        const { profile } = getState()

        dispatch({
            type: LOADING_STATUS,
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

        let { gameMode } = roomConfig
        
        //Write owner and room status to the database
        firebase.database().ref(`rooms/${roomId}`).set({
            owner: db.getUid(),
            status:'Lobby',
            mode: gameMode
        })

        //Initialize references in db AND enter the room to set PLACE
        db.initRefs(roomId)
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
        dispatch(turnOnLobbyListeners())
        NavigationTool.navigate("Lobby")
        dispatch({
            type: RESET
        })
    }
}

export default (state = initialState, action) => {

    switch(action.type){
        case LOADING_STATUS:
            return { ...state, loading: action.payload }
        case ERROR_MESSAGE:
            return { ...state, error: action.payload }
        case RESET:
            return initialState
        default:
            return state;
    }

}