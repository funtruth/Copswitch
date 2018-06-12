import React, { Component } from 'react';
import {
    Text,
    View,
    Dimensions,
    AsyncStorage,
}   from 'react-native';
import { connect } from 'react-redux'
import { leaveLobby } from './LobbyReducer'
import LinearGradient from 'react-native-linear-gradient'

import NavigationTool from '../navigation/NavigationTool'
import { Header } from '../components';
import LobbyPlayerView from './screens/LobbyPlayerView';
import LobbyNameModal from './screens/LobbyNameModal'

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
    
    render() {
        const { roomId, leaveLobby } = this.props
        const { container, title, code } = styles

        return (
            <LinearGradient colors={['#3A2F26', '#2E2620']} style={container}>
                <Header icon='chevron-left' onPress={leaveLobby}>{roomId}</Header>
                <LobbyPlayerView />
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
        roomStatus: state.lobby.roomStatus
    }),
    dispatch => {
        return {
            leaveLobby: () => dispatch(leaveLobby())
        }
    }
)(LobbyView)