
import React, { Component } from 'react';
import {
    Text,
    View,
    Dimensions,
}   from 'react-native';

import colors from '../misc/colors.js';

import NameField from './NameComponent';
import Players from './PlayerListComponent';
import LobbyOptions from './LobbyOptionsComponent';

import { RoleView } from '../components/RoleView.js';
import { Alert } from '../components/Alert.js';

import firebase from '../firebase/FirebaseController.js';
import randomize from 'randomatic';

class BasicLobbyScreen extends Component {
    
    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;
        const roomname = params.roomname;

        this.state = {

            roomname: params.roomname,
            loading:false,
            owner:false,

            showroles:false,
            namelist: [],

        };

        this.mcount         = 0;

        this.width          = Dimensions.get('window').width;
        this.height         = Dimensions.get('window').height;

        this.user           = firebase.auth().currentUser.uid;

        this.roomRef        = firebase.database().ref('rooms').child(roomname);
        this.ownerRef       = this.roomRef.child('owner');
        this.lobbyRef       = this.roomRef.child('lobby');
        this.myInfoRef      = this.lobbyRef.child(this.user);
        this.counterRef     = this.roomRef.child('counter');
        this.rolesRef       = this.roomRef.child('roles');
        
    }

    
    componentWillMount() {
        this.counterRef.on('value',snap=>{
            if(snap.exists() && snap.val() == 1){
                AsyncStorage.setItem('GAME-KEY',this.state.roomname)
                this.props.screenProps.navigate('Mafia',this.state.roomname)
            }
        })

        this.lobbyRef.on('child_added',snap=>{
            if(snap.exists()){
                this.setState(prevState => ({
                    namelist: [{
                        name: snap.val().name, 
                        message: ' joined the room',
                        key:this.mcount
                    }, ...prevState.namelist]
                }))
                this.mcount++
            }
        })

        this.lobbyRef.on('child_removed',snap=>{
            if(snap.exists()){
                this.setState(prevState => ({
                    namelist: [{
                        name: snap.val().name, 
                        message: ' left the room',
                        key:this.mcount
                    }, ...prevState.namelist]
                }))
                this.mcount++
            }
        })

        this.ownerRef.on('value',snap=>{
            if(snap.exists()){
                this.setState({
                    owner:snap.val() == this.user
                })
            }
        })
    }

    componentWillUnmount() {
        if(this.counterRef){
            this.counterRef.off();
        }
        if(this.lobbyRef){
            this.lobbyRef.off();
        }
        if(this.ownerRef){
            this.ownerRef.off();
        }
    }
    
    _startGame() {

        this.roomRef.once('value',snap=>{

            var randomstring = '';
            snap.child('roles').forEach((child)=>{
                for(i=0;i<child.val();i++){
                    randomstring += randomize('?', 1, {chars: child.key})
                }
            })

            if(snap.child('lobby').numChildren() != randomstring.length){

                this.setState(prevState => ({
                    namelist: [{
                        name: 'Error: ',
                        message: 'Improper set-up',
                        key:this.mcount
                    }, ...prevState.namelist]
                }))
                this.mcount++
            
            } else {
                var rnumber = 0

                var count = 0
                var listshot = []
                var readyshot = []
                snap.child('lobby').forEach((child)=>{
                    listshot.push({
                        name: child.val().name,
                        uid: child.key
                    })
                    readyshot.push(false)
                    count++
                })

                for(i=0;i<count;i++){
                    rnumber = Math.floor(Math.random() * randomstring.length);
                    listshot[i].roleid = randomstring.charAt(rnumber)
                    randomstring = randomstring.slice(0,rnumber) + randomstring.slice(rnumber+1)
                }
    
                this.roomRef.child('list').set(listshot).then(()=>{
                    this.roomRef.child('ready').set(readyshot)
                }).then(()=>{
                    this.counterRef.set(1)
                })

            }

        })

    }

    _leaveRoom() {
        AsyncStorage.removeItem('ROOM-KEY').then(()=>{
            if(this.state.owner){
                this.roomRef.remove().then(()=>{
                    this.props.screenProps.navigate('Home')
                })
            } else {
                this.myInfoRef.remove().then(()=>{
                    this.props.screenProps.navigate('Home')
                })
            }
        })
    }

    _rolePress(key,change){
        this.rolesRef.child(key).transaction(count=>{
            return change?count+1:count-1
        })
    }

    _transition(boolean) {
        
    }

    render() {
        return <View style = {{flex:1, backgroundColor:colors.background, 
            justifyContent:'center', alignItems:'center'}}>
        
            <View style = {{ height:this.height*0.1, justifyContent:'center', alignItems:'center' }}>
                <Text style = {styles.title}>Room</Text>
                <Text style = {styles.code}>{this.state.roomname}</Text>
            </View>

            <NameField name = {(val)=>{ this.myInfoRef.update({ name:val }) }}/>

            <View style = {{height:this.height*0.6}}>
                <Alert visible = {!this.state.showroles} flex={0.6}>
                    <Players list = {this.state.namelist}/>
                </Alert>

                <Alert visible = {this.state.showroles} flex={0.5}>
                    <RoleView rolepress = {(key,change)=>this._rolePress(key,change)}/>
                </Alert>
            </View>

            <LobbyOptions
                owner = {this.state.owner}
                start = {()=> this._startGame()}
                leave = {()=> this._leaveRoom()}
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