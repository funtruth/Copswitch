
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

            showroles:false,

        };

        //firebase
        this.roomId = null

        this.infoRef = null

        this.width          = Dimensions.get('window').width;
        this.height         = Dimensions.get('window').height;

        
    }

    
    componentWillMount() {

        //import all listeners
        this.infoRef = firebaseService.fetchRoomInfoListener('status')
    
        this.roomId = firebaseService.getRoomId()

        this.infoRef.on('value',snap=>{
            if(snap.exists()){
                if(snap.val() == 'Starting') this.startGame()
            }
        })

    }

    componentWillUnmount() {
        if(this.infoRef) this.infoRef.off()
    }

    startGame(){
        
        AsyncStorage.setItem('GAME-KEY', this.roomId)
        .then(()=>{
            this.props.screenProps.navigate('Mafia')
        })

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
                    <ActivityLog />
                </Alert>

                <Alert visible = {this.state.showroles} flex={0.5}>
                    <RoleView rolepress = { (key,change) => firebaseService.changeRoleCount(key,change) }/>
                </Alert>
            </View>

            <LobbyOptions
                {...this.props.screenProps}
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