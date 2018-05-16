import React, { Component } from 'react';
import {
    View,
    AsyncStorage,
    Text,
    TextInput,
    Keyboard,
    Animated
}   from 'react-native';

import * as Animatable from 'react-native-animatable';

import colors from '../misc/colors.js';

import firebaseService from '../firebase/firebaseService.js';

class JoinRoomComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading:false,
            status:'Enter Roomcode',
            errorMessage:'Must be 4 Digits long',
        };
        this.nav = new Animated.Value(0)
        
    }

    //Valid roomcode format
    onChange(code){

        if(!this.state.loading && code.length == 4){

            Keyboard.dismiss()
            this.setState({
                loading:true,
                status:'Checking Room',
            })
            this.checkRoom(code)

        }
    }

    async checkRoom(code){

        const { valid, message } = await firebaseService.checkRoom(code);

        this.setState({ status:message })

        if(valid){
            AsyncStorage.setItem('ROOM-KEY', code)
            .then(()=>{

                firebaseService.joinRoom(code)
                this.props.screenProps.navigate('Lobby',code)
                
                this.setState({ errorMessage:'Must be 4 Digits long' })
                
            })
        } else {
            this.refs.roomCode.focus()
        }

        this.setState({
            loading:false,
            status:'Enter Roomcode'
        })

    }

    componentWillReceiveProps(newProps){
        if ( newProps.section !== this.props.section ) {
            this._show( newProps.section === 'join' )
        }
    }

    _show(view){
        Animated.timing(
            this.nav,{
                toValue: view?1:0,
                duration: 600
            }
        ).start()

        if ( view ){
            this.refs.roomCode.focus()
        } else {
            Keyboard.dismiss()
        }
    }

    render() {
        return (
            <Animated.View style = {{
                opacity: this.nav.interpolate({
                    inputRange:[0, 0.5, 1],
                    outputRange:[0, 0, 1]
                }),
                height: this.nav.interpolate({
                    inputRange:[0,0.5,1],
                    outputRange:[0, 50, 50]
                }),
                justifyContent: 'center'
            }}>
                <TextInput
                    ref='roomCode'
                    keyboardType='numeric' 
                    maxLength={4}   
                    placeholder='Enter your 4 digit code'
                    placeholderTextColor={colors.dead}
                    style={styles.textInput}
                    onChangeText={val=>this.onChange(val)}
                />
            </Animated.View>
        )
    }
}

const styles = {
    textInput: {
        fontSize: 20,
        color: colors.shadow,
        fontFamily:'FredokaOne-Regular',
        textAlign:'center'
    }
}

export default JoinRoomComponent