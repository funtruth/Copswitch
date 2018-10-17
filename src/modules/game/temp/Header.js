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
        const { gameState, lobby } = this.props
        let title, message
        switch(gameState.phase) {
            case 0:
            case 2:
                title = `${Phases[gameState.phase].name} ${gameState.dayNum}`
                message = Phases[gameState.phase].message
                break
            case 1:
                title = Phases[gameState.phase].name
                message = Phases[gameState.phase].message + lobby.find(i => i.uid === gameState.nominate).name
                break
            default:
        }

        return (
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{message}</Text>
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
        lobby: state.lobby.lobby,
    }),
)(Header)