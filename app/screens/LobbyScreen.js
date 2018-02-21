
import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    ScrollView,
    Image,
    FlatList,
    AsyncStorage,
    Keyboard,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
}   from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const AnimatedOpacity = Animated.createAnimatedComponent(TouchableOpacity)
import * as Animatable from 'react-native-animatable';

import { RoleView } from '../components/RoleView.js';

import { Button } from '../components/Button.js';
import { Alert } from '../components/Alert.js';
import { Slide } from '../parents/Slide.js';

import Rolesheet from '../misc/roles.json';
import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';
import styles from '../misc/styles.js';

const MENU_ANIM = 200;
const GAME_ANIM = 1000;
import randomize from 'randomatic';

export class Build1 extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            roomname:null,
            message:'Almost there!',
        };
        
    }

    _createRoom() {

        AsyncStorage.setItem('ROOM-KEY', this.state.roomname)
        .then(()=>{ this.props.navigate(this.state.roomname) })
    }

    componentWillReceiveProps(newProps){

        if(newProps.visible && !this.state.roomname){

            var flag = false
            var roomname = null
    
            firebase.database().ref('rooms').once('value',snap=>{

                while(!flag){
                    roomname = randomize('0',4);
                    if(!snap.child(roomname).exists()){
                        flag = true
                        this.setState({roomname:roomname})
                    }
                }
                
                firebase.database().ref('rooms/').child(roomname).set({
                    owner: firebase.auth().currentUser.uid,
                    counter:0,
                })
            }) 
        }
    }

    render() {

        return <View>

            <Button
                horizontal={0.4}
                onPress={()=>this._createRoom()}
            >
                <Text style = {styles.create}>Create Room</Text>
            </Button>

        </View>
    }
}

export class Join1 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            roomname:null,
            errormessage:'Must be 4 Digits long',
        };

        this.height = Dimensions.get('window').height;
        this.width = Dimensions.get('window').width;
        
    }

    _continue(roomname) {
        if(roomname.length==4){
            firebase.database().ref('rooms/' + roomname).once('value', snap => {
                if(snap.exists() && (snap.val().counter == 0)){
                    this._joinRoom(roomname)
                } else if (snap.exists() && (snap.val().counter > 0)) {
                    setTimeout(()=>{
                        this.setState({errormessage:'Game has already started'})
                        this.refs.error.shake(800)
                    },800)
                } else {
                    setTimeout(()=>{
                        this.setState({errormessage:'Invalid Room Code'})
                        this.refs.error.shake(800)
                    },800)
                        
                }
            })
                
        } else {
            setTimeout(()=>{
                this.setState({errormessage:'Code must be 4 Digits long'})
                this.refs.error.shake(800)
            },800)
        }
    }

    _joinRoom(roomname) {
        AsyncStorage.setItem('ROOM-KEY', roomname).then(()=>{
            this.props.navigate(roomname)
        })
    }

    render() {

        return <View>

            <Text style = {styles.roomcode}>CODE</Text>

            <View style = {{justifyContent:'center', 
            alignItems:'center', flexDirection:'row'}}>
                <TextInput
                    ref='textInput'
                    keyboardType='numeric' 
                    maxLength={4}   
                    placeholder='9999'
                    placeholderTextColor={colors.dead}
                    value={this.state.roomname}
                    style={[styles.textInput,{flex:0.5}]}
                    onChangeText={val=>this.setState({roomname:val})}
                    onSubmitEditing={event=>this._continue(event.nativeEvent.text)}
                />
            </View>

            <Animatable.Text style = {[styles.sfont,{marginTop:10}]}ref='error'>
                    {this.state.errormessage}</Animatable.Text>

        </View>
    }
}

export class Lobby extends Component {
    
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
                snap.child('lobby').forEach((child)=>{
                    listshot.push({
                        name: child.val().name,
                        uid: child.key
                    })
                    count++
                })

                for(i=0;i<count;i++){
                    rnumber = Math.floor(Math.random() * randomstring.length);
                    listshot[i].roleid = randomstring.charAt(rnumber)
                    randomstring = randomstring.slice(0,rnumber) + randomstring.slice(rnumber+1)
                }
    
                this.roomRef.child('list').set(listshot).then(()=>{
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
                <Text style = {styles.lobbytitle}>Room</Text>
                <Text style = {styles.lobbycode}>{this.state.roomname}</Text>
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

            <Navigator
                owner = {this.state.owner}
                start = {()=> this._startGame()}
                leave = {()=> this._leaveRoom()}
                menu  = {()=> this.setState({showroles:!this.state.showroles})}
            />
        </View>
    }
}

class NameField extends Component {
    
    constructor(props) {
        super(props);

        this.width = Dimensions.get('window').width,
        this.height = Dimensions.get('window').height
    }

    componentWillReceiveProps(newProps){

    }

    render() {
        return <View style = {{height:this.height*0.1,flexDirection:'row'}}>

            <View style = {{width:45}}/>

            <TextInput
                ref = 'alias'
                keyboardType='default'
                autoCapitalize='words'
                placeholder='Nickname'
                placeholderTextColor={colors.dead}
                maxLength={10}
                style={[styles.nameInput,{width:this.width*0.4}]}
                onSubmitEditing = {(event)=>{
                    this.props.name(event.nativeEvent.text.trim());
                }}
            />

            <AnimatedOpacity
                style = {{alignItems:'center', justifyContent:'center', width:45}}
                onPress = {()=> this.refs.alias.focus() }>
                <FontAwesome name='pencil'
                    style={{color:colors.font, fontSize:30}}/>
            </AnimatedOpacity>

        </View>
    }
}

class Players extends Component {

    constructor(props) {
        super(props);

        this.width = Dimensions.get('window').width,
        this.height = Dimensions.get('window').height

        this.state = {
            list:[]
        }
    }

    componentWillReceiveProps(newProps){
        this.setState({
            list:newProps.list
        })
    }

    _renderItem(item){
        return <Slide><Text style = {styles.playerList}>{item.name + item.message}</Text></Slide>
    }

    render() {

        return <FlatList
            data={this.state.list}
            renderItem={({item}) => this._renderItem(item)}
            keyExtractor={item => item.key}
        />
    }
}

class Navigator extends Component {

    constructor(props) {
        super(props);

        this.width = Dimensions.get('window').width,
        this.height = Dimensions.get('window').height

    }

    render(){
        return <Animated.View style = {{
            height:this.height*0.1, 
            flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
    
                <AnimatedOpacity
                    style = {{alignItems:'center', flex:0.17}}
                    onPress = {this.props.leave}>
                    <FontAwesome name='close'
                        style={{color:colors.font, fontSize:25}}/>
                    <Text style = {styles.sfont}>Leave</Text>
                </AnimatedOpacity>

                <AnimatedOpacity
                    style = {{alignItems:'center', flex:0.20}}
                    onPress = {this.props.start}
                    disabled = {!this.props.owner}>
                    <FontAwesome name={this.props.owner?'check':'lock'}
                        style={{color:this.props.owner?colors.font:colors.dead, fontSize:35}}/>
                    <Text style = {[styles.sfont,{color:this.props.owner?colors.font:colors.dead}]}>Start</Text>
                </AnimatedOpacity>

                <AnimatedOpacity
                    style = {{alignItems:'center', flex:0.17}}
                    onPress = {this.props.menu}>
                    <FontAwesome name='bars'
                        style={{color:colors.font, fontSize:25}}/>
                    <Text style = {styles.sfont}>Roles</Text>
                </AnimatedOpacity>

        </Animated.View>
    }
}