import React, { Component } from 'react'
import {
    View,
    Text,
}   from 'react-native'
import colors from '../misc/colors.js'

import NavigationTool from '../navigation/NavigationTool'
import firebaseService from '../firebase/firebaseService'
import playerModule from './mods/playerModule'
import ownerModule from './mods/ownerModule'

class PregameScreen extends Component {

constructor(props) {
    super(props);
    

}

componentWillMount() {
    Promise.all([
        playerModule.initGame(),
        playerModule.loadPlayerList(),
        ownerModule.initGame(),
    ]).then(()=>{
        NavigationTool.navigate('Game')
    })

}

componentWillUnmount() {

}

    render() {

        return <View style = {{flex:1}}>

        

        </View>
    }
}

const styles = {
    
    
}

export default PregameScreen