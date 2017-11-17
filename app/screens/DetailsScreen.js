
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
}   from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { MenuButton } from '../components/MenuButton.js';

import { StackNavigator, TabNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import Rolesheet from '../misc/roles.json';
import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';

import * as Animatable from 'react-native-animatable';


export class Messages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alias:'',
            roomname: '',
            difficulty: null,
            loading:true,

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
                    this.setState({globallist:msg})
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
                this.setState({msglist:msg})
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
                borderRadius:2, backgroundColor:this.state.publicchat?colors.main:colors.background}}
                onPress = {()=>{this.setState({publicchat:true})}}>
                <Text style = {this.state.publicchat?styles.dchat:styles.chat}>Public</Text>
            </TouchableOpacity>

            <TouchableOpacity style = {{flex:0.4, justifyContent:'center', alignItems:'center',
                borderRadius:2, backgroundColor:this.state.publicchat?colors.background:colors.main}}
                onPress = {()=>{this.setState({publicchat:false})}}>
                <Text style = {this.state.publicchat?styles.chat:styles.dchat}>Private</Text>
            </TouchableOpacity>

        </View>
    }

    _renderMessageComponent(){
        if (this.state.publicchat){
            return <View style = {{marginLeft:10,marginRight:10,marginBottom:5,
                flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <View style = {{flex:0.8}}>
                <FlatList
                data={this.state.globallist}
                renderItem={({item}) => (
                    <Text style={styles.leftconcerto}>
                        {'[' + item.from + '] '+ item.message}</Text>
                )}
                keyExtractor={item => item.key}
                /></View></View>
        } else {
            return <View style = {{marginLeft:10,marginRight:10,marginBottom:5,
                flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <View style = {{flex:0.8}}>
                <FlatList
                    data={this.state.msglist}
                    renderItem={({item}) => (
                        <Text style={styles.leftconcerto}>
                            {'[' + item.from + '] ' + item.message}</Text>
                    )}
                    keyExtractor={item => item.key}
                />
            </View></View>
        } 
    }

    render() {

        if(this.state.loading){
            return <View style = {{flex:1,backgroundColor:colors.background}}/>
        }

        return <View style = {{flex:1,backgroundColor:colors.background}}>
            <View style = {{flex:0.03}}/>
            <View style = {{flex:0.1, flexDirection:'row', 
            justifyContent:'center', alignItems:'center'}}>{this._renderTitle()}</View>
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
            show:               false,
            roledesc:           '',
            rolerules:          '',
            mafialist:          [],

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

    render() {

        return <TouchableWithoutFeedback style = {{flex:1}}
                delayLongPress={300}
                onLongPress={()=>{ this.setState({show:true}) }}
                onPressOut={()=>{ this.setState({show:false}) }}>
            <View style = {{flex:1, backgroundColor:colors.background,
                justifyContent:'center', alignItems:'center'}}>
                <FontAwesome name='user-secret' style={{color:colors.main, 
                    fontSize: this.state.show?30:80}}/>
                {this.state.show?
                    <View>
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
                    </View>:<View/>
                }
            </View>
        </TouchableWithoutFeedback>
    }
}

const styles = StyleSheet.create({
    sconcerto: {
        fontSize: 15,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.main,
        marginLeft: 40,
        marginRight:40,
    },
    hidden: {
        fontSize: 15,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.background,
        marginLeft: 40,
        marginRight:40,
    },
    concerto: {
        fontSize: 20,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.main,
    },
    chat:{
        fontSize:20,
        fontFamily:'ConcertOne-Regular',
        color:colors.main,
        alignSelf: 'center',
        marginTop:5,
        marginBottom:5,
    },
    dchat:{
        fontSize:20,
        fontFamily:'ConcertOne-Regular',
        color:colors.background,
        alignSelf: 'center',
        marginTop:5,
        marginBottom:5,
    },
    leftconcerto:{
        fontSize:17,
        fontFamily:'ConcertOne-Regular',
        color:colors.main,
        marginTop:5,
    },
    

});