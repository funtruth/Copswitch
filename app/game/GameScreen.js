import React, { Component } from 'react'
import {
    View,
    AsyncStorage,
    Animated,
    ScrollView
}   from 'react-native'
import { connect } from 'react-redux'
import { Styler } from '@common'

import LinearGradient from 'react-native-linear-gradient'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ConsoleView, GameTimer, General, Nomination, PlayerListView, Private } from './components'

import NavigationTool from '../navigation/NavigationTool'
import firebaseService from '../firebase/firebaseService'

class GameScreen extends Component {
    render() {
        return (
            <LinearGradient colors={Styler.colors.gradient} style = {{flex:1, width: '100%'}}>
                <ScrollView>
                    <ScrollView horizontal>
                        <ConsoleView />
                        <GameTimer />
                    </ScrollView>

                    <PlayerListView />
                </ScrollView>
                <General />
            </LinearGradient>
        )
    }
}

export default connect(
    state => ({
        ready: state.game.myReady
    })
)(GameScreen)