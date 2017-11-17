
import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    Image,
    FlatList,
    StyleSheet,
    AsyncStorage,
    Keyboard,
    BackHandler,
    TouchableOpacity,
    TouchableWithoutFeedback,
}   from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MenuButton } from '../components/MenuButton.js';

import { NavigationActions } from 'react-navigation';

import Rolesheet from '../misc/roles.json';
import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';

import * as Animatable from 'react-native-animatable';

export class Join1 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            roomname:'',
            errormessage:'Code must be 6 Digits long',
        };
        
    }

    _continue(roomname) {
        if(roomname.length==6){
            firebase.database().ref('rooms/' + roomname).once('value', snap => {
                if(snap.exists() && (snap.val().phase == 1)){
                    this._joinRoom(roomname)
                } else if (snap.exists() && (snap.val().phase > 1)) {
                    this.setState({errormessage:'Game has already started'})
                    this.refs.error.shake(800)
                } else {
                    this.setState({errormessage:'Invalid Room Code'})
                    this.refs.error.shake(800)
                }
            })
                
        } else {
            this.setState({errormessage:'Code must be 6 Digits long'})
            this.refs.error.shake(800)
        }
    }
    _backspace() {
        this.setState({ roomname: null })
    }
    _digit(digit) {
        if(this.state.roomname){
            if(this.state.roomname.length > 5 ){
                this.refs.error.shake(800)
            } else {
                this.setState({
                    roomname: this.state.roomname + digit.toString()
                })
            }
        } else {
            this.setState({
                roomname: digit.toString()
            })
        }
    }

    _joinRoom(roomname) {
        AsyncStorage.setItem('ROOM-KEY', roomname);

        firebase.database().ref('rooms/' + roomname 
            + '/listofplayers/' + firebase.auth().currentUser.uid).update({
                actionbtnvalue:     false,
                presseduid:         'foo',
        }).then(()=>{
            this.props.navigation.dispatch(
                NavigationActions.navigate({
                    routeName: 'LobbyTutorial',
                    action: NavigationActions.navigate({ 
                        routeName: 'Lobby1',
                        params: {roomname:roomname}
                    })
                })
            )
        })   
    }

    render() {

        return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ Keyboard.dismiss() }}>
            <View style = {{flex:1,backgroundColor:colors.background}}>

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
                        <Text style = {styles.concerto}>Enter the</Text>
                        <Text style = {styles.roomcode}>ROOM CODE</Text>
                    </View>
                </View>

                <View style = {{flex:0.25, justifyContent:'center', alignItems:'center'}}>
                    <View style = {{flex:0.4,flexDirection:'row'}}>
                        <TextInput
                            style={{
                                backgroundColor: colors.main,
                                flex:0.7,
                                fontFamily:'ConcertOne-Regular',
                                fontSize: 40,
                                color:colors.background,
                                textAlign:'center',
                                borderRadius:10,
                            }}
                            editable={false}
                            value={this.state.roomname}
                        />
                    </View>
                </View>

                <View style = {{flex:0.42, justifyContent:'center', alignItems:'center',
                backgroundColor:colors.color2, marginLeft:10, marginRight:10, borderRadius:10,
                paddingTop:5, paddingBottom:5}}>
                    <Animatable.Text style = {styles.sconcerto}
                        ref='error'>
                        {this.state.errormessage}</Animatable.Text>
                    <View style = {{flex:0.25, flexDirection:'row'}}>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(1)}}><Text style={styles.dconcerto}>
                            1</Text></TouchableOpacity>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(2)}}><Text style={styles.dconcerto}>
                            2</Text></TouchableOpacity>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(3)}}><Text style={styles.dconcerto}>
                            3</Text></TouchableOpacity>
                    </View>
                    <View style = {{flex:0.25, flexDirection:'row'}}>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(4)}}><Text style={styles.dconcerto}>
                            4</Text></TouchableOpacity>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(5)}}><Text style={styles.dconcerto}>
                            5</Text></TouchableOpacity>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(6)}}><Text style={styles.dconcerto}>
                            6</Text></TouchableOpacity>
                    </View>
                    <View style = {{flex:0.25, flexDirection:'row'}}>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(7)}}><Text style={styles.dconcerto}>
                            7</Text></TouchableOpacity>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(8)}}><Text style={styles.dconcerto}>
                            8</Text></TouchableOpacity>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(9)}}><Text style={styles.dconcerto}>
                            9</Text></TouchableOpacity>
                    </View>
                    <View style = {{flex:0.25, flexDirection:'row'}}>
                        <TouchableOpacity style = {styles.symbol}
                            onPress = {()=>{this._backspace()}}>
                            <Text style = {styles.concerto}>CLEAR</Text></TouchableOpacity>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(0)}}><Text style={styles.dconcerto}>
                            0</Text></TouchableOpacity>
                        <TouchableOpacity style = {styles.symbol}
                            onPress = {()=>{this._continue(this.state.roomname)}}>
                            <Text style = {styles.concerto}>DONE</Text></TouchableOpacity>
                    </View>
                </View>

                <View style = {{flex:0.13}}/>
            </View>
        </TouchableWithoutFeedback>
    }
}

export class Lobby1 extends Component {
    
    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;
        const roomname = params.roomname;

        this.state = {
            roomname: params.roomname,
            alias:'',
            loading:true,
            errormessage:null,
            
            firsttime: true,
        };

        this.nameRef = firebase.database().ref('rooms').child(params.roomname)
            .child('listofplayers').child(firebase.auth().currentUser.uid).child('name');
        
        this.connectedRef = firebase.database().ref(".info/connected");
    }

    
    componentWillMount() {
        this.nameRef.on('value',snap=>{
            this.setState({
                alias:snap.val(),
                loading:false,
            })
        })

        this.connectedRef.on('value',snap=>{
            if(snap.val()===true){
                this.setState({loading:false})
            } else {
                this.setState({loading:true})
            }
        })

        BackHandler.addEventListener("hardwareBackPress", this._onBackPress);
    }

    componentWillUnmount() {
        if(this.connectedRef){
            this.connectedRef.off();
        }
        if(this.nameRef){
            this.nameRef.off();
        }
        BackHandler.removeEventListener("hardwareBackPress", this._onBackPress);
    }

    _onBackPress = () => {
        firebase.database().ref('rooms').child(this.state.roomname).child('listofplayers')
        .child(firebase.auth().currentUser.uid).remove().then(()=>{
            this.props.navigation.dispatch(NavigationActions.back({key:'Join1'}));
            return true
        })  
    }


    _continue(name) {
        if(this.state.loading){
            this.setState({errormessage:'Wi-Fi connection Required.'})
            this.refs.nameerror.shake(800)
        } else {
            if(name && name.length>0 && name.length < 11){
                firebase.database().ref('rooms').child(this.state.roomname).child('listofplayers')
                .child(firebase.auth().currentUser.uid).update({
                    name:               name,
                    actionbtnvalue:     false,
                    presseduid:         'foo',
                }).then(()=>{
                    this.setState({errormessage:null})
                    if(this.state.firsttime){
                        this.props.navigation.navigate('Lobby2')
                        this.setState({firsttime:false})
                    }
                })
            } else {
                this.setState({ errormessage:'Your name must be 1 - 10 Characters' })
                this.refs.nameerror.shake(800)
                this.textInput.focus()
            }
        }
    }

    render() {
        return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ 
            Keyboard.dismiss()
            this._continue    
        }}>
            <View style = {{flex:1,backgroundColor:colors.background}}>

                <View style = {{flexDirection:'row', flex:0.1, marginTop:10, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.85}}/>
                    <TouchableOpacity
                        style = {{flex:0.15}}
                        onPress = {()=>{
                            firebase.database().ref('rooms').child(this.state.roomname).remove()
                            .child(firebase.auth().currentUser.uid).then(()=>{
                                this.props.navigation.dispatch(NavigationActions.back());
                            })
                        }} >
                        <MaterialCommunityIcons name='close'
                            style={{color:colors.font,fontSize:30}}/>
                    </TouchableOpacity>
                </View>

                <View animation='fadeIn' style = {{flexDirection:'row', flex:0.1, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.7}}> 
                        <Text style = {styles.concerto}>Room Code</Text>
                        <Text style = {styles.roomcode}>{this.state.roomname}</Text>
                    </View>
                </View>

                <View style = {{flex:0.1}}/>

                <View style = {{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                    <View style = {{flex:0.4,flexDirection:'row'}}>
                        <TextInput
                            ref={(input) => { this.textInput = input; }}
                            placeholder="What is your name?"
                            placeholderTextColor={colors.color2}
                            style={{
                                backgroundColor: colors.main,
                                flex:0.7,
                                fontFamily:'ConcertOne-Regular',
                                fontSize: 20,
                                color:colors.background,
                                textAlign:'center',
                                borderRadius:10,
                                borderWidth:10,
                                borderColor:colors.color2
                            }}
                            value={this.state.alias}
                            onChangeText = {(text) => {this.setState({alias: text})}}
                            onSubmitEditing = {()=>{ 
                                this._continue(this.state.alias);
                            }}
                        />
                    </View>
                    <View style = {{flex:0.2}}>
                    <Animatable.Text style = {styles.sconcerto} ref = 'nameerror'>
                    {this.state.errormessage}</Animatable.Text></View>
                    <View style = {{flex:0.4}}/>
                </View>

                <View style = {{flex:0.4}}/>
                    
                <View style = {{flex:0.1, flexDirection:'row', 
                    justifyContent:'center', alignItems:'center'}}>
                    <MaterialCommunityIcons name='checkbox-blank-circle'
                        style={{color:colors.font,fontSize:15}}/>
                    <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                        style={{color:colors.font,fontSize:15, marginLeft:20}}/>
                </View>
            </View>
        </TouchableWithoutFeedback>
    }
}

export class Lobby2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alias:'',
            roomname: '',
            difficulty: null,
            loading: true,
            starting:false,

            namelist:[],

            players:null,       //ListOfPlayers count
            playernum: null,    //Creation2 number
            rolecount:null,     //ListOfRoles count
        };

        this.listOfRolesRef = firebase.database().ref('listofroles')
            .child(firebase.auth().currentUser.uid);
        
    }

    componentWillMount() {
        AsyncStorage.getItem('ROOM-KEY',(error,result)=>{

            this.setState({roomname:result})
           
            this.listofplayersRef = firebase.database().ref('rooms').child(result).child('listofplayers')
            this.listofplayersRef.on('value',snap=>{
                var list = [];
                snap.forEach((child)=> {
                    list.push({
                        name: child.val().name,
                        key: child.key,
                    })
                })
                this.setState({
                    namelist:list,
                    players:snap.numChildren(),
                    loading:false
                })
            })

            this.playernumRef = firebase.database().ref('rooms').child(result).child('playernum')
            this.playernumRef.on('value',snap=>{
                this.setState({
                    playernum: snap.val(),
                })
            })
        })

        this.listOfRolesRef.on('value',snap=>{
            if(snap.exists()){
                var rolecount = 0;
                snap.forEach((child)=>{
                    rolecount = rolecount + child.val();
                })
                this.setState({rolecount:rolecount})
            }
        })
    }

    componentWillUnmount() {
        if(this.listOfRolesRef){
            this.listOfRolesRef.off();
        }
        if(this.listofplayersRef){
            this.listofplayersRef.off();
        }
        if(this.playernumRef){
            this.playernumRef.off();
        }
    }

    _startGame(roomname) {
        AsyncStorage.setItem('GAME-KEY',roomname);
        
        this._handOutRoles(roomname);

        firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid).remove();

        this.setState({starting:true})

        setTimeout(()=>{
            firebase.database().ref('rooms').child(roomname).child('phase').set(2).then(()=>{
                this.props.navigation.dispatch(
                    NavigationActions.navigate({
                        routeName: 'Mafia',
                        action: NavigationActions.navigate({ 
                            routeName: 'MafiaRoom',
                            params: {roomname:roomname}
                        })
                    })
                )
            })
        },2000)
    }

    _handOutRoles(roomname){
        
        var randomstring = '';
        var charcount = 0;

        firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid).once('value',snap=>{

            snap.forEach((child)=>{
                for(i=0;i<child.val();i++){
                    randomstring = randomstring + randomize('?', 1, {chars: child.key})
                    charcount++
                }
            })

            var min = Math.ceil(1);
            var max = Math.ceil(charcount);

            this.listofplayersRef.once('value',insidesnap=>{
                insidesnap.forEach((child)=>{

                    var randomnumber = Math.floor(Math.random() * (max - min + 1)) + min;
                    var randomrole = randomstring.charAt(randomnumber-1);

                    this.listofplayersRef.child(child.key).update({
                        roleid:         randomrole,
                        charges:        Rolesheet[randomrole].charges,
                        suspicious:     Rolesheet[randomrole].suspicious,
                        type:           Rolesheet[randomrole].type,
                    })

                    if(randomrole == randomrole.toLowerCase()){
                        firebase.database().ref('rooms/' + roomname + '/mafia/' 
                        + child.key).update({
                            roleid:randomrole,
                            name: child.val().name,
                            alive: true,
                        })
                    }
                    
                    max = max - 1;
                    randomstring = randomstring.slice(0,randomnumber-1) + randomstring.slice(randomnumber);
                })
            })

        })
    }

    _renderListComponent(){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <TouchableOpacity 
                    onPress={() => { }}
                    style = {{ justifyContent:'center', marginTop:5, marginBottom:5 }} > 
                    <Text style = {styles.concerto}>{item.name}</Text>
                </TouchableOpacity>
            )}
            numColumns={1}
            keyExtractor={item => item.key}
        />
    }

    _renderOptions() {
        return <TouchableOpacity
            style = {{
            backgroundColor:colors.font, flex:0.6, alignItems:'center',
            justifyContent:'center', marginLeft:15, marginRight:10, borderRadius:2}}
            onPress = {()=>{
                this._startGame(this.state.roomname);
            }} >
            <Text style = {styles.mdconcerto}>Start Game</Text>
        </TouchableOpacity>
    }

    render() {
        return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ Keyboard.dismiss() }}>
            <View style = {{flex:1,backgroundColor:colors.background}}>

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

                <View style = {{flex:0.025}}/>
                        
                <View style = {{flex:0.075,backgroundColor:colors.background, 
                    justifyContent:'center', alignItems:'center'}}>
                    <Text style = {styles.mconcerto}>Players:</Text>
                </View>

                <View style = {{flex:0.55, flexDirection:'row',justifyContent:'center',
                    marginTop:10, marginBottom:10}}>
                    <View style = {{flex:0.9,justifyContent:'center', alignItems:'center'}}>
                        {this._renderListComponent()}
                    </View>
                </View>

                <View style = {{flex:0.05}}/>

                <View style = {{flex:0.1, flexDirection:'row', 
                justifyContent:'center', alignItems:'center'}}>
                    <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                        style={{color:colors.font,fontSize:15, marginLeft:20}}/>
                    <MaterialCommunityIcons name='checkbox-blank-circle'
                        style={{color:colors.font,fontSize:15, marginLeft:20}}/>
                </View>

            </View>
        </TouchableWithoutFeedback>
    }
}


const styles = StyleSheet.create({
    roomcode: {
        fontSize: 40,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    sconcerto: {
        fontSize: 15,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    concerto: {
        fontSize: 20,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    bigdarkconcerto: {
        fontSize: 40,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.background,
    },
    dconcerto: {
        fontSize: 20,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.background,
    },
    digit: {
        flex:0.3,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.font, 
        borderRadius:10,
        margin:5
    },
    symbol: {
        flex:0.3,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.color2, 
        borderRadius:10,
        margin:5
    },
    

});