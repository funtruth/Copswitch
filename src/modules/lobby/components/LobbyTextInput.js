
import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Dimensions
}   from 'react-native';
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';
import { firebaseService, fuseService, nameUtil } from '@services'

import { TextInput } from '@components'

const { height, width } = Dimensions.get('window')

const minCharLen = 2;
const maxCharLen = 15;

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

    checkName = (name) => {
        if(!name){
            //must give a name
            return
        } 
        
        if(name.length < minCharLen){
            //too short
            return
        }

        const { valid, invalidChars } = nameUtil.checkIfValidName(name, {allowSpaces: true})

        if (!valid) {
            console.log('invalid characters', invalidChars)
            return
        }

        let nameTaken = fuseService.usernameFuzzySearch(name, this.props.lobbyList)
        if (nameTaken.length > 0) {
            return
        }

        firebaseService.updateUsername(name)
    }

    _onSubmit = () => {
        this.checkName(this.state.username)
    }

    _onSubmitEditing = (event) => {
        let name = event.nativeEvent.text.trim()
        this.checkName(name)
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
                    maxLength={maxCharLen}
                    style={textInput}
                    onChangeText = {this.onChange}
                    onSubmitEditing = {this.checkName}
                />
                <TouchableOpacity style={iconWrapper} onPress = {this._onSubmit}>
                    <Icon name='arrow-left' style={icon}/>
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
        width: 0.6*width
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
        username: state.lobby.username,
        lobbyList: state.lobby.lobbyList
    })
)(LobbyTextInput)