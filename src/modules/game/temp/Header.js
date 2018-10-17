import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
}   from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'

import { GameInfo } from '@library';
import { showModalByKey } from '../GameReducer'

const { Phases } = GameInfo

class Header extends Component {
    _renderIconButton() {
        return (
            <TouchableOpacity
                style={[
                    styles.item,
                ]}
                onPress={this._showLobby}
                activeOpacity={0.6}
            >
                <Icon
                    name={item.icon}
                    size={25}
                    color={selected?'#66c0f4':"#fff"}
                />
                <Text
                    style={[
                        styles.title,
                        selected && { color: '#66c0f4' }
                    ]}
                >{item.label}</Text>
            </TouchableOpacity>
        )
    }

    _showLobby = () => {
        this.props.showModalByKey('lobby')
    }

    _showPersonal = () => {

    }

    _getTitle() {
        const { gameState } = this.props
        if (gameState.phase === 1) {
            return Phases[gameState.phase].name
        }
        return `${Phases[gameState.phase].name} ${gameState.dayNum}`
    }

    _getMessage() {
        const { gameState, lobby } = this.props
        if (lobby.length === 0) return ''
        if (gameState.phase === 1) {
            return Phases[gameState.phase].message + lobby.find(i => i.uid === gameState.nominate).name
        }
        return Phases[gameState.phase].message
    }

    render() {
        return (
            <View style={styles.header}>
                <TouchableOpacity
                    style={[
                        styles.item,
                        { left: 20 }
                    ]}
                    onPress={this._showLobby}
                    activeOpacity={0.6}
                >
                    <Icon
                        name="ios-people"
                        size={25}
                        color="#fff"
                    />
                    <Text style={styles.label}>Players</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.title}>{this._getTitle()}</Text>
                    <Text style={styles.subtitle}>{this._getMessage()}</Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.item,
                        { right: 20 }
                    ]}
                    onPress={this._showPersonal}
                    activeOpacity={0.6}
                >
                    <Icon
                        name="ios-contact"
                        size={25}
                        color="#fff"
                    />
                    <Text style={styles.label}>My Role</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = {
    header: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#b6b6b6',
    },
    title: {
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        color: '#d6d6d6'
    },
    item: {
        position: 'absolute',
        alignItems: 'center',
    },
    label: {
        fontFamily: 'Roboto-Regular',
        fontSize: 11,
        color: '#d6d6d6'
    }
}

export default connect(
    state => ({
        gameState: state.lobby.gameState,
        lobby: state.lobby.lobby,
    }),
    {
        showModalByKey,
    }
)(Header)