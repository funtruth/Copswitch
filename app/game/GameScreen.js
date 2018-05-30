import React, { Component } from 'react';
import {
    View,
    Image,
    AsyncStorage,
    Text,
    FlatList,
    Animated,
    Dimensions,
    TouchableOpacity
}   from 'react-native';
import { connect } from 'react-redux'
import { pushNewListener, newRoomInfo } from './GameReducer'

import colors from '../misc/colors.js';

import Modal from '../components/Modal';
import { Button } from '../components/Button.js';
import { Rolecard } from '../components/Rolecard.js';
import { ConsoleView, General, Nomination, PlayerListView, Private } from './components'

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import firebaseService from '../firebase/firebaseService';
import playerModule from './mods/playerModule';
import ownerModule from './mods/ownerModule';

const { height, width } = Dimensions.get('window')
const icon = 0.12 * width

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
        
        this.props.screenProps.navigate('Home')
    }

    render() {
        return (
            <View style = {{flex:1}}>
                <PlayerListView />
            </View>
        )
    }
}

const styles = {
    player: {
        fontSize: 16,
        fontFamily: 'FredokaOne-Regular',
        color: colors.shadow,
        margin:5,
    },
    plainfont: {
        color: colors.font,
        margin:5,
        fontFamily: 'FredokaOne-Regular',
    },
    cancelButton: {
        fontSize: 16,
        fontFamily: 'FredokaOne-Regular',
        color: colors.shadow,
        margin:5,
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