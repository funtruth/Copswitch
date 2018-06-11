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
        const { container, title, code } = styles

        return (
            <LinearGradient colors={['#3A2F26', '#2E2620']} style={container}>
                <View style = {{ height:height*0.1, justifyContent:'center', alignItems:'center' }}>
                    <Text style = {title}>Room</Text>
                    <Text style = {code}>{ this.props.roomId }</Text>
                </View>
                <View style = {{height:height*0.6}}>
                    <ActivityLogView />
                </View>
                <OptionView />
                <LobbyNameModal/>
            </LinearGradient>
        )
    }
}

const styles = {
    container:{
        flex: 1,
        alignItems: 'center'
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