import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux'

import { turnOnLobbyListeners } from '../lobby/LobbyReducer'
import { turnOnGameListeners } from '../game/GameReducer'

import { db } from '@services'
import NavigationTool from '../navigation/NavigationTool'

class LoadingScreen extends Component {
    componentDidMount() {
        db.initUser()
        console.log('persisted state.', this.props.state)
        
        const { inLobby, roomId, inGame,
            turnOnLobbyListeners, turnOnGameListeners } = this.props

        if (roomId) db.initRefs(roomId)

        if (inLobby) turnOnLobbyListeners()
        if (inGame) turnOnGameListeners()

        if (inGame) {
            NavigationTool.navigate('Game')
        } else if (inLobby) {
            NavigationTool.navigate('Lobby')
        } else {
            NavigationTool.navigate('Home')
        }
    }

    render() {
        return <View style={{flex:1, backgroundColor:'#2E2620'}}/>
    }
}

export default connect(
    state => ({
        inLobby: state.loading.inLobby,
        roomId: state.loading.roomId,
        inGame: state.loading.inGame,
        state: state
    }),
    dispatch => {
        return {
            turnOnLobbyListeners: () => dispatch(turnOnLobbyListeners()),
            turnOnGameListeners: () => dispatch(turnOnGameListeners())
        }
    }
)(LoadingScreen)