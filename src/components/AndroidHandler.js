import React, { Component } from 'react'
import { StatusBar, BackHandler } from 'react-native'
import { connect } from 'react-redux'

class AndroidHandler extends Component {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        return true
    }

    render() {
        return (
            <StatusBar backgroundColor={'rgba(0,0,0,1)'}/>
        )
    }
}

export default connect(
    null,
    {

    }
)(AndroidHandler)