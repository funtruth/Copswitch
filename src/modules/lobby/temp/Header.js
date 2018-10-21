import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
}   from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { leaveLobby } from '../LobbyReducer'

class Header extends Component {
    _leaveLobby = () => {
        this.props.leaveLobby()
    }

    _showPersonal = () => {
    }

    _getTitle() {
        const { roomId } = this.props
        return roomId
    }

    _getMessage() {
        return 'Lobby Code'
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
                        name="ios-arrow-round-back"
                        size={25}
                        color="#fff"
                    />
                    <Text style={styles.label}>Leave</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.title}>{this._getTitle()}</Text>
                    <Text style={styles.subtitle}>{this._getMessage()}</Text>
                </View>
            </View>
        )
    }
}

const styles = {
    header: {
        height: Constants.headerHeight,
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
        roomId: state.loading.roomId,
    }),
    {
        leaveLobby,
    }
)(Header)