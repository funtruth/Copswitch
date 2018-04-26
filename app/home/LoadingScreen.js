
import React, { Component } from 'react';
import {
    View,
    AsyncStorage,
}   from 'react-native';

//Firebase
import firebase from '../firebase/FirebaseController.js';
import firebaseService from '../firebase/firebaseService.js';

class LoadingScreen extends Component {
    
    constructor(props) {
        super(props);
    }

    reset(){
        AsyncStorage.removeItem('GAME-KEY')
        AsyncStorage.removeItem('ROOM-KEY')
    }

    componentWillMount() {

        //Create an anonymous account if it doesn't exist already
        firebaseService.findUser()

        //Debugging
        //this.reset()

        //Pass navigation
        this.props.screenProps.passNavigation(this.props.navigation)

        //TODO clean-up logic
        //Sends user to correct screen
        AsyncStorage.getItem('GAME-KEY',(error,result)=>{
            
            //result = '0028'

            if(result != null){
                this.props.screenProps.navigate('Mafia',result)
            } else {
                AsyncStorage.getItem('ROOM-KEY',(error,result)=>{
                    if(result != null){
                        this.props.screenProps.navigate('Lobby',result)
                    } else {
                        this.props.screenProps.navigate('Home')
                    }
                })
                    
            }
        })
    }

    render() {
        return <View/>
    }
}

export default LoadingScreen