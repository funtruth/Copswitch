
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { CustomButton } from '../components/CustomButton.js';
import { Pager } from '../components/Pager.js';

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
            errormessage:'Code must be 4 Digits long',
        };

        this.height = Dimensions.get('window').height;
        this.width = Dimensions.get('window').width;
        
    }

    _continue(roomname) {
        if(roomname.length==4){
            firebase.database().ref('rooms/' + roomname).once('value', snap => {
                if(snap.exists() && (snap.val().phase == 0)){
                    this._joinRoom(roomname)
                } else if (snap.exists() && (snap.val().phase > 0)) {
                    setTimeout(()=>{
                        this.setState({errormessage:'Game has already started'})
                        this.refs.error.shake(800)
                        this.refs.textInput.focus()
                    },800)
                } else {
                    setTimeout(()=>{
                        this.setState({errormessage:'Invalid Room Code'})
                        this.refs.error.shake(800)
                        this.refs.textInput.focus()
                    },800)
                        
                }
            })
                
        } else {
            setTimeout(()=>{
                this.setState({errormessage:'Code must be 4 Digits long'})
                this.refs.error.shake(800)
                this.refs.textInput.focus()
            },800)
        }
    }

    _joinRoom(roomname) {
        AsyncStorage.setItem('ROOM-KEY', roomname);

        firebase.database().ref('rooms/' + roomname 
            + '/listofplayers/' + firebase.auth().currentUser.uid).update({
                presseduid:         'foo',
        }).then(()=>{
            this.props.screenProps.navigateP('LobbyTutorial',roomname)
        })
    }

    render() {

        return <View style = {{flex:1,backgroundColor:colors.background}}>

            <View style = {{height:this.height*0.26}}/>
            <View style = {{height:this.height*0.1, justifyContent:'center'}}>
                <Text style = {styles.roomcode}>Enter code</Text>
            </View>

            <View style = {{height:this.height*0.1, justifyContent:'center', 
            alignItems:'center', flexDirection:'row'}}>
                <TextInput
                    autoFocus
                    ref='textInput'
                    keyboardType='numeric' 
                    maxLength={4}   
                    value={this.state.roomname}
                    style={[styles.textInput,{flex:0.7}]}
                    onChangeText={val=>this.setState({roomname:val})}
                    onSubmitEditing={event=>this._continue(event.nativeEvent.text)}
                />
            </View>

            <Animatable.Text style = {[styles.sfont,{marginTop:10}]}ref='error'>
                    {this.state.errormessage}</Animatable.Text>

            <TouchableOpacity
                style = {{position:'absolute', bottom:this.height*0.12, left:0, right:0, 
                    justifyContent:'center', alignItems:'center'}}
                onPress = {()=> this.refs.textInput.focus() }>
                <Entypo name='dial-pad' style={{color:colors.shadow,fontSize:this.height*0.08}}/>
            </TouchableOpacity>

        </View>
    }
}


export class LobbyPager extends Component {
    
    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;
        const roomname = params.roomname;

        this.state = {
            page: 1,
            currentpage:1,

            roomname: params.roomname,
            alias:'',
            loading:true,

            transition: false,
            transitionOpacity: new Animated.Value(0),
        };

        this.width  = Dimensions.get('window').width;
        this.height = Dimensions.get('window').height;

        this.roomRef        = firebase.database().ref('rooms').child(roomname);
        this.listPlayerRef  = this.roomRef.child('listofplayers');
        this.myInfoRef      = this.roomRef.child('listofplayers').child(firebase.auth().currentUser.uid);
        this.phaseRef       = this.roomRef.child('phase');
        
    }

    
    componentWillMount() {
        this.phaseRef.on('value',snap=>{
            if(snap.exists()){
                if(snap.val() == 1){
                    this._transition(true);
                } else if(snap.val()>1){
                    AsyncStorage.setItem('GAME-KEY',this.state.roomname);

                    this.props.screenProps.navigate('MafiaRoom',this.state.roomname)
                }
            }
        })
    }

    componentWillUnmount() {
        if(this.phaseRef){
            this.phaseRef.off();
        }
    }

    _leaveRoom() {
        //Remove my player information, then check if there are still players
        //If there are no players left, delete the Room
        //Navigate back to home screen
        this.myInfoRef.remove().then(()=>{
            this.myInfoRef.once('value',snap=>{
                if(!snap.exists()){
                    this.roomRef.remove();
                }
            }).then(()=>{
                this.props.screenProps.navigate('Home')
            })
        })
        
    }

    _transition(boolean) {
        if(boolean){
            this.setState({transition:true})
            Animated.timing(
                this.state.transitionOpacity,{
                    toValue:1,
                    duration:GAME_ANIM
                }
            ).start()
        } else {
            setTimeout(()=>{this.setState({transition:false})},GAME_ANIM)
            Animated.timing(
                this.state.transitionOpacity,{
                    toValue:0,
                    duration:GAME_ANIM
                }
            ).start()
        }
    }

    _updatePage(page){
        if(page > this.state.page){
            this.setState({page:page, currentpage:page})
        } else {
            this.setState({currentpage:page})
        }
    }

    _navigateTo(page){
        this.refs.scrollView.scrollTo({x:(page-1)*this.width,animated:true})
        this.setState({currentpage:page})
        this._menuPress()
    }

    _changePage(page){
        if(page<6 && page>0){
            this.refs.scrollView.scrollTo({x:(page-1)*this.width,animated:true})
            this.setState({currentpage:page})
        }
    }

    render() {
        return <View style = {{flex:1, backgroundColor:colors.background}}>
            <View style = {{ height:this.height*0.1, justifyContent:'center', alignItems:'center', marginTop:10}}>
                    <Text style = {styles.roomcode}>{this.state.roomname}</Text>
            </View>
            
            <View style = {{height:this.height*0.73}}>
                <ScrollView style = {{flex:1,backgroundColor:colors.background}}
                    horizontal showsHorizontalScrollIndicator={false} ref='scrollView' 
                    scrollEnabled = {false}>
                    <Lobby1
                        roomname = {this.state.roomname}
                        width = {this.width}
                        refs = {this.refs}
                        updatePage = {val => this._updatePage(val)}
                    />
                    <Lobby2 
                        roomname = {this.state.roomname}
                        width = {this.width}
                        refs = {this.refs}
                    />
                </ScrollView>
            </View>

            <Pager
                height = {this.height*0.08}
                page = {this.state.page}
                currentpage = {this.state.currentpage}
                lastpage = {2}
                goBack = {() => this._changePage(this.state.currentpage - 1)}
                goForward = {() => this._changePage(this.state.currentpage + 1)}
            />

            {this.state.transition?<Animated.View
                style = {{position:'absolute', top:0, bottom:0, left:0, right:0, justifyContent:'center',
                alignItems:'center', backgroundColor:colors.shadow, opacity:this.state.transitionOpacity}}>
                <Text style = {styles.roomcode}>LOADING ...</Text>
            </Animated.View>:null}
        </View>
    }
}

export class Lobby1 extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            alias:null,
            errormessage:'Your name must be 1 - 10 Characters',
        };

        this.height = Dimensions.get('window').height;
        this.width = Dimensions.get('window').width;
    }

    _continue(name) {
        if(name && name.trim().length>0 && name.trim().length < 11){

            this.props.updatePage(2)

            firebase.database().ref('rooms').child(this.props.roomname).child('listofplayers')
            .child(firebase.auth().currentUser.uid).update({
                name:               name.trim(),
                presseduid:         'foo',
            }).then(()=>{
                firebase.database().ref('rooms').child(this.props.roomname).child('ready')
                .child(firebase.auth().currentUser.uid).set(false).then(()=>{
                    this.setState({errormessage:null})
                    this.props.refs.scrollView.scrollTo({x:this.props.width,y:0,animated:true})
                })
            })
        } else {
            this.refs.nameerror.shake(800)
        }
        
    }

    render() {
        return <View style = {{flex:0.7, alignItems:'center', width:this.props.width}}>

            <View style = {{height:this.height*0.12}}/>
            <View style = {{height:this.height*0.07, justifyContent:'center', alignItems:'center'}}>
                <Text style = {styles.subtitle}>choose your name!</Text>
            </View>
            <TextInput
                autoFocus
                keyboardType='default'
                maxLength={10}
                style={[styles.nameInput,{height:this.height*0.1, width:this.width*0.6}]}
                value={this.state.alias}
                onChangeText = {(text) => {this.setState({alias: text})}}
                onSubmitEditing = {(event)=>{
                    this._continue(event.nativeEvent.text);
                }}
            />

            <View style = {{height:this.height*0.1}}/>

            <CustomButton
                size = {0.2}
                flex = {0.5}
                depth = {6}
                radius = {10}
                color = {colors.menubtn}
                onPress = {()=>{
                    this._continue(this.state.alias);
                }}
                title = 'GO'
            />
            
            <Animatable.Text style = {[styles.sfont,{height:this.height*0.1, justifyContent:'center'}]} 
                ref = 'nameerror'>{this.state.errormessage}</Animatable.Text>

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
