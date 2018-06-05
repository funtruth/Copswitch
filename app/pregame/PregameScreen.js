import React, { Component } from 'react'
import { View } from 'react-native'

import NavigationTool from '../navigation/NavigationTool'
import firebaseService from '../firebase/firebaseService'
import ownerModule from '../game/mods/ownerModule'

class PregameScreen extends Component {

    componentWillMount() {
        Promise.all([
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