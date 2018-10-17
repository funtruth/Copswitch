import React, { Component } from 'react'
import {
    Animated,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'

import LobbyModalHeader from './LobbyModalHeader'
import LobbyModalFooter from './LobbyModalFooter'
import { showModalByKey } from '../GameReducer'

const AnimatedOpacity = Animated.createAnimatedComponent(TouchableOpacity)

class LobbyModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVal: new Animated.Value(0),
            visible: false,
        }
    }

    componentWillReceiveProps(newProps) {
        this._animate(newProps.modalView === this.props.type)
    }

    _animate(val) {
        this.setState({
            visible: val
        })
        Animated.timing(
            this.state.modalVal, {
                toValue: val ? 1 : 0,
                duration: 350,
                useNativeDriver: true
            }
        ).start()
    }

    _onClose = () => {
        this.props.showModalByKey(null)
    }
    
    render() {
        if (!this.state.visible) return null

        return (
            <AnimatedOpacity
                style={[
                    styles.modal,
                    {
                        opacity: this.state.modalVal,
                    }
                ]}
                onPress={this._onClose}
                activeOpacity={1}
            >
                <TouchableOpacity
                    style={styles.safezone}
                    activeOpacity={1}
                >
                    <LobbyModalHeader title={this.props.title}/>
                    {this.props.children}
                    <LobbyModalFooter/>
                </TouchableOpacity>
            </AnimatedOpacity>
        )
    }
}

const styles = {
    modal: {
        position: 'absolute',
        top: 0, bottom: 0,
        left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    safezone: {
        position: 'absolute',
        top: 70, bottom: 65,
        left: 20, right: 20,
        backgroundColor: '#2a2d32',
        borderRadius: 2,
        borderWidth: 0.5,
        borderColor: '#183654',
        paddingLeft: 8,
        paddingRight: 8,
    },
}

export default connect(
    state => ({
        modalView: state.game.modalView,
    }),
    {
        showModalByKey,
    }
)(LobbyModal)
