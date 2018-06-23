import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { turnOnGameListeners } from '../game/GameReducer'
import { setupAndStartGame } from './PregameReducer';

import NavigationTool from '../navigation/NavigationTool'

class PregameScreen extends Component {
    componentDidMount() {
        const { roomStatus, ownership } = this.props
        console.log('props didmount', roomStatus, ownership)
        if (roomStatus === 'Starting' && ownership) {
            this.props.setupAndStartGame()
        }
    }

    componentWillReceiveProps(newProps){
        const { roomStatus } = newProps
        console.log('props', newProps)

        if (roomStatus === 'Running') {
            this.props.turnOnGameListeners()
            NavigationTool.navigate('Game')
        }
    }

    render() {
        return <View style = {{flex:1, backgroundColor:'red'}}/>
    }
}

export default connect(
    state => ({
        roomStatus: state.lobby.roomStatus,
        ownership: state.owner.ownership
    }),
    dispatch => {
        return {
            setupAndStartGame: () => dispatch(setupAndStartGame()),
            turnOnGameListeners: () => dispatch(turnOnGameListeners())
        }
    }
)(PregameScreen)