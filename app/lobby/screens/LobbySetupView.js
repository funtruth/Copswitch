import React, { Component } from 'react'
import { View, FlatList, Dimensions } from 'react-native'
import { connect } from 'react-redux'

const { height, width } = Dimensions.get('window')

class LobbySetupView extends Component {
    state = {
        data: []
    }

    render() {
        const { container } = styles

        return (
            <View style={container}>

            </View>
        )
    }
}

const styles = {
    container: {
        height: 0.4*height,
        width
    }
}

export default connect(
    null
)(LobbySetupView)