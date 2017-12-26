
import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    Image,
    FlatList,
    AsyncStorage,
    Keyboard,
    BackHandler,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
}   from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { StackNavigator, TabNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import Rolesheet from '../misc/roles.json';
import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';
import styles from '../misc/styles.js';

import * as Animatable from 'react-native-animatable';
const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome)

const QUICK_ANIM = 400;
const SLOW_ANIM = 1000;

export class Messages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alias:'',
            roomname: '',
            difficulty: null,

            globallist: [],
            msglist:    [],

            publicchat: true,
        };
     
        this.privateRef = firebase.database().ref('messages').child(firebase.auth().currentUser.uid);
    }


    componentWillMount() {
        AsyncStorage.getItem('ROOM-KEY',(error,result)=>{

            this.setState({roomname:result, loading:false})

            this.publicRef = firebase.database().ref('globalmsgs').child(result);
            this.publicRef.on('value',snap=>{
                if(snap.exists()){
                    var msg = [];
                    snap.forEach((child)=>{   
                        msg.push({
                            from:       child.val().from,
                            color:      child.val().color,
                            message:    child.val().message,
                            key:        child.key,
                        })
                    })
                    this.setState({globallist:msg.reverse()})
                } else {
                    this.setState({globallist:[]})
                }
            })
        })

        this.privateRef.on('value',snap=>{
            if(snap.exists()){
                var msg = [];
                snap.forEach((child)=>{   
                    msg.push({
                        from:       child.val().from,
                        message:    child.val().message,
                        key:        child.key,
                    })
                })
                this.setState({msglist:msg.reverse()})
            } else {
                this.setState({msglist:[]})
            }
        })
    }

    componentWillUnmount() {
        if(this.publicRef){
            this.publicRef.off();
        }
        if(this.privateRef){
            this.privateRef.off();
        }
    }

    _renderTitle() {
        return <View style = {{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>

            <TouchableOpacity style = {{flex:0.4, justifyContent:'center', alignItems:'center',
                borderRadius:2, backgroundColor:this.state.publicchat?colors.shadow:colors.gameback}}
                onPress = {()=>{this.setState({publicchat:true})}}>
                <Text style = {styles.chat}>Public</Text>
            </TouchableOpacity>

            <TouchableOpacity style = {{flex:0.4, justifyContent:'center', alignItems:'center',
                borderRadius:2, backgroundColor:this.state.publicchat?colors.gameback:colors.shadow}}
                onPress = {()=>{this.setState({publicchat:false})}}>
                <Text style = {styles.chat}>Private</Text>
            </TouchableOpacity>

        </View>
    }

    _renderMessageComponent(){
        return <View style = {{marginLeft:10,marginRight:10,marginBottom:5,
            flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            <View style = {{flex:0.8}}>
            <FlatList
            data={this.state.publicchat?this.state.globallist:this.state.msglist}
            renderItem={({item}) => (
                <Text style={styles.leftconcerto}>
                    {'[' + item.from + '] '+ item.message}</Text>
            )}
            keyExtractor={item => item.key}
            /></View></View>
    }

    render() {
        return <View style = {{flex:1,backgroundColor:colors.gameback}}>
            <View style = {{flex:0.03}}/>
            <View style = {{flex:0.1, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                {this._renderTitle()}</View>
            <View style = {{flex:0.8}}>{this._renderMessageComponent()}</View>
            <View style = {{flex:0.07}}/>
        </View>
    }
}

export class Profile extends Component {
    constructor(props) {
        super(props);

        this.height = Dimensions.get('window').height;

        this.state = {
            roomname: '',

            myrole:             '',
            amimafia:           false,
            roledesc:           '',
            rolerules:          '',
            mafialist:          [],

            size:               30,
            marginbot:          0,
            opacity:            0,

            pressOpacity:        new Animated.Value(0),
            iconSize:            new Animated.Value(70),
            iconVertical:        new Animated.Value(this.height*0.4),
            descVertical:        new Animated.Value(this.height*0.5),
        };

        
    }

    componentWillMount() {
        AsyncStorage.getItem('GAME-KEY',(error,result)=>{

            this.myRef = firebase.database().ref('rooms').child(result)
                .child('listofplayers').child(firebase.auth().currentUser.uid);
            this.myRef.on('value',snap=>{
                if(snap.exists()){
                    this.setState({
                        myrole: Rolesheet[snap.val().roleid].name,
                        rolerules: Rolesheet[snap.val().roleid].rules,
                        win: Rolesheet[snap.val().roleid].win,
                        amimafia: snap.val().roleid.toLowerCase()==snap.val().roleid,
                        roomname: result,
                    })
                }
            })

            this.mafiaRef = firebase.database().ref('rooms').child(result).child('mafia')
            this.mafiaRef.on('value',snap=>{
                if(snap.exists()){
                    var mafialist = [];
                    snap.forEach((child)=>{
                        mafialist.push({
                            name:       child.val().name,
                            rolename:   Rolesheet[child.val().roleid].name,
                            alive:      child.val().alive,
                            key:        child.key,
                        })
                    })
                    this.setState({mafialist:mafialist})
                }
            })
        })
    }

    componentWillUnmount() {
        if(this.myRef){
            this.myRef.off();
        }
        if(this.mafiaRef){
            this.mafiaRef.off();
        }
    }

    handlePressIn() {
        Animated.sequence(
            Animated.timing(
                this.state.pressOpacity, {
                    duration: QUICK_ANIM,
                    toValue: 1
                }
            ).start(),
            Animated.timing(
                this.state.iconVertical, {
                    duration: QUICK_ANIM,
                    toValue: this.height*0.23
                }
            ).start(),
            Animated.timing(
                this.state.descVertical, {
                    duration: QUICK_ANIM,
                    toValue: this.height*0.3
                }
            ).start(),
            Animated.timing(
                this.state.iconSize, {
                    duration: QUICK_ANIM,
                    toValue: 40
                }
            ).start(),
        )
    }
    handlePressOut() {
        Animated.sequence(
            Animated.timing(
                this.state.pressOpacity, {
                    duration: QUICK_ANIM,
                    toValue: 0
            }).start(),
            Animated.timing(
                this.state.iconVertical, {
                    duration: QUICK_ANIM,
                    toValue: this.height*0.4
            }).start(),
            Animated.timing(
                this.state.descVertical, {
                    duration: QUICK_ANIM,
                    toValue: this.height*0.5
            }).start(),
            Animated.timing(
                this.state.iconSize, {
                    duration: QUICK_ANIM,
                    toValue: 70
                }
            ).start(),
        )
        
    }

    render() {

        return <TouchableWithoutFeedback style = {{flex:1}}
        onPressOut = {()=>{ this.handlePressOut()}}
        onPressIn={() =>  {this.handlePressIn()}}>
            <View style = {{flex:1, backgroundColor:colors.gameback,
                justifyContent:'center', alignItems:'center'}}>
                    
                    <AnimatedIcon name='user-secret' style={{ 
                        position: 'absolute', top:this.state.iconVertical, alignSelf:'center',
                        color:colors.details, fontSize: this.state.iconSize 
                    }}/>
                
                    <Animated.View style = {{ opacity:this.state.pressOpacity || 0,
                        position: 'absolute', left: 0, right: 0, top: this.state.descVertical, 
                        justifyContent: 'center', alignItems: 'center' }}>
                        <Text style = {styles.font}>you are a:</Text>
                        <Text style = {styles.mfont}>{this.state.myrole}</Text>
                        <Text style = {styles.font}>At night you:</Text>
                        <Text style = {styles.roleDesc}>{this.state.rolerules}</Text>
                        <Text style = {styles.font}>you win when:</Text>
                        {this.state.amimafia?<View style = {{flex:0.2}}><FlatList
                            data={this.state.mafialist}
                            renderItem={({item}) => (
                                <Text style={{fontSize:17,
                                    fontFamily:'ConcertOne-Regular',
                                    color:colors.shadow,
                                    justifyContent:'center',
                                    alignSelf:'center',
                                    textDecorationLine:item.alive?'none':'line-through'}}>
                                    {'[ ' + item.name + ' ] ' + item.rolename}</Text>
                            )}
                            keyExtractor={item => item.key}
                        /></View>:<View/>}
                    </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    }
}
