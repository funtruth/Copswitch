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
import { ConsoleView, GameTimer, General, PlayerListView, Private } from './components'

class GameScreen extends Component {
    render() {
        const { news } = this.props
        
        return (
            <LinearGradient colors={Styler.colors.gradient} style = {{flex:1, width: '100%'}}>
                <ScrollView>
                    <ScrollView horizontal>
                        <ConsoleView />
                        <GameTimer />
                    </ScrollView>

                    <PlayerListView />
                </ScrollView>
                <General news={news}/>
            </LinearGradient>
        )
    }
}

export default connect(
    state => ({
        ready: state.game.myReady,
        roleid: state.game.roleid,
        news: state.game.news
    })
)(GameScreen)