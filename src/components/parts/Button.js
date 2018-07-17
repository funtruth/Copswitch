import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'

const { height, width } = Dimensions.get('window')

class Button extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pressed: false
        }
    }

    _handlePressIn = () => {
        this.setState({
            pressed: true
        })
    }

    _handlePressOut = () => {
        this.setState({
            pressed: false
        })
    }

    renderShadow = () => {
        return (
            <LinearGradient
                style={{position: 'absolute', top: 0, height: 6, left:0, right:0}}
                colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.005)']}
            />
        )
    }

    render() {
        const { style, disabled } = this.props
        const { pressed } = this.state
        const { defaultStyle, buttonStyle, disabledStyle } = styles

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                { ...this.props}
                style={[defaultStyle, disabled ? disabledStyle : buttonStyle, style]}
                onPressIn={this._handlePressIn}
                onPressOut={this._handlePressOut}
            >
                {pressed && <View style={{height:3}}/>}
                {this.props.children}
                {pressed && this.renderShadow()}
            </TouchableOpacity>
        )
    }
}

const styles = {
    defaultStyle: {
        width: 0.45*width,
        height: 0.15*width,
        alignSelf: 'center',
        alignItems: 'center'
    },
    buttonStyle: {
        backgroundColor: '#A6895D',
        overflow: 'hidden'
    },
    disabledStyle: {
        backgroundColor: '#A6895D',
        overflow: 'hidden',
        opacity: 0.8
    }
}

export default Button