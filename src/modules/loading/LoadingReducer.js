const initialState = {
    inLobby: false,
    inGame: false,
    place: null
}

const PLAYER_IN_LOBBY = 'loading/player_in_lobby'
const PLAYER_IN_GAME = 'loading/player_in_game'

export function inLobbyStatus(roomId) {
    return (dispatch) => {
        dispatch({
            type: PLAYER_IN_LOBBY,
            payload: roomId
        })
    }
}

export function inGameStatus() {
    return (dispatch) => {
        dispatch({
            type: PLAYER_IN_GAME
        })
    }
}

export default (state = initialState, action) => {
    switch(action.type){
        case PLAYER_IN_LOBBY:
            return { ...state, inLobby: true, roomId: action.payload }
        case PLAYER_IN_GAME:
            return { ...state, inGame: true }
        default:
            return state;
    }
}