import React, { Component } from 'react'
import {
    View,
    AsyncStorage,
    Animated,
    ScrollView
}   from 'react-native'
import { connect } from 'react-redux'
import { pushNewListener, newRoomInfo } from './GameReducer'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { ConsoleView, General, Nomination, PlayerListView, Private } from './components'

import NavigationTool from '../navigation/NavigationTool'
import firebaseService from '../firebase/firebaseService'
import playerModule from './mods/playerModule'
import ownerModule from './mods/ownerModule'

class GameScreen extends Component {

    listening = false

    componentWillMount() {
        if(!this.listening) this.turnOnGameListeners()
    }

    turnOnGameListeners(){
        this.listening = true
        this.GameListenerOn('nomination','nomination','value')
        this.GameListenerOn('counter','counter','value')
        this.GameListenerOn('myReady',`ready/${this.props.place}`,'value')
        this.GameListenerOn('list','list','value')
        this.GameListenerOn('news','news','child_added')
    }

    GameListenerOn(listener,listenerPath,listenerType){
        let listenerRef = firebaseService.fetchRoomRef(listenerPath)
        this.props.pushNewListener(listenerRef)
        listenerRef.on(listenerType, snap => {
            this.props.newRoomInfo(snap, listener)
        })
    }

    //TODO Handling Game Ending
    _gameOver() {
        AsyncStorage.removeItem('ROOM-KEY');
        AsyncStorage.removeItem('GAME-KEY');

        playerModule.wipeGame()
        ownerModule.gameOver()
        
        NavigationTool.navigate('Home')
    }

    render() {
        return (
            <View style = {{flex:1}}>
                <ScrollView>
                    <ScrollView horizontal>
                        <ConsoleView />
                        <ConsoleView />
                    </ScrollView>
                    
                    <PlayerListView />
                </ScrollView>
            </View>
        )
    }
}

export default connect(
    state => ({
        ready: state.game.myReady
    }),
    dispatch => {
        return {
            pushNewListener: (listenerRef) => dispatch(pushNewListener(listenerRef)),
            newRoomInfo: (snap, listener) => dispatch(newRoomInfo(snap,listener))
        }
    }
)(GameScreen)