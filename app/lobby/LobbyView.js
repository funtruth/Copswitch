import React, { Component } from 'react';
import {
    Text,
    View,
    Dimensions,
    AsyncStorage,
}   from 'react-native';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import { ActivityLogView, OptionView } from './components'
import LobbyNameModal from './screens/LobbyNameModal'

import NavigationTool from '../navigation/NavigationTool'
import LobbyPlayerView from './screens/LobbyPlayerView';
import { Header } from '../components';

const { height, width } = Dimensions.get('window')

class LobbyView extends Component {
    componentWillReceiveProps(newProps){
        if(newProps.roomStatus === 'Starting'){
            AsyncStorage.setItem('GAME-KEY', newProps.roomId)
            .then(()=>{
                NavigationTool.navigate('Pregame')
            })
        }
    }

    _onIconPress = () => {
        NavigationTool.reset('HomeNav')
    }

    render() {
        const { roomId } = this.props
        const { container, title, code } = styles

        return (
            <LinearGradient colors={['#3A2F26', '#2E2620']} style={container}>
                <Header icon='chevron-left' onPress={this._onIconPress}>{roomId}</Header>
                <LobbyPlayerView />
                <OptionView />
                <LobbyNameModal/>
            </LinearGradient>
        )
    }
}

const styles = {
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title : {
        fontSize: 17,
        fontFamily: 'FredokaOne-Regular',
        color: '#FFFFFF',
    },
    code : {
        fontSize: 25,
        fontFamily: 'FredokaOne-Regular',
        color: '#FFFFFF',
    },
}

export default connect(
    state => ({
        roomId: state.lobby.roomId,
        modalView: state.lobby.modalView,
        roomStatus: state.lobby.roomStatus
    })
)(LobbyView)