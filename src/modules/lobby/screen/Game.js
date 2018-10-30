import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
}   from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'

import {db} from '@services'

import { startPregame } from '../LobbyReducer'

class Game extends Component {
    _renderStart () {
        return (
            <TouchableOpacity
                style={styles.optionButton}
                onPress={this.props.startPregame}
            >
                <Text style={styles.optionText}>Start Game</Text>
                <Icon name="ios-happy" size={25} color='#fff'/>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View
                style={[
                    styles.item,
                ]}
            >
                <Icon
                    name="ios-flame"
                    size={25}
                    color="#fff"
                />
                <Text style={styles.title}>
                    Playing
                </Text>
                <Text style={styles.subtitle}>
                    Mafia
                </Text>
                <View style={styles.options}>
                    {this.props.owner === db.getUid() && this._renderStart()}
                </View>
            </View>
        )
    }
}

const styles = {
    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Roboto-Medium',
        fontSize: 19,
        color: '#e6e6e6',
        textAlign: 'center',
    },
    cancel: {
        flexDirection: 'row',
        padding: 5,
    },
    options: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
    optionText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        color: '#d6d6d6',
        marginRight: 8,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    }
}

export default connect(
    state => ({
        owner: state.lobby.config.owner,
    }),
    {
        startPregame,
    }
)(Game)