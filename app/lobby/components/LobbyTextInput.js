
import React, { Component } from 'react';
import {
    TextInput,
    View,
    TouchableOpacity,
    Dimensions,
    Animated
}   from 'react-native';
import { connect } from 'react-redux'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firebaseService from '../../firebase/firebaseService.js';

import colors from '../../misc/colors.js';
import { Header } from '../../components/index.js';
const { height, width } = Dimensions.get('window')

const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ';
const maxCharLen = 12;

class LobbyTextInput extends Component {
    constructor(props){
        super(props)
        this.state = {
            username: props.username
        }
    }

    onChange = (text) => {
        this.setState({
            username: text
        })
    }

    checkName = (event) => {
        let name = event.nativeEvent.text.trim()
        this.invalidChars = []

        if(!name){
            //must give a name
            return
        } 
        
        if(name.length > maxCharLen){
            //too long
            return
        }

        for(var i=0; i<name.length; i++){
            var isCharValid = false
            for(var j=0; j<allowedChars.length; j++){
                if(name.charAt(i) === allowedChars.charAt(j)) {
                    isCharValid = true
                    break
                }
            }
            if(!isCharValid){
                this.invalidChars.push( name.charAt(i) )
            }
        }

        if(this.invalidChars.length > 0){
            return
        } else {
            firebaseService.updateUsername(name)
        }
    }

    _onSubmit = () => {
        this.checkName(this.state.username)
    }

    render() {
        const { wrapper, textInput, iconWrapper, icon } = styles

        return (
            <View style={wrapper}>
                <View style={{width: 0.2*width}}/>
                <TextInput
                    ref = 'textInput'
                    keyboardType='default'
                    autoFocus
                    autoCapitalize='words'
                    value = {this.state.username}
                    placeholder='ENTER NAME'
                    placeholderTextColor={colors.dead}
                    underlineColorAndroid='transparent'
                    maxLength={maxCharLen}
                    style={textInput}
                    onChangeText = {this.onChange}
                    onSubmitEditing = {this.checkName}
                />
                <TouchableOpacity style={iconWrapper} onPress = {this._onSubmit}>
                    <FontAwesome name='arrow-right' style={icon}/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = {
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    textInput: {
        fontFamily:'BarlowCondensed-Regular',
        fontSize: 20,
        color: '#8E8782',
        backgroundColor: '#C4C4C4',
        textAlign:'left',
        justifyContent:'center',
        width: 0.6*width,
        borderRadius: 2,
        margin: 5
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent:'center',
        width: 0.2*width
    },
    icon: {
        fontSize: 25,
        color: '#A6895D'
    }
}

export default connect(
    state => ({
        username: state.lobby.username
    })
)(LobbyTextInput)