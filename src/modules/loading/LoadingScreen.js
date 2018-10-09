import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux'

import { turnOnListeners } from '../lobby/LobbyReducer'

import { db } from '@services'
import NavigationTool from '../navigation/NavigationTool'

class LoadingScreen extends Component {
    componentDidMount() {
        db.initUser()
        console.log('persisted state.', this.props.state)
        
        const { inLobby, inGame,
            turnOnListeners } = this.props

        if (inLobby) turnOnListeners()

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
        state: state,
    }),
    {
        turnOnListeners,
    }
)(LoadingScreen)