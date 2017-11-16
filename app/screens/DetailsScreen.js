
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
        };
        
    }


    componentWillMount() {
        AsyncStorage.getItem('ROOM-KEY',(error,result)=>{
            firebase.database().ref('rooms').child(result).child('difficulty').once('value',snap=>{
                this.setState({
                    roomname:result,
                    loading: false,
                    difficulty: snap.val(),
                })
            })
        })
    }

    _selectDifficulty(difficulty) {
        firebase.database().ref('rooms').child(this.state.roomname).update({
            difficulty: difficulty
        }).then(()=>{
            this.setState({difficulty:difficulty})
            this.props.navigation.navigate('Creation4')
        })
    }

    render() {

        if(this.state.loading){
            return <View style = {{backgroundColor:colors.main}}/>
        }

        return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ Keyboard.dismiss() }}>
            <View style = {{flex:1,backgroundColor:colors.main}}>

                <View style = {{flexDirection:'row', flex:0.1, marginTop:10, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.85}}/>
                    <TouchableOpacity
                        style = {{flex:0.15}}
                        onPress = {()=>{
                            this.props.navigation.dispatch(NavigationActions.back());
                        }} >
                        <MaterialCommunityIcons name='close'
                            style={{color:colors.font,fontSize:30}}/>
                    </TouchableOpacity>
                </View>

                <View style = {{flexDirection:'row', flex:0.1, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.7}}> 
                        <Text style = {styles.concerto}>Room Code</Text>
                        <Text style = {styles.roomcode}>{this.state.roomname}</Text>
                    </View>
                </View>

                <View style = {{flex:0.2,backgroundColor:colors.main, 
                    justifyContent:'center', alignItems:'center'}}>
                    <Text style = {styles.concerto}>How experienced</Text>
                    <Text style = {styles.concerto}>is your Group?</Text>
                </View>

                <TouchableOpacity
                    style = {{flex:0.15, justifyContent:'center', alignItems:'center',
                    backgroundColor:this.state.difficulty==1?colors.font:colors.main,
                    marginLeft:15, marginRight:10, borderRadius:10}}
                    onPress = {()=>{
                        this._selectDifficulty(1)
                    }} >
                    <MaterialCommunityIcons name='star-circle'
                        style={{color:this.state.difficulty==1?colors.main:colors.font,fontSize:30}}/>
                    <Text style = {this.state.difficulty==1?styles.dconcerto:styles.concerto}>New</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style = {{flex:0.15, justifyContent:'center', alignItems:'center',
                    backgroundColor:this.state.difficulty==2?colors.font:colors.main,
                    marginLeft:15, marginRight:10, borderRadius:10}}
                    onPress = {()=>{
                        this._selectDifficulty(2)
                    }} >
                    <View style = {{flexDirection:'row'}}>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:this.state.difficulty==2?colors.main:colors.font,fontSize:30}}/>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:this.state.difficulty==2?colors.main:colors.font,fontSize:30}}/>
                    </View>
                <Text style = {this.state.difficulty==2?styles.dconcerto:styles.concerto}>Average</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style = {{flex:0.15, justifyContent:'center', alignItems:'center',
                    backgroundColor:this.state.difficulty==3?colors.font:colors.main,
                    marginLeft:15, marginRight:10, borderRadius:10}}
                    onPress = {()=>{
                        this._selectDifficulty(3)
                    }}
                >   
                    <View style = {{flexDirection:'row'}}>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:this.state.difficulty==3?colors.main:colors.font,fontSize:30}}/>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:this.state.difficulty==3?colors.main:colors.font,fontSize:30}}/>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:this.state.difficulty==3?colors.main:colors.font,fontSize:30}}/>
                    </View>
                    <Text style = {this.state.difficulty==3?styles.dconcerto:styles.concerto}>Experts</Text>
                </TouchableOpacity>

                <View style = {{flex:0.05}}/>

                <View style = {{flex:0.1, flexDirection:'row', 
                justifyContent:'center', alignItems:'center'}}>
                    <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                        style={{color:colors.font,fontSize:15}}/>
                    <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                        style={{color:colors.font,fontSize:15, marginLeft:20}}/>
                    <MaterialCommunityIcons name='checkbox-blank-circle'
                        style={{color:colors.font,fontSize:15, marginLeft:20}}/>
                    <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                        style={{color:colors.font,fontSize:15, marginLeft:20}}/>
                    <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                        style={{color:colors.font,fontSize:15, marginLeft:20}}/>
                </View>

            </View>
        </TouchableWithoutFeedback>
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

        };
        
    }

    componentWillMount() {
        AsyncStorage.getItem('GAME-KEY',(error,result)=>{

            this.myRef = firebase.database().ref('rooms').child(result)
                .child('listofplayers').child(firebase.auth().currentUser.uid);
            this.myRef.on('value',snap=>{
                this.setState({
                    myrole: Rolesheet[snap.val().roleid].name,
                    roledesc: Rolesheet[snap.val().roleid].desc,
                    rolerules: Rolesheet[snap.val().roleid].rules,
                    amimafia: snap.val().roleid.toLowerCase()==snap.val().roleid,
                    roomname: result,
                })
            })

            this.mafiaRef = firebase.database().ref('rooms').child(result)
            .child('mafia').on('value',snap=>{
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
                onPressIn={()=>{ this.setState({show:true}) }}
                onPressOut={()=>{ this.setState({show:false}) }}>
            <View style = {{flex:1, backgroundColor:colors.main,
                justifyContent:'center', alignItems:'center'}}>
                <FontAwesome name='user-secret' style={{color:colors.font, fontSize: 30}}/>
                {this.state.show?
                    <View>
                    <Text style = {styles.concerto}>{this.state.myrole}</Text>
                    <Text style = {styles.sconcerto}>{this.state.roledesc}</Text>
                    <Text style = {styles.sconcerto}>{this.state.rolerules}</Text>
                    {this.state.amimafia?<View style = {{flex:0.1}}><FlatList
                        data={this.state.mafialist}
                        renderItem={({item}) => (
                            <Text style={{fontSize:17,
                                fontFamily:'ConcertOne-Regular',
                                color:'#24527f',
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
        color: colors.font,
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
        color: colors.font,
    },
    

});