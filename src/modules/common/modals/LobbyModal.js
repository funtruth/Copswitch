import React, { Component } from 'react'
import {
    Animated,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'

import { Constants } from '../config'
import LobbyModalHeader from './LobbyModalHeader'
import LobbyModalFooter from './LobbyModalFooter'
import { showModalByKey } from '../ViewReducer'

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
                duration: 250,
                useNativeDriver: true
            }
        ).start()
    }

    _onClose = () => {
        this.props.showModalByKey()
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
                    <LobbyModalHeader
                        title={this.props.title}
                        onClose={this._onClose}
                    />
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
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    safezone: {
        position: 'absolute',
        top: Constants.headerHeight - 10, bottom: Constants.footerHeight - 15,
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
        modalView: state.view.modalView,
    }),
    {
        showModalByKey,
    }
)(LobbyModal)
