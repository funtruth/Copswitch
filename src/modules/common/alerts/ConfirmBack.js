import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'

import NavigationTool from '../../navigation/NavigationTool'

import { showAlertByKey } from '../ViewReducer'
import { reset } from '../../loading/LoadingReducer'

class ConfirmBack extends Component {
    _onConfirm = () => {
        let routeName = NavigationTool.getCurrentRoute().routeName
        switch(routeName) {
            case 'Lobby':
            case 'Game':
                this.props.showAlertByKey()
                this.props.reset()
                NavigationTool.reset('HomeNav')
                break
            default:
        }
    }

    _getText() {
        let routeName = NavigationTool.getCurrentRoute().routeName
        switch(routeName) {
            case 'Lobby':
                return {
                    title: `Leave Lobby`,
                    subtitle: `Are you sure you want to leave the lobby?`,
                    cancel: `Cancel`,
                    confirm: `Leave Lobby`,
                }
            case 'Game':
                return {
                    title: `Leave Game`,
                    subtitle: `Are you sure you want to leave the game? Your friends won't be able to finish without you!`,
                    cancel: `Cancel`,
                    confirm: `Leave Anyways`,
                }
            default:
                return {
                    title: `Leave`,
                    subtitle: `Are you sure you want to leave?`,
                    cancel: `Cancel`,
                    confirm: `Leave`,
                }
        }
    }
    
    render() {
        const { title, subtitle, cancel, confirm } = this._getText()
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancel} onPress={this.props.onClose}>
                        <Text style={styles.cancelText}>{cancel}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.confirm} onPress={this._onConfirm}>
                        <Text style={styles.confirmText}>{confirm}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = {
    container: {
        padding: 8,
    },
    title: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        lineHeight: 18,
        color: '#fff',
        marginTop: 8,
        marginBottom: 12,
    },
    subtitle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 16,
        color: '#d6d6d6',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 6,
        marginTop: 16,
    },
    cancel: {
        padding: 12,
    },
    confirm: {
        padding: 12,
        backgroundColor: '#ca4444',
        borderRadius: 2,
    },
    cancelText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        lineHeight: 17,
        color: '#fff',
    },
    confirmText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        lineHeight: 17,
        color: '#fff',
    },
}

export default connect(
    null,
    {
        reset,
        showAlertByKey,
    }
)(ConfirmBack)