import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
}   from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'

import { showViewByKey, playerChoice } from '../GameReducer'
import Waiting from './Waiting'
import { GameInfo } from '@library';

const { Phases } = GameInfo

class Footer extends Component {
    _renderOption = (item) => {
        return (
            <TouchableOpacity
                key={item.label}
                style={styles.item}
                onPress={this._onPress.bind(this, item.onPress)}
                activeOpacity={0.6}
            >
                <Icon
                    name={item.icon}
                    size={25}
                    color="#fff"
                />
                <Text style={styles.title}>{item.label}</Text>
                <Text style={styles.subtitle}>{item.detail}</Text>
            </TouchableOpacity>
        )
    }

    _onPress = (onPress) => {
        switch(typeof onPress) {
            case 'number':
                this.props.playerChoice(onPress)
                break
            case 'string':
                this.props.showViewByKey(onPress)
                break
            default:
        }
    }

    render() {
        const { gameState } = this.props
        return (
            <View style={styles.footer}>
                {Phases[gameState.phase].choices.map(this._renderOption)}
                <Waiting/>
            </View>
        )
    }
}

const styles = {
    footer: {
        height: 150,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: '#b6b6b6',
    },
    item: {
        alignItems: 'center',
        flex: 0.4,
    },
    title: {
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        color: '#e6e6e6',
        textAlign: 'center',
    }
}

export default connect(
    state => ({
        gameState: state.lobby.gameState,
    }),
    {
        showViewByKey,
        playerChoice,
    }
)(Footer)