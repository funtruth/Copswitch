
import React, { Component } from 'react';
import {
    View,
    Text,
    AsyncStorage,
}   from 'react-native';


import { Button } from '../components/Button.js';

import randomize from 'randomatic';
import colors from '../misc/colors.js';
import Rolesheet from '../misc/roles.json';

//Firebase
import firebase from '../firebase/FirebaseController.js';
import firebaseService from '../firebase/firebaseService.js';

class CreateRoomComponent extends Component {
    
    constructor(props) {
        super(props);   
    }

    _createRoom() {
        var flag = false
        var roomname = null

        firebase.database().ref('rooms').once('value',snap=>{

            while(!flag){
                roomname = randomize('0',4);
                if(!snap.child(roomname).exists()){
                    flag = true
                }
            }
            
            firebase.database().ref('rooms/').child(roomname).set({
                owner: firebase.auth().currentUser.uid,
                counter:0,
            })

            .then(()=>{
                AsyncStorage.setItem('ROOM-KEY', roomname)
                firebaseService.createRoom(roomname)
            })

            .then(()=>{ this.props.navigate('Lobby',roomname) })
        }) 
    }

    render() {

        return <View>

            <Text style = {styles.title}>CREATE</Text>

            <Button
                horizontal={0.35}
                color = {colors.dead}
                backgroundColor = {colors.box}
                onPress={()=>this._createRoom()}
            >
                <Text style = {styles.buttonText}>Go!</Text>
            </Button>

        </View>
    }
}

const styles = {
    title: {
        fontSize: 30,
        fontFamily: 'FredokaOne-Regular',
        textAlign:'center',
        color: colors.striker,
        marginBottom: 10
    },
    buttonText: {
        fontSize: 19,
        fontFamily: 'FredokaOne-Regular',
        color: colors.font,
        margin:4
    },

}

export default CreateRoomComponent
