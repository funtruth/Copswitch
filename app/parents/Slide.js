import React, { Component } from 'react';
import { View, Animated } from 'react-native';

const MARGIN = 10;

export class Slide extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            opacity: new Animated.Value(0),
        }
    }

    componentDidMount(){
        this.animate()
    }

    animate(){
        Animated.timing(
            this.state.opacity, {
                toValue:1,
                duration:150
            }
        ).start()
    }

    render() {

        return (
            <Animated.View style = {{ 
                opacity: this.state.opacity,
                transform: [{
                    translateX: this.state.opacity.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [-MARGIN, -MARGIN/2, 0],
                    })
                }]
            }}>
                {this.props.children}
            </Animated.View>
        )
    }
}
