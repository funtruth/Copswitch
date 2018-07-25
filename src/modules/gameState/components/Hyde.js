import React, { Component } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'

class Hyde extends Component {
    render() {
        return (
            <Text style={styles.textStyle}>{this.props[this.props.nameState]}</Text>
        )
    }
}

const styles = {
    textStyle: {
        color: 'white'
    }
}

export default connect(
    state => ({
        nameState: state.gameState.nameState
    })
)(Hyde)