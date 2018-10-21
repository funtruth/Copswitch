
import React, { Component } from 'react';
import { 
    TextInput
} from 'react-native'
import {modalType} from '../../common/types'

import { nameUtil, fuseService } from '@services'

import LobbyModal from '../../common/modals/LobbyModal';

const minCharLen = 2;
const maxCharLen = 15;

class MyName extends Component {
    constructor(props){
        super(props)
        this.state = {
            name: ''
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

        let nameTaken = fuseService.usernameFuzzySearch(name, this.props.lobby)
        if (nameTaken.length > 0) {
            return
        }

        db.updateUsername(name)
    }

    _onSubmitEditing = (event) => {
        let name = event.nativeEvent.text.trim()
        this.checkName(name)
    }

    render() {
        return (
            <LobbyModal
                type={modalType.myName}
                title="Edit Name"
            >
                <TextInput
                    ref = 'textInput'
                    keyboardType='default'
                    autoFocus
                    autoCapitalize='words'
                    underlineColorAndroid={'transparent'}
                    value = {this.state.name}
                    placeholder='ENTER NAME'
                    maxLength={maxCharLen}
                    style={styles.textInput}
                    onChangeText = {this.onChange}
                    onSubmitEditing = {this._onSubmitEditing}
                />
            </LobbyModal>
        )
    }
}

const styles = {
    textInput: {
        fontFamily:'Roboto-Regular',
        fontSize: 218,
        color: '#fff',
        textAlign:'center',
        justifyContent:'center',
        borderRadius: 2
    },
}

export default MyName