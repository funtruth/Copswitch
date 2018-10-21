import React, { Component } from 'react';
import { connect } from 'react-redux'
import { inGameStatus } from '../loading/LoadingReducer'
import LinearGradient from 'react-native-linear-gradient'

import NavigationTool from '../navigation/NavigationTool'
import {statusType} from '../common/types'

import Header from './temp/Header';
import Footer from './temp/Footer';
import MyName from './modals/MyName';

class LobbyView extends Component {
    componentWillReceiveProps(newProps){
        if(newProps.config.status === statusType.pregame){
            //TODO move to reducer?
            NavigationTool.navigate('Game')
            this.props.inGameStatus()
        }
    }
    
    render() {
        const { container } = styles

        return (
            <LinearGradient
                colors={['#3A2F26', '#2E2620']}
                style={container}
            >
                <Header/>
                <Footer/>
                <MyName/>
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
}

export default connect(
    state => ({
        lobby: state.lobby.lobby,
        myInfo: state.lobby.myInfo,
        config: state.lobby.config,
    }),
    {
        inGameStatus,
    }
)(LobbyView)