import React, { Component } from 'react'
import { View } from 'react-native'

import NavigationTool from '../navigation/NavigationTool'
import firebaseService from '../firebase/firebaseService'
import playerModule from './mods/playerModule'
import ownerModule from './mods/ownerModule'

class PregameScreen extends Component {

    componentWillMount() {
        Promise.all([
            playerModule.initGame(),
            playerModule.loadPlayerList(),
            ownerModule.initGame(),
        ]).then(()=>{
            NavigationTool.navigate('Game')
        })
    }

    render() {
        return <View style = {{flex:1}}/>
    }
}

export default PregameScreen