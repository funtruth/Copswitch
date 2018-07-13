import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux'

import { turnOnLobbyListeners } from '../lobby/LobbyReducer'

import { firebaseService } from '@services'
import { NavigationTool } from '@navigation'

class LoadingScreen extends Component {
    componentDidMount() {
        firebaseService.initUser()
        console.log('persisted state.', this.props.state)
        
        const { inLobby, lobbyKey, inGame, gameKey } = this.props
        if (inGame) {
            NavigationTool.navigate('Pregame')
        } else if (inLobby) {
            firebaseService.joinRoom(lobbyKey)
            this.props.turnOnLobbyListeners()
            NavigationTool.navigate('Lobby')
        } else {
            NavigationTool.navigate('Home')
        }
    }

    render() {
        return <View style={{flex:1, backgroundColor:'purple'}}/>
    }
}

export default connect(
    state => ({
        inLobby: state.lobby.inLobby,
        lobbyKey: state.lobby.roomId,
        inGame: state.game.inGame,
        gameKey: state.game.roomId,
        state: state
    }),
    dispatch => {
        return {
            turnOnLobbyListeners: () => dispatch(turnOnLobbyListeners())
        }
    }
)(LoadingScreen)