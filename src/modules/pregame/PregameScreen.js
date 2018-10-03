import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import { turnOnGameListeners } from '../game/GameReducer'
import {statusType} from '../common/types'

import NavigationTool from '../navigation/NavigationTool'

class PregameScreen extends Component {
    componentDidMount() {
        this.props.turnOnGameListeners()
    }

    componentWillReceiveProps(newProps){
        const { status } = newProps

        if (status === statusType.game) {
            NavigationTool.navigate('Game')
        }
    }

    render() {
        return <View style = {{flex:1, backgroundColor:'red'}}/>
    }
}

export default connect(
    state => ({
        status: state.lobby.config.status,
    }),
    dispatch => {
        return {
            turnOnGameListeners: () => dispatch(turnOnGameListeners())
        }
    }
)(PregameScreen)