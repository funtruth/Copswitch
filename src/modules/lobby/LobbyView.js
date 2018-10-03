import React, { Component } from 'react';
import {
    ScrollView,
    Dimensions,
}   from 'react-native';
import { connect } from 'react-redux'
import { leaveLobby } from './LobbyReducer'
import LinearGradient from 'react-native-linear-gradient'

import NavigationTool from '../navigation/NavigationTool'
import { Header } from '@components'
import {statusType} from '../common/types'

import LobbyPlayerView from './screens/LobbyPlayerView'
import LobbyNameModal from './screens/LobbyNameModal'
import LobbyRolesView from './screens/LobbyRolesView'
import LobbySetupView from './screens/LobbySetupView'

import LobbyOptionView from './components/LobbyOptionView'

const { height, width } = Dimensions.get('window')

class LobbyView extends Component {
    componentWillReceiveProps(newProps){
        if(newProps.config.status === statusType.pregame){
            //TODO move to reducer?
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
                    <LobbyPlayerView
                        data={this.props.lobby}
                    />
                    <LobbyRolesView
                        data={this.props.config.roles}
                    />
                    <LobbySetupView/>
                </ScrollView>
                <LobbyOptionView/>
                <LobbyNameModal
                    name={this.props.name}
                    lobby={this.props.lobby}
                />
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
        roomId: state.loading.roomId,
        lobby: state.lobby.lobby,
        myInfo: state.lobby.myInfo,
        config: state.lobby.config,
    }),
    dispatch => {
        return {
            leaveLobby: () => dispatch(leaveLobby())
        }
    }
)(LobbyView)