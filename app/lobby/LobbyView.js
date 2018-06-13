import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
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
import LobbyRolesView from './screens/LobbyRolesView';
import LobbySetupView from './screens/LobbySetupView';

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
        const { container, content, contentContainer } = styles

        return (
            <LinearGradient colors={['#3A2F26', '#2E2620']} style={container}>
                <Header icon='chevron-left' onPress={leaveLobby}>{roomId}</Header>
                <ScrollView
                    style={content}
                    contentContainerStyle={contentContainer}
                    horizontal={true}
                    pagingEnabled={true}
                >
                    <LobbyPlayerView />
                    <LobbySetupView />
                    <LobbyRolesView />
                </ScrollView>
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
    content: {
        height: 0.7*height,
        width
    },
    contentContainer: {
        justifyContent: 'center'
    }
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