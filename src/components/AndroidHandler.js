import React, { Component } from 'react'
import { StatusBar, BackHandler } from 'react-native'
import { connect } from 'react-redux'

import { toggleBottomView } from '../modules/game/GameReducer'

class AndroidHandler extends Component {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        const { showBottomView } = this.props
        if (showBottomView) {
            this.props.toggleBottomView()
            return true
        }
        return false
    }

    render() {
        return (
            <StatusBar backgroundColor={'rgba(0,0,0,1)'}/>
        )
    }
}

export default connect(
    state => ({
        showBottomView: state.home.showBottomView,
    }),
    { toggleBottomView }
)(AndroidHandler)