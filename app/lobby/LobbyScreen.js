
import React, { Component } from 'react';
import {
    Text,
    View,
    Dimensions,
    AsyncStorage,
}   from 'react-native';
import { connect } from 'react-redux'
import { pushNewListener, newLobbyInfo } from './LobbyReducer'

import NavigationTool from '../navigation/NavigationTool'
import firebaseService from '../firebase/firebaseService.js';

import colors from '../misc/colors.js';

import { ActivityLogView, NameView, OptionView } from './components'
import { RoleView } from '../components/RoleView.js';
import { Alert } from '../components/Alert.js';

const { height, width } = Dimensions.get('window')

class LobbyScreen extends Component {
    listening = false

    componentWillMount(){
        if(!this.listening) this.turnOnLobbyListeners()
    }

    turnOnLobbyListeners(){
        this.listening = true
        this.lobbyListenerOn('owner','owner','value')
        this.lobbyListenerOn('name',`lobby/${firebaseService.getUid()}`,'value')
        this.lobbyListenerOn('lobby','lobby','value')
        this.lobbyListenerOn('place','place','value')
        this.lobbyListenerOn('log','log','child_added')
        this.lobbyListenerOn('roles','roles','value')
        this.lobbyListenerOn('status','status','value')
    }

    lobbyListenerOn(listener,listenerPath,listenerType){
        let listenerRef = firebaseService.fetchRoomRef(listenerPath)
        this.props.pushNewListener(listenerRef)
        listenerRef.on(listenerType, snap => {
            this.props.newLobbyInfo(snap, listener)
        })
    }
    
    componentWillReceiveProps(newProps){
        if(newProps.roomStatus === 'Starting'){
            AsyncStorage.setItem('GAME-KEY', newProps.roomId)
            .then(()=>{
                NavigationTool.navigate('Pregame')
            })
        }
    }

    render() {
        return <View style = {{flex:1, backgroundColor:colors.background, 
            justifyContent:'center', alignItems:'center'}}>
        
            <View style = {{ height:height*0.1, justifyContent:'center', alignItems:'center' }}>
                <Text style = {styles.title}>Room</Text>
                <Text style = {styles.code}>{ this.props.roomId }</Text>
            </View>

            <NameView />

            <View style = {{height:height*0.6}}>
                <Alert visible = {!this.props.modalView} flex={0.6}>
                    <ActivityLogView />
                </Alert>

                <Alert visible = {this.props.modalView === 'roles'} flex={0.5}>
                    <RoleView rolepress = { (key,change) => firebaseService.changeRoleCount(key,change) }/>
                </Alert>
            </View>

            <OptionView />
        </View>
    }
}

const styles = {
    title : {
        fontSize: 17,
        fontFamily: 'FredokaOne-Regular',
        color: colors.striker,
    },
    code : {
        fontSize: 25,
        fontFamily: 'FredokaOne-Regular',
        color: colors.font,
    },
}

export default connect(
    state => ({
        roomId: state.lobby.roomId,
        username: state.lobby.username,
        modalView: state.lobby.modalView,
        roomStatus: state.lobby.roomStatus
    }),
    dispatch => {
        return {
            pushNewListener: (listenerRef) => dispatch(pushNewListener(listenerRef)),
            newLobbyInfo: (snap, listener) => dispatch(newLobbyInfo(snap,listener))
        }
    }
)(LobbyScreen)