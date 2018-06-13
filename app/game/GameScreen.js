import React, { Component } from 'react'
import {
    View,
    AsyncStorage,
    Animated,
    ScrollView
}   from 'react-native'
import { connect } from 'react-redux'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ConsoleView, General, Nomination, PlayerListView, Private } from './components'

import NavigationTool from '../navigation/NavigationTool'
import firebaseService from '../firebase/firebaseService'
import ownerModule from './mods/ownerModule'

class GameScreen extends Component {
    render() {
        return (
            <View style = {{flex:1}}>
                <ScrollView>
                    <ScrollView horizontal>
                        <ConsoleView />
                        <ConsoleView />
                    </ScrollView>

                    <PlayerListView />
                </ScrollView>
            </View>
        )
    }
}

export default connect(
    state => ({
        ready: state.game.myReady
    })
)(GameScreen)