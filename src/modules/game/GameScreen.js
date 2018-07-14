import React, { Component } from 'react'
import {
    ScrollView
}   from 'react-native'
import { connect } from 'react-redux'
import { Styler } from '@common'

import LinearGradient from 'react-native-linear-gradient'
import { ConsoleView, GameTimer, General, PlayerListView, Private, PrivateNewsView, PrivateRoleView } from './components'

class GameScreen extends Component {
    render() {
        const { news, events, roleid } = this.props
        
        return (
            <LinearGradient colors={Styler.color.gradient} style = {{flex:1, width: '100%'}}>
                <ScrollView>
                    <ScrollView horizontal>
                        <ConsoleView />
                        <GameTimer />
                    </ScrollView>

                    <PlayerListView />
                </ScrollView>
                <General news={news}/>
                <PrivateNewsView events={events}/>
                <PrivateRoleView roleid={roleid}/>
            </LinearGradient>
        )
    }
}

export default connect(
    state => ({
        ready: state.game.myReady,
        roleid: state.game.roleid,
        news: state.game.news,
        events: state.game.events
    })
)(GameScreen)