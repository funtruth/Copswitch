
import React, { Component } from 'react';
import {
    View,
    AsyncStorage,
}   from 'react-native';

import firebaseService from '../firebase/firebaseService.js';

class LoadingScreen extends Component {
    
    constructor(props) {
        super(props);

        this.route = 'Home'
        this.roomId = null
    }

    reset(){
        AsyncStorage.removeItem('GAME-KEY')
        AsyncStorage.removeItem('ROOM-KEY')
    }

    componentWillMount() {

        //Create an anonymous account if it doesn't exist already
        firebaseService.findUser()
        firebaseService.initUser()

        //Debugging
        //this.reset()

        //Pass navigation
        this.props.screenProps.passNavigation(this.props.navigation)

        AsyncStorage.getItem('ROOM-KEY',(error,roomKey)=>{
            if(roomKey){
                this.route = 'Lobby'
                this.roomId = roomKey
            }
        })
        .then(()=>{
            AsyncStorage.getItem('GAME-KEY',(error,gameKey)=>{
                if(gameKey){
                    this.route = 'Pregame'
                    this.roomId = gameKey
                }
                
            })
            .then(()=>{
                firebaseService.initRefs(this.roomId)
                this.props.screenProps.navigate(this.route)
            })
        })
        

    }

    render() {
        return <View/>
    }
}

export default LoadingScreen