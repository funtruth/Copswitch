import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

class Button extends React.Component {
    state = {
        pressed: false
    }

    componentWillMount() {
        let { height, width } = this.props.style
        if (!height || !width) {
            console.warn('Custom Button is missing a Dimension')
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

    render() {
        const { style } = this.props
        const { height, width } = style
        const { button } = styles
        
        let buttonStyle = [style, button]
        let containerStyle = []

        if (this.state.pressed) {
            containerStyle.push({
                height, width,
                borderColor: '#000000',
                borderRadius: 2,
                borderWidth: 0,
                borderTopWidth: 3,
                borderLeftWidth: 3
            })
            buttonStyle.push({
                height: height - 4,
                width: width - 4
            })
        }

        return (
            <View style={containerStyle}>
                <TouchableOpacity
                    { ...this.props}
                    style={buttonStyle}
                    onPressIn={this._handlePressIn}
                    onPressOut={this._handlePressOut}
                    activeOpacity={0.8}
                >
                    {this.props.children}
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = {
    button: {
        backgroundColor: '#A6895D',
        borderRadius: 2,
        alignItems: 'center'
    }
}

export default Button