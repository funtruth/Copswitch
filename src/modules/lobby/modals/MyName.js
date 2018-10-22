
import React, { Component } from 'react';
import {
    Text,
    TextInput
} from 'react-native'
import { connect } from 'react-redux'

import {modalType} from '../../common/types'

import { db, nameUtil, fuseService } from '@services'
import { showModalByKey } from '../../common/ViewReducer'

import LobbyModal from '../../common/modals/LobbyModal';

const minCharLen = 2;
const maxCharLen = 15;

class MyName extends Component {
    constructor(props){
        super(props)
        this.state = {
            name: '',
            invalidChars: ' ',
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
            this.setState({
                invalidChars
            })
            this.refs.textInput.focus()
            return
        }

        let nameTaken = fuseService.usernameFuzzySearch(name, this.props.lobby)
        if (nameTaken.length > 0) {
            return
        }

        this.props.showModalByKey()
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
                forced
            >
                <TextInput
                    ref = 'textInput'
                    keyboardType='default'
                    autoFocus
                    autoCapitalize='words'
                    underlineColorAndroid={this.state.invalidChars !== ' ' ? '#ca4444' : 'transparent'}
                    value = {this.state.name}
                    placeholder='Choose a nickname ...'
                    placeholderTextColor="#d6d6d6"
                    maxLength={maxCharLen}
                    style={styles.textInput}
                    onChangeText = {this.onChange}
                    onSubmitEditing = {this._onSubmitEditing}
                />
                <Text style={styles.error}>{this.state.invalidChars}</Text>
            </LobbyModal>
        )
    }
}

const styles = {
    textInput: {
        fontFamily:'Roboto-Regular',
        fontSize: 15,
        lineHeight: 18,
        color: '#fff',
        paddingLeft: 8, paddingRight: 8,
    },
    error: {
        fontFamily:'Roboto-Regular',
        fontSize: 11,
        color: '#ca4444',
        paddingLeft: 8, paddingRight: 8,
    }
}

export default connect(
    null,
    {
        showModalByKey,
    }
)(MyName)