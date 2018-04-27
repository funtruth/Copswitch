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

import firebaseService from '../firebase/firebaseService.js';

class JoinRoomComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading:false,
            statusMessage:'Enter Roomcode',
            errorMessage:'Must be 4 Digits long',
        };
        
    }

    //Valid roomcode format
    onChange(code){

        if(!this.state.loading && code.length == 4){

            Keyboard.dismiss()
            this.setState({
                loading:true,
                statusMessage:'Checking Room',
            })
            this.checkRoom(code)

        }
    }

    async checkRoom(code){

        const { valid, message } = await firebaseService.checkRoom(code);

        this.setState({ statusMessage:message })

        if(valid){
            AsyncStorage.setItem('ROOM-KEY', code)
            .then(()=>{

                firebaseService.joinRoom(code)
                this.props.navigate('Lobby',code)
                
                this.setState({ errorMessage:'Must be 4 Digits long' })
                
            })
        } else {
            this.refs.error.shake(800)
            this.refs.textInput.focus()
        }

        this.setState({
            loading:false,
            statusMessage:'Enter Roomcode'
        })

    }

    render() {

        return <View>

            <Text style = {styles.title}>JOIN</Text>
            <Text style = {styles.subtitle}>{this.state.statusMessage}</Text>

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