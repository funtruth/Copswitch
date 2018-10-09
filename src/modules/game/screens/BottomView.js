import React, { Component } from 'react'
import { View, Animated, Dimensions } from 'react-native'
import { connect } from 'react-redux'

import BottomBar from '../components/BottomBar'

import { toggleBottomView } from '../GameReducer'

const { height, width } = Dimensions.get('window')
const REST_HEIGHT = 45
const MODAL_HEIGHT = 0.8 * height
const SPRING_MARGIN = 25

class BottomView extends Component {
    render() {
        return (
            <Animated.View
                style={[
                    styles.bottomContainer,
                    {
                        transform: [
                            { translateY: this.props.bottomState.interpolate({
                                inputRange: [0 ,1],
                                outputRange: [MODAL_HEIGHT - REST_HEIGHT, 0]
                            }) }
                        ]
                    }
                ]}
            >
                <BottomBar/>
            </Animated.View>
        )
    }
}

const styles = {
    bottomContainer: {
        position: 'absolute',
        top: height - MODAL_HEIGHT, height: MODAL_HEIGHT + SPRING_MARGIN,
        left: 0, width,
        backgroundColor: '#2a3743',
    },
}

export default connect(
    null,
    {
        toggleBottomView,
    }
)(BottomView)