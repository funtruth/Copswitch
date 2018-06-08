import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { turnOnGameListeners } from '../game/GameReducer'

import NavigationTool from '../navigation/NavigationTool'
import firebaseService from '../firebase/firebaseService'
import ownerModule from '../game/mods/ownerModule'

class PregameScreen extends Component {
    componentDidMount() {
        ownerModule.initOwnerRefs()
        this.props.turnOnGameListeners()
    }

    componentWillReceiveProps(newProps){
        const { status, roleid } = newProps

        //TODO consider adding more criteria to get in game
        if(!roleid) return
        
        //TODO does this trigger when in stack?
        if(status === 'Running'){
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
        roleid: state.game.roleid
    }),
    dispatch => {
        return {
            turnOnGameListeners: () => dispatch(turnOnGameListeners())
        }
    }
)(PregameScreen)