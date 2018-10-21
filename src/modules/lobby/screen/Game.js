import React, { Component } from 'react'
import {
    Text,
    Animated,
    TouchableOpacity,
}   from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'

import { startPregame } from '../LobbyReducer'

class Game extends Component {
    _onStart = () => {
        this.props.startPregame()
    }

    render() {
        return (
                <Animated.View
                    style={[
                        styles.item,
                        {
                            opacity: this.state.myReadyVal,
                        }
                    ]}
                >
                    <Icon
                        name="ios-alarm"
                        size={25}
                        color="#fff"
                    />
                    <Text style={styles.title}>
                        Playing:
                    </Text>
                    <Text style={styles.subtitle}>
                        Mafia
                    </Text>
                    <TouchableOpacity 
                        style={styles.cancel}
                        onPress={this._onStart}
                    >
                        <Icon
                            name="md-close-circle"
                            size={15}
                            color="#fff"
                            style={{ marginRight: 5 }}
                        />
                        <Text style={styles.subtitle}>
                            Tap to Cancel
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
        )
    }
}

const styles = {
    item: {
        position: 'absolute',
        top: 0, bottom: 0,
        left: 0, right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(17, 17, 17, 0.7)',
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
    },
    cancel: {
        flexDirection: 'row',
        padding: 5,
    }
}

export default connect(
    state => ({
        ownerStatus: state.lobby.config.owner,
    }),
    {
        startPregame,
    }
)(Game)