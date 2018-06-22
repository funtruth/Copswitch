import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { turnOnGameListeners } from '../game/GameReducer'
import { setupAndStartGame } from './PregameReducer';

import NavigationTool from '../navigation/NavigationTool'
import firebaseService from '../firebase/firebaseService'
import ownerModule from '../game/mods/ownerModule'

class PregameScreen extends Component {
    componentDidMount() {
        ownerModule.initOwnerRefs()
        let ownership = ownerModule.checkOwnership()
        if (ownership) {
            //this.props.setupAndStartGame()
        }
    }

    componentWillReceiveProps(newProps){
        console.log('receiving new props', newProps)
        const { roomStatus, roleid } = newProps

        //TODO consider adding more criteria to get in game
        if(!roleid) return
        
        console.log('status', roomStatus, roleid)
        //TODO does this trigger when in stack?
        if(roomStatus === 'Running'){
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
        roleid: state.game.roleid
    }),
    dispatch => {
        return {
            setupAndStartGame: () => dispatch(setupAndStartGame()),
            turnOnGameListeners: () => dispatch(turnOnGameListeners())
        }
    }
)(PregameScreen)