import React, { Component } from 'react'
import {
    Animated,
} from 'react-native'
import { connect } from 'react-redux'

class AlertView extends Component {
    render() {
        return (
            <Animated.View
                style={[
                    styles.alert
                ]}
            >


            </Animated.View>
        )
    }
}

const styles = {
    alert: {
        position: 'absolute',
    }
}

export default connect(
    
)(AlertView)