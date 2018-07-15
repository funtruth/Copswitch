import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

class PregameScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    render() {
        return (
            <View style = {{flex:1, backgroundColor:'red'}}>

            </View>
        )
    }
}

export default connect(
    null
)(PregameScreen)