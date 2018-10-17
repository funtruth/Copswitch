import React, { Component } from 'react'
import LinearGradient from 'react-native-linear-gradient'

import Header from './temp/Header';
import Body from './temp/Body';
import Footer from './temp/Footer'
import Lobby from './components/Lobby'
import MyRole from './components/MyRole';

class GameView extends Component {
    render() {
        return (
            <LinearGradient
                colors={['#374e60', '#111111']}
                start={{x:0, y:0}}
                end={{x:0, y:1}}
                style = {styles.container}
            >
                <Header/>
                <Body/>
                <Footer/>
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

export default GameView