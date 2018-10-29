import React, { Component } from 'react'
import {
    Animated,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'

import { Constants } from '../config'
import {alertType} from '../types'

import { showAlertByKey } from '../ViewReducer'
import ConfirmBack from './ConfirmBack';

const AnimatedOpacity = Animated.createAnimatedComponent(TouchableOpacity)

class AlertView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVal: new Animated.Value(0),
            visible: false,
        }
    }

    componentWillReceiveProps(newProps) {
        this._animate(newProps.alertView)
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
        this.props.showAlertByKey()
    }

    _renderAlert() {
        switch(this.props.alertView) {
            case alertType.confirmBack:
                return (
                    <ConfirmBack/>
                )
            default:
                return null
        }
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
                    {this._renderAlert()}
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
        justifyContent: 'center',
    },
    safezone: {
        position: 'absolute',
        left: 8, right: 8,
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
        alertView: state.view.alertView,
    }),
    {
        showAlertByKey,
    }
)(AlertView)
