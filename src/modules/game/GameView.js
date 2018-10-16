import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'

import Header from './temp/Header';
import Footer from './temp/Footer';

import { showModalByKey } from './GameReducer'
import Body from './temp/Body';

class GameView extends Component {
    render() {
        return (
            <LinearGradient
                colors={['#374e60', '#111111']}
                start={{x:0, y:0}}
                end={{x:0, y:1}}
                style = {styles.container}
            >
                <Header
                    config={this.props.config}
                    gameState={this.props.gameState}
                />
                <Body
                    showModalByKey={this.props.showModalByKey}
                />
                <Footer
                    gameState={this.props.gameState}
                    showModalByKey={this.props.showModalByKey}
                />
            </LinearGradient>
        )
    }
}

const styles = {
    container: {
        backgroundColor: '#2a3743',
        flex: 1,
        width: '100%',
    }
}

export default connect(
    state => ({
        config: state.lobby.config,
        gameState: state.lobby.gameState,
        ready: state.game.myReady,
        roleId: state.lobby.myInfo.roleId,
        news: state.game.news,
        events: state.game.events,
    }),
    {
        showModalByKey,
    }
)(GameView)