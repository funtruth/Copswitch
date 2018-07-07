import React, { Component } from 'react';
import { View, Animated } from 'react-native';

const MARGIN = 10;

export default class Message extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            opacity: new Animated.Value(0),
            height: new Animated.Value(0)
        }
    }

    componentDidMount(){
        this.animate()
    }

    animate(){
        Animated.sequence([
            Animated.timing(
                this.state.height, {
                    toValue:25,
                    duration:1000
                }
            ),
            Animated.timing(
                this.state.opacity, {
                    toValue:1,
                    duration:500
                }
            )
        ]).start()
            
    }

    render() {
        return (
            <Animated.View style = {[{ 
                opacity: this.state.opacity,
                height: this.state.height,
                transform: [{
                    translateX: this.state.opacity.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [-MARGIN, -MARGIN/2, 0] 
                    })
                }]
            },this.props.style]}>
                {this.props.children}
            </Animated.View>
        )
    }
}
