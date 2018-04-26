import React, { Component } from 'react';
import {
    View,
    AsyncStorage,
    Text,
    TextInput,
    Keyboard
}   from 'react-native';

import * as Animatable from 'react-native-animatable';

import colors from '../misc/colors.js';
import firebase from '../firebase/FirebaseController.js';

class JoinRoomComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errorMessage:'Must be 4 Digits long',
        };
        
    }

    onChange(code){
        if(code.length == 4){
            Keyboard.dismiss()
            firebase.database().ref('rooms').child(code).once('value', snap => {
                if(snap.exists() && (snap.val().counter == 0)){
                    AsyncStorage.setItem('ROOM-KEY', code)
                    
                    .then(()=>{ this.props.navigate('Lobby',code) })
                } else {
                    this.setState({errorMessage:'Invalid Room Code'})
                    this.refs.error.shake(800)
                    this.refs.textInput.focus()
                }
            })
        }
    }

    render() {

        return <View>

            <Text style = {styles.title}>JOIN</Text>
            <Text style = {styles.subtitle}>Enter Roomcode</Text>

            <View style = {{justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
                <TextInput
                    ref='textInput'
                    keyboardType='numeric' 
                    maxLength={4}   
                    placeholder='9999'
                    placeholderTextColor={colors.dead}
                    style={styles.textInput}
                    onChangeText={val=>this.onChange(val)}
                />
            </View>

            <Animatable.Text style = {styles.errorMessage} ref='error'>
                    {this.state.errorMessage}</Animatable.Text>

        </View>
    }
}

const styles = {
    title: {
        fontSize: 30,
        fontFamily: 'FredokaOne-Regular',
        textAlign:'center',
        color: colors.striker
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'FredokaOne-Regular',
        textAlign:'center',
        color:colors.font, 
        marginBottom:5
    },
    textInput: {
        flex: 0.4,
        backgroundColor: colors.background,
        fontFamily:'FredokaOne-Regular',
        fontSize: 25,
        color:colors.font,
        textAlign:'center',
        borderRadius:30,
    },
    errorMessage: {
        fontFamily: 'FredokaOne-Regular',
        textAlign:'center',
        color: colors.font,
        marginTop: 10
    },
}

export default JoinRoomComponent