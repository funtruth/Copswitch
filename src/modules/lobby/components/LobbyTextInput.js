
import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Dimensions
}   from 'react-native';
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';
import { db, fuseService, nameUtil } from '@services'

import { TextInput } from '@components'

const { height, width } = Dimensions.get('window')

const minCharLen = 2;
const maxCharLen = 15;

class LobbyTextInput extends Component {
    constructor(props){
        super(props)
        this.state = {
            name: props.name
        }
    }

    onChange = (text) => {
        this.setState({
            name: text
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

        db.updateUsername(name)
    }

    _onSubmit = () => {
        this.checkName(this.state.name)
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
                    value = {this.state.name}
                    placeholder='ENTER NAME'
                    maxLength={maxCharLen}
                    style={textInput}
                    onChangeText = {this.onChange}
                    onSubmitEditing = {this._onSubmitEditing}
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
        name: state.game.myInfo.name,
        lobbyList: state.lobby.lobbyList
    })
)(LobbyTextInput)