import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'

class Button extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pressed: false
        }
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
        const { buttonStyle, disabledStyle } = styles

        return (
            <TouchableOpacity
                { ...this.props}
                style={[disabled?disabledStyle:buttonStyle, style]}
                onPressIn={this._handlePressIn}
                onPressOut={this._handlePressOut}
                activeOpacity={0.9}
            >
                {this.state.pressed?<View style={{height:3}}/>:null}
                {this.props.children}
                {this.state.pressed?this.renderShadow():null}
            </TouchableOpacity>
        )
    }
}

const styles = {
    buttonStyle: {
        backgroundColor: '#A6895D',
        alignItems: 'center',
        overflow: 'hidden'
    },
    disabledStyle: {
        backgroundColor: '#A6895D',
        alignItems: 'center',
        overflow: 'hidden',
        opacity: 0.8
    }
}

export default Button