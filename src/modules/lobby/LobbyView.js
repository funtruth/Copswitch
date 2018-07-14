import React, { Component } from 'react';
import {
    ScrollView,
    Dimensions,
}   from 'react-native';
import { connect } from 'react-redux'
import { leaveLobby } from './LobbyReducer'
import LinearGradient from 'react-native-linear-gradient'

import { NavigationTool } from '@navigation'
import { Header } from '@components'

import LobbyPlayerView from './screens/LobbyPlayerView'
import LobbyNameModal from './screens/LobbyNameModal'
import LobbyRolesView from './screens/LobbyRolesView'
import LobbySetupView from './screens/LobbySetupView'

import LobbyOptionView from './components/LobbyOptionView'

const { height, width } = Dimensions.get('window')

class LobbyView extends Component {
    componentWillReceiveProps(newProps){
        if(newProps.roomStatus === 'Starting'){
            NavigationTool.navigate('Pregame')
        }
    }
    
    render() {
        const { roomId, leaveLobby } = this.props
        const { container, content, contentContainer } = styles

        return (
            <LinearGradient colors={['#3A2F26', '#2E2620']} style={container}>
                <Header icon='angle-left' onPress={leaveLobby}>{roomId}</Header>
                <ScrollView
                    style={content}
                    contentContainerStyle={contentContainer}
                    horizontal={true}
                    pagingEnabled={true}
                >
                    <LobbyPlayerView />
                    <LobbyRolesView />
                    <LobbySetupView />
                </ScrollView>
                <LobbyOptionView />
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
        width,
        borderWidth: 1
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