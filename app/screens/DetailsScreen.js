
import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    Image,
    StyleSheet,
    FlatList,
    AsyncStorage,
    Keyboard,
    BackHandler,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
}   from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { StackNavigator, TabNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import Rolesheet from '../misc/roles.json';
import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';

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
                borderRadius:2, backgroundColor:this.state.publicchat?colors.details:colors.gameback}}
                onPress = {()=>{this.setState({publicchat:true})}}>
                <Text style = {this.state.publicchat?styles.dchat:styles.chat}>Public</Text>
            </TouchableOpacity>

            <TouchableOpacity style = {{flex:0.4, justifyContent:'center', alignItems:'center',
                borderRadius:2, backgroundColor:this.state.publicchat?colors.gameback:colors.details}}
                onPress = {()=>{this.setState({publicchat:false})}}>
                <Text style = {this.state.publicchat?styles.chat:styles.dchat}>Private</Text>
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
            <View style = {{flex:0.84}}>{this._renderMessageComponent()}</View>
            <View style = {{flex:0.03}}/>
        </View>
    }
}

export class Profile extends Component {
    constructor(props) {
        super(props);

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
            iconSize:            new Animated.Value(40),
            iconVertical:        new Animated.Value(30),
            descVertical:        new Animated.Value(10),
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
                        roledesc: Rolesheet[snap.val().roleid].desc,
                        rolerules: Rolesheet[snap.val().roleid].rules,
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
                    toValue: 120
                }
            ).start(),
            Animated.timing(
                this.state.descVertical, {
                    duration: QUICK_ANIM,
                    toValue: 120
                }
            ).start(),
            Animated.timing(
                this.state.iconSize, {
                    duration: QUICK_ANIM,
                    toValue: 60
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
                    toValue: 0
            }).start(),
            Animated.timing(
                this.state.descVertical, {
                    duration: QUICK_ANIM,
                    toValue: 10
            }).start(),
            Animated.timing(
                this.state.iconSize, {
                    duration: QUICK_ANIM,
                    toValue: 40
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
                    
                    <Animated.View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: this.state.iconVertical, 
                        justifyContent: 'center', alignItems: 'center'}}>
                        <AnimatedIcon name='user-secret' style={{ color:colors.details, fontSize: this.state.iconSize }}/>
                    </Animated.View>
                
                    <Animated.View style = {{ opacity:this.state.pressOpacity || 0,
                        position: 'absolute', bottom: 0, left: 0, right: 0, top: this.state.descVertical, 
                        justifyContent: 'center', alignItems: 'center' }}>
                        <Text style = {styles.concerto}>{this.state.myrole}</Text>
                        <Text style = {styles.sconcerto}>{this.state.roledesc}</Text>
                        <Text style = {styles.sconcerto}>{this.state.rolerules}</Text>
                        {this.state.amimafia?<View style = {{flex:0.2}}><FlatList
                            data={this.state.mafialist}
                            renderItem={({item}) => (
                                <Text style={{fontSize:17,
                                    fontFamily:'ConcertOne-Regular',
                                    color:'#24527f',
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

const styles = StyleSheet.create({
    sconcerto: {
        fontSize: 15,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.details,
        marginLeft: 40,
        marginRight:40,
    },
    hidden: {
        fontSize: 15,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.gameback,
        marginLeft: 40,
        marginRight:40,
    },
    concerto: {
        fontSize: 20,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.details,
    },
    chat:{
        fontSize:20,
        fontFamily:'ConcertOne-Regular',
        color:colors.details,
        alignSelf: 'center',
        marginTop:5,
        marginBottom:5,
    },
    dchat:{
        fontSize:20,
        fontFamily:'ConcertOne-Regular',
        color:colors.gameback,
        alignSelf: 'center',
        marginTop:5,
        marginBottom:5,
    },
    leftconcerto:{
        fontSize:17,
        fontFamily:'ConcertOne-Regular',
        color:colors.details,
        marginTop:5,
    },
    

});