import { AsyncStorage } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { joinRoom } from '../room/LobbyReducer'

import firebase from '../firebase/FirebaseController'
import randomize from 'randomatic'
import firebaseService from '../firebase/firebaseService'
import NavigationTool from '../navigation/NavigationTool'

const initialState = {
    joinId: null,
    loading: false,
    errorText: null,
}

const ON_CHANGE_CODE = 'home/on_change_code'
const LOADING_STATUS = 'home/loading_status'
const ERROR_MESSAGE = 'home/error_message'
const RESET = 'home/reset'

//keeps track of changes in TextInput for JOINING rooms
export function onChangeCode(payload){
    return (dispatch, getState) => {
        let { loading } = getState()
        dispatch({
            type: ON_CHANGE_CODE,
            payload: payload
        })
        if( !loading &&  payload.length === 4 ) {
            dispatch(checkRoom(payload))
        }
    }
}

//checks validity of roomId
function checkRoom(roomId){
    return async (dispatch) => {
        dispatch({
            type: LOADING_STATUS,
            payload: true
        })

        //Takes a snap of the corresponding room
        const roomInfo = await firebaseService.get(`room/${roomId}`)
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

        //Set AsyncStorage
        if (valid) {
            AsyncStorage.setItem('ROOM-KEY', roomId)
            .then(()=>{
                //Initialize references in firebaseService
                firebaseService.initRefs(roomId)
                //enter the room - set PLACE
                firebaseService.joinRoom(roomId)
                //Move to next screen
                dispatch(moveToLobby(roomId))
            })
        }

        dispatch({
            type: LOADING_STATUS,
            payload: false
        })
    }
}

//Creating a room process
export function createRoom(){
    return async (dispatch) => {
        dispatch({
            type: LOADING_STATUS,
            payload: true
        })

        //Takes a snap of all rooms
        const allRoomInfo = await firebaseService.get(`rooms`)

        let flag = false
        let roomId = null

        //Loop until we find a roomId that is NOT taken
        while(!flag){
            roomId = randomize('0',4);
            if(!allRoomInfo) flag = true
            else if(!allRoomInfo[roomId]) flag = true
        }
        
        //Write owner and room status to the database
        firebase.database().ref(`rooms/${roomId}`).set({
            owner: firebaseService.getUid(),
            status:'Lobby',
        })
        //Set AsyncStorage
        .then(()=>{
            AsyncStorage.setItem('ROOM-KEY', roomId)
        })

        //initialize references in firebaseService
        firebaseService.initRefs(roomId)
        //enter the room - set PLACE
        firebaseService.joinRoom(roomId)
        //Move to next screen
        dispatch(moveToLobby(roomId))
    }
}

//Navigates to Lobby and resets state
function moveToLobby(roomId){
    return (dispatch) => {
        NavigationTool.navigate("Lobby")
        dispatch({
            type: RESET
        })
        dispatch(joinRoom(roomId))
    }
}

export default (state = initialState, action) => {

    switch(action.type){
        case ON_CHANGE_CODE:
            return { ...state, joinId: action.payload }
        case LOADING_STATUS:
            return { ...state, loading: action.payload }
        case ERROR_MESSAGE:
            return { ...state, errorText: action.payload }
        case RESET:
            return initialState
        default:
            return state;
    }

}