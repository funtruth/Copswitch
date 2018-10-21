import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
}   from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'

import { playerChoice } from '../GameReducer'
import { showGameViewByKey } from '../../common/ViewReducer'
import { GameInfo } from '@library';

const { Phases } = GameInfo

class GameChoice extends Component {
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
                this.props.showGameViewByKey(onPress)
                break
            default:
        }
    }

    render() {
        const { gameState } = this.props
        return (
            <View style={styles.footer}>
                {Phases[gameState.phase].choices.map(this._renderOption)}
            </View>
        )
    }
}

const styles = {
    footer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        showGameViewByKey,
        playerChoice,
    }
)(GameChoice)