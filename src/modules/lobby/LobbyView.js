import React, { Component } from 'react';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'

import { inGameStatus } from '../loading/LoadingReducer'
import { showModalByKey } from '../common/ViewReducer'

import NavigationTool from '../navigation/NavigationTool'
import {statusType, modalType} from '../common/types'

import Header from './temp/Header';
import Footer from './temp/Footer';
import MyName from './modals/MyName';
import Body from './temp/Body';
    
class LobbyView extends Component {
    componentDidMount() {
        this.props.showModalByKey(modalType.myName)
    }

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
                <Body/>
                <Footer/>
                <MyName/>
            </LinearGradient>
        )
    }
}

const styles = {
    container:{
        backgroundColor: '#2a3743',
        flex: 1,
        width: '100%',
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
        showModalByKey,
    }
)(LobbyView)