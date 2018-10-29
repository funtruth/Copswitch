
import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
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
            name: props.myInfo.name,
            error: null,
        }
        this.refocus = false
    }

    componentWillReceiveProps(newProps) {
        if (newProps.myInfo.name !== this.props.myInfo.name) {
            this.setState({
                name: newProps.myInfo.name
            })
        }
    }

    onChange = (text) => {
        this.setState({
            name: text
        })
    }

    //modalBackground pressed
    _onClose = () => {
        this.setState({
            error: `You must pick a name before playing`
        })
        this.refocus = true
    }

    _onBlur = () => {
        if (this.refocus) {
            this.refs.textInput.focus()
        }
    }

    checkName = (name) => {
        if(!name || name.length < minCharLen){
            //too short
            this.setState({
                error: `Your name must be at least ${minCharLen} characters in length`,
            })
            this.refocus = true
            return
        }

        const { valid, invalidChars } = nameUtil.checkIfValidName(name, {allowSpaces: true})

        if (!valid) {
            this.setState({
                error: `The characters "${invalidChars.join(', ')}" are invalid`,
            })
            this.refocus = true
            return
        }

        let nameTaken = fuseService.usernameFuzzySearch(name, this.props.lobby)
        if (nameTaken.length > 0) {
            return
        }

        this.props.showModalByKey()
        db.updateUsername(name, this.props.roomId)
    }

    _onDonePress = () => {
        this.checkName(this.state.name.trim())
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
                hideX
                onPress={this._onClose}
            >
                <TextInput
                    ref = 'textInput'
                    keyboardType='default'
                    autoFocus
                    autoCapitalize='words'
                    underlineColorAndroid={this.state.error ? '#ca4444' : '#d6d6d6'}
                    value = {this.state.name}
                    placeholder='Choose a nickname ...'
                    placeholderTextColor="#d6d6d6"
                    maxLength={maxCharLen}
                    style={styles.textInput}
                    onChangeText = {this.onChange}
                    onSubmitEditing = {this._onSubmitEditing}
                    onBlur={this._onBlur}
                />
                <View style={styles.bottom}>
                    <Text style={styles.error}>{this.state.error}</Text>
                    <TouchableOpacity style={styles.cancel} onPress={this._onDonePress}>
                        <Text style={styles.cancelText}>{'Done'}</Text>
                    </TouchableOpacity>
                </View>
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
        marginBottom: 8,
    },
    bottom: {
        flexDirection: 'row',
    },
    cancel: {
        backgroundColor: '#2a2d32',
        marginLeft: 'auto',
        paddingLeft: 12, paddingRight: 12,
        paddingTop: 6,
        paddingBottom: 8
    },
    cancelText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        lineHeight: 17,
        color: '#fff',
    },
}

export default connect(
    state => ({
        roomId: state.loading.roomId,
        myInfo: state.lobby.myInfo,
    }),
    {
        showModalByKey,
    }
)(MyName)