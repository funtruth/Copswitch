
import React, { Component } from 'react';
import {
    Text,
    View,
    Dimensions,
    AsyncStorage,
}   from 'react-native';
import { connect } from 'react-redux'

import { joinRoom } from './LobbyReducer'
import NavigationTool from '../navigation/NavigationTool'

import colors from '../misc/colors.js';

import NameView from './components/LobbyNameView';
import ActivityLogView from './components/LobbyActivityLogView';
import LobbyOptionView from './components/LobbyOptionView';

import { RoleView } from '../components/RoleView.js';
import { Alert } from '../components/Alert.js';

import firebaseService from '../firebase/firebaseService.js';

class BasicLobbyScreen extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            showroles:false,
        };

        this.infoRef = null

        this.width          = Dimensions.get('window').width;
        this.height         = Dimensions.get('window').height;
    }

    
    componentWillReceiveProps(newProps){
        if(newProps.status === 'Starting'){
            AsyncStorage.setItem('GAME-KEY', this.roomId)
            .then(()=>{
                NavigationTool.navigate('Pregame')
            })
        }
    }

    render() {
        return <View style = {{flex:1, backgroundColor:colors.background, 
            justifyContent:'center', alignItems:'center'}}>
        
            <View style = {{ height:this.height*0.1, justifyContent:'center', alignItems:'center' }}>
                <Text style = {styles.title}>Room</Text>
                <Text style = {styles.code}>{ this.props.roomId }</Text>
            </View>

            <NameView />

            <View style = {{height:this.height*0.6}}>
                <Alert visible = {!this.state.showroles} flex={0.6}>
                    <ActivityLogView />
                </Alert>

                <Alert visible = {this.state.showroles} flex={0.5}>
                    <RoleView rolepress = { (key,change) => firebaseService.changeRoleCount(key,change) }/>
                </Alert>
            </View>

            <LobbyOptionView menu  = {()=> this.setState({showroles:!this.state.showroles})}
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

export default connect(
    state => ({
        roomId: state.lobby.roomId,
        username: state.lobby.username
    }),
    dispatch => {
        return {
            joinRoom: (payload) => dispatch(joinRoom(payload))
        }
    }
)(BasicLobbyScreen)