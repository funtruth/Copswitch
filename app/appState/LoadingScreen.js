import React, { Component } from 'react';
import {
    View,
}   from 'react-native';
import { connect } from 'react-redux'

import { refreshLobbyReducer, joinRoom, turnOnLobbyListeners } from '../lobby/LobbyReducer'
import { refreshGameReducer, turnOnGameListeners } from '../game/GameReducer'

import firebaseService from '../firebase/firebaseService.js'
import NavigationTool from '../navigation/NavigationTool'

class LoadingScreen extends Component {

    reset(){
        AsyncStorage.removeItem('GAME-KEY')
        AsyncStorage.removeItem('LOBBY-KEY')
    }

    componentDidMount() {
        firebaseService.initUser()

        //Debugging
        //this.reset()

        this.props.refreshLobbyReducer()
        this.props.refreshGameReducer()
    }
    
    componentWillReceiveProps(newProps) {
        const { lobbyKey, lobbyRefreshed, place,
            gameKey, gameRefreshed } = newProps
        
        if(!lobbyRefreshed || !gameRefreshed) return

        if(lobbyKey) {
            firebaseService.joinRoom(lobbyKey)
            this.props.joinRoom(lobbyKey)
            this.props.turnOnLobbyListeners()
        }
        
        //Wait for place before turning on GameListeners
        if(gameKey && !place) return

        if(gameKey){
            this.props.turnOnGameListeners()
        }

        if(gameKey){
            NavigationTool.navigate('Pregame')
        } else if(lobbyKey) {
            NavigationTool.navigate('Lobby')
        } else {
            NavigationTool.navigate('Home')
        }
    }

    render() {
        return <View/>
    }
}

export default connect(
    state => ({
       lobbyKey: state.lobby.roomId,
       lobbyRefreshed: state.lobby.refreshed,
       place: state.lobby.place,
       gameKey: state.game.roomId,
       gameRefreshed: state.game.refreshed
    }),
    dispatch => {
        return {
            refreshLobbyReducer: () => dispatch(refreshLobbyReducer()),
            refreshGameReducer: () => dispatch(refreshGameReducer()),
            joinRoom: (roomId) => dispatch(joinRoom(roomId)),
            turnOnLobbyListeners: () => dispatch(turnOnLobbyListeners()),
            turnOnGameListeners: () => dispatch(turnOnGameListeners())
        }
    }
)(LoadingScreen)