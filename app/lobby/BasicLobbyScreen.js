
import React, { Component } from 'react';
import {
    Text,
    View,
    Dimensions,
    AsyncStorage,
}   from 'react-native';

import colors from '../misc/colors.js';

import NameField from './NameComponent';
import ActivityLog from './ActivityLogComponent';
import LobbyOptions from './LobbyOptionsComponent';

import { RoleView } from '../components/RoleView.js';
import { Alert } from '../components/Alert.js';

import firebaseService from '../firebase/firebaseService.js';

class BasicLobbyScreen extends Component {
    
    constructor(props) {
        super(props);

        this.state = {

            owner:false,

            showroles:false,
            activityLog: [],

        };

        //firebase
        this.roomId = null
        this.roomInfoLobbyRef = null
        this.roomInfoLogRef = null
        this.roomInfoStatusRef = null

        this.width          = Dimensions.get('window').width;
        this.height         = Dimensions.get('window').height;

        
    }

    
    componentWillMount() {

        //import all listeners
        const { 
            roomId,
            lobbyRef, 
            logRef,
            statusRef 
        } = firebaseService.fetchLobbyListeners()

        this.roomId = roomId
        this.roomInfoLobbyRef = lobbyRef
        this.roomInfoLogRef = logRef
        this.roomInfoStatusRef = statusRef
        
        this.roomInfoLogRef.on('child_added',snap=>{
            this.setState(prevState => ({
                activityLog: [{
                    message: snap.val(),
                    key: snap.key
                }, ...prevState.activityLog]
            }))
        })

        this.roomInfoStatusRef.on('value',snap=>{
            if(snap.val() == 'Starting') this.startGame()
        })

    }

    componentWillUnmount(){

        if(this.roomInfoStatusRef) this.roomStatusRef.off()
        if(this.roomInfoLogRef) this.roomInfoLobbyRef.off()

    }

    startGame(){
        
        AsyncStorage.setItem('GAME-KEY', this.roomId)
        .then(()=>{ this.props.screenProps.navigate('Mafia', this.roomId) })

    }

    render() {
        return <View style = {{flex:1, backgroundColor:colors.background, 
            justifyContent:'center', alignItems:'center'}}>
        
            <View style = {{ height:this.height*0.1, justifyContent:'center', alignItems:'center' }}>
                <Text style = {styles.title}>Room</Text>
                <Text style = {styles.code}>{this.roomId}</Text>
            </View>

            <NameField />

            <View style = {{height:this.height*0.6}}>
                <Alert visible = {!this.state.showroles} flex={0.6}>
                    <ActivityLog data = {this.state.activityLog}/>
                </Alert>

                <Alert visible = {this.state.showroles} flex={0.5}>
                    <RoleView rolepress = { (key,change) => firebaseService.changeRoleCount(key,change) }/>
                </Alert>
            </View>

            <LobbyOptions
                {...this.props.screenProps}
                owner = {this.state.owner}
                menu  = {()=> this.setState({showroles:!this.state.showroles})}
            />
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

export default BasicLobbyScreen