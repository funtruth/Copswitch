import React, { Component } from 'react'
import {
    Text,
    Animated,
    TouchableOpacity,
}   from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'

import { playerChoice } from '../GameReducer'

const AnimatedOpacity = Animated.createAnimatedComponent(TouchableOpacity)

class Footer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            myReadyVal: new Animated.Value(props.myReady ? 1 : 0)
        }
    }

    componentWillReceiveProps(newProps) {
        Animated.timing(
            this.state.myReadyVal, {
                toValue: newProps.myReady ? 1 : 0,
                duration: 350,
                useNativeDriver: true
            }
        ).start()
    }

    _onCancel = () => {
        this.props.playerChoice(null)
    }

    render() {
        if (!this.props.myReady) return null

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
                        Waiting
                    </Text>
                    <Text style={styles.subtitle}>
                        for other players
                    </Text>
                    <AnimatedOpacity 
                        style={styles.cancel}
                        onPress={this._onCancel}
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
                    </AnimatedOpacity>
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
        myReady: state.game.myReady,
    }),
    {
        playerChoice,
    }
)(Footer)