import React, { Component } from 'react'
import {
    View,
    Text,
}   from 'react-native'
import { connect } from 'react-redux'
import { GameInfo } from '@library';

const { Phases } = GameInfo

class Header extends Component {
    render() {
        const { gameState } = this.props
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

export default connect(
    state => ({
        gameState: state.lobby.gameState,
    }),
)(Header)