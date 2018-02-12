
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

import { CustomButton } from '../components/CustomButton.js';

import Rolesheet from '../misc/roles.json';
import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';
import styles from '../misc/styles.js';

import * as Animatable from 'react-native-animatable';
const MENU_ANIM = 200;
const GAME_ANIM = 1000;

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
                if(snap.exists() && (snap.val().counter == 1)){
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


export class LobbyPager extends Component {
    
    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;
        const roomname = params.roomname;

        this.state = {

            roomname: params.roomname,
            loading:true,

            namelist: [],

        };

        this.width  = Dimensions.get('window').width;
        this.height = Dimensions.get('window').height;

        this.roomRef        = firebase.database().ref('rooms').child(roomname);
        this.lobbyRef       = this.roomRef.child('lobby');
        this.myInfoRef      = this.lobbyRef.child(firebase.auth().currentUser.uid);
        this.counterRef     = this.roomRef.child('counter');
        
    }

    
    componentWillMount() {
        this.counterRef.on('value',snap=>{
            if(snap.exists()){
                if(snap.val() == 2){
                    this._transition(true);
                } else if(snap.val()>1){
                    AsyncStorage.setItem('GAME-KEY',this.state.roomname);

                    this.props.screenProps.navigate('MafiaRoom',this.state.roomname)
                }
            }
        })

        this.lobbyRef.on('value',snap=>{
            if(snap.exists()){
                var list = [];
                snap.forEach((child)=> {
                    list.push({
                        name: child.val().name,
                        key: child.key,
                    })
                })
                this.setState({
                    namelist:list
                })
            }
        })
    }

    componentWillUnmount() {
        if(this.counterRef){
            this.counterRef.off();
        }
    }

    _leaveRoom() {
        this.myInfoRef.remove().then(()=>{
            this.lobbyRef.once('value',snap=>{
                if(!snap.exists()){
                    this.roomRef.remove();
                }
            }).then(()=>{
                this.props.screenProps.navigate('Home')
            })
        })
        
    }

    _transition(boolean) {
        
    }

    render() {
        return <View style = {{flex:1, justifyContent:'center', alignItems:'center'}}>
        
            <View style = {{ height:this.height*0.1, justifyContent:'center', alignItems:'center' }}>
                <Text style = {styles.lobbytitle}>Room</Text>
                <Text style = {styles.lobbycode}>{this.state.roomname}</Text>
            </View>
            
            <NameField
                name = {(val)=>{ this.myInfoRef.update({ name:val }) }}
            />

            <View style = {{height:this.height*0.6}}>

            </View>

            <AnimatedOpacity
                style = {{alignItems:'center'}}
                onPress = {()=> this._leaveRoom() }>
                <FontAwesome name='lock'
                    style={{color:colors.font, fontSize:30}}/>
                <Text style = {styles.sfont}>Leave</Text>
            </AnimatedOpacity>
            

        </View>
    }
}

class NameField extends Component {
    
    constructor(props) {
        super(props);

        this.width = Dimensions.get('window').width,
        this.height = Dimensions.get('window').height
    }

    render() {
        return <View style = {{height:this.height*0.1,flexDirection:'row'}}>

            <View style = {{width:45}}/>

            <TextInput
                ref = 'alias'
                keyboardType='default'
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

export class Lobby2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            namelist:[],
        };

        this.height = Dimensions.get('window').height;
        this.width  = Dimensions.get('window').width;
    }

    componentWillMount() {
        this.listofplayersRef = firebase.database().ref('rooms')
            .child(this.props.roomname).child('listofplayers')
        this.listofplayersRef.on('value',snap=>{
            var list = [];
            snap.forEach((child)=> {
                list.push({
                    name: child.val().name,
                    key: child.key,
                })
            })
            this.setState({
                namelist:list
            })
        })
    }

    componentWillUnmount() {
        if(this.listofplayersRef){
            this.listofplayersRef.off();
        }
    }


    _renderListComponent(){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <Text style = {styles.playerList}>{item.name}</Text>
            )}
            contentContainerStyle = {{marginTop:10, marginBottom:10}}
            numColumns={1}
            keyExtractor={item => item.key}
        />
    }

    render() {
        return <View style = {{flex:0.7,backgroundColor:colors.background, width:this.props.width,
            alignItems:'center'}}>

            <View style = {{height:this.height*0.14}}/>

            <View style = {{height:this.height*0.1, justifyContent:'center', alignItems:'center'}}>
                <Text style = {styles.mfont}>Welcome!</Text>
                <Text style = {styles.subfont}>Wait for Owner to start.</Text>
            </View>
            
            <View style = {{height:this.height*0.55, width:this.width*0.7, justifyContent:'center'}}>
                {this._renderListComponent()}
            </View>
        </View>
    }
}
