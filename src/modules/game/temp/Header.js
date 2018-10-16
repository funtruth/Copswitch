import React, { Component } from 'react'
import {
    View,
    Text,
}   from 'react-native'
import { GameInfo } from '@library';
import { statusType } from '../../common/types';

const { Phases } = GameInfo

class Header extends Component {
    render() {
        const { config, gameState } = this.props
        if (config.status !== statusType.game) return null

        return (
            <View style={styles.header}>
                <Text style={styles.title}>{Phases[gameState.phase].name}</Text>
                <Text style={styles.subtitle}>{Phases[gameState.phase].message}</Text>
            </View>
        )
    }
}

const styles = {
    header: {
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#b6b6b6',
    },
    title: {
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
        color: '#fff',
    },
    subtitle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        color: '#d6d6d6'
    }
}

export default Header