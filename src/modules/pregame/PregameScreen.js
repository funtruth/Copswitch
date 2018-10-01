import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import { turnOnGameListeners } from '../game/GameReducer'
import { setupAndStartGame } from './PregameReducer';
import {statusType} from '../common/types'

import NavigationTool from '../navigation/NavigationTool'

class PregameScreen extends Component {
    componentDidMount() {
        const { status, ownership } = this.props
        this.props.turnOnGameListeners()
        
        if (status === statusType.pregame && ownership) {
            this.props.setupAndStartGame()
        }
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
        status: state.lobby.status,
        ownership: state.owner.ownership
    }),
    dispatch => {
        return {
            setupAndStartGame: () => dispatch(setupAndStartGame()),
            turnOnGameListeners: () => dispatch(turnOnGameListeners())
        }
    }
)(PregameScreen)