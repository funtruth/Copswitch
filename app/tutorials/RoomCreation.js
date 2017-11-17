
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
    ActivityIndicator,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
}   from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MenuButton } from '../components/MenuButton.js';

import { NavigationActions } from 'react-navigation';

import Rolesheet from '../misc/roles.json';
import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';

import * as Animatable from 'react-native-animatable';
import randomize from 'randomatic';

export class Creation1 extends Component {
 
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
        firebase.database().ref('rooms').child(this.state.roomname).remove().then(()=>{
            this.props.navigation.dispatch(NavigationActions.back({key:'Room'}));
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
                        this.props.navigation.navigate('Creation2')
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
                            .then(()=>{
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
                    <MaterialCommunityIcons name='checkbox-blank-circle-outline'
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

export class Creation2 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            alias:'',
            roomname:'',
            playercount: null,
            playernum: 1,
            loading:true,
            
            firsttime: true,
        };
    }

    componentWillMount() {
        AsyncStorage.getItem('ROOM-KEY',(error,result)=>{

            this.setState({roomname:result})

            firebase.database().ref('rooms').child(result).once('value',snap=>{
                this.setState({
                    playercount: snap.val().playernum?snap.val().playernum:null,
                    loading: false,
                })
            })
        })
    }

    _digit(digit) {
        if(this.state.playercount){
            if(this.state.playercount.length > 1){
                this.refs.error.shake(800)
            } else if (Number(this.state.playercount + digit.toString()>15)) {
                this.refs.error.shake(800)
            } else {
                this.setState({
                    playercount: this.state.playercount + digit.toString()
                })
            }
        } else {
            this.setState({
                playercount: digit
            })
        }
    }
    _backspace() {
        this.setState({ playercount: null })
    }
    _done() {
        if(!this.state.playercount || this.state.playercount < 6 || this.state.playercount > 15){
            this.refs.error.shake(800)
            this.setState({playercount:null})
        } else {
            firebase.database().ref('rooms').child(this.state.roomname).update({
                playernum: Number(this.state.playercount)
            }).then(()=>{
                if(this.state.firsttime){
                    this.props.navigation.navigate('Creation3')
                    this.setState({firsttime:false})
                }
            })
        }
    }

    render() {
        return <View style = {{flex:1,backgroundColor:colors.background}}>

            <View style = {{flexDirection:'row', flex:0.1, marginTop:10, 
                justifyContent:'center',alignItems:'center'}}>
                <View style = {{flex:0.85}}/>
                <TouchableOpacity
                    style = {{flex:0.15}}
                    onPress = {()=>{
                        this.props.navigation.dispatch(NavigationActions.back())
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

            <View style = {{flex:0.25,backgroundColor:colors.background,
                justifyContent:'center', alignItems:'center'}}>
                <Text style = {styles.concerto}>How many people</Text>
                <Text style = {styles.concerto}>are Playing?</Text>
                <View style = {{flex:0.7, flexDirection:'row'}}>
                    <TouchableOpacity style = {styles.digit} >
                        <Text style = {styles.bigdarkconcerto}>
                            {this.state.playercount?this.state.playercount:'?'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style = {{flex:0.42, justifyContent:'center', alignItems:'center',
                backgroundColor:colors.color2, marginLeft:10, marginRight:10, borderRadius:10,
                paddingTop:5, paddingBottom:5}}>
                <Animatable.Text style = {styles.sconcerto}
                    ref='error'>
                    Must be a number from 6 - 15</Animatable.Text>
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
                        onPress = {()=>{this._done()}}>
                        <Text style = {styles.concerto}>DONE</Text></TouchableOpacity>
                </View>
            </View>

            <View style = {{flex:0.03}}/>

            <View style = {{flex:0.1, flexDirection:'row', 
            justifyContent:'center', alignItems:'center'}}>
                <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                    style={{color:colors.font,fontSize:15}}/>
                <MaterialCommunityIcons name='checkbox-blank-circle'
                    style={{color:colors.font,fontSize:15, marginLeft:20}}/>
                <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                    style={{color:colors.font,fontSize:15, marginLeft:20}}/>
                <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                    style={{color:colors.font,fontSize:15, marginLeft:20}}/>
                <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                    style={{color:colors.font,fontSize:15, marginLeft:20}}/>
            </View>

        </View>
    }
}

export class Creation3 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alias:'',
            roomname: '',
            difficulty: null,
            loading:true,
            
            firsttime: true,
        };
        
    }


    componentWillMount() {
        AsyncStorage.getItem('ROOM-KEY',(error,result)=>{

            this.setState({roomname:result})

            firebase.database().ref('rooms').child(result).child('difficulty').once('value',snap=>{
                this.setState({
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
            if(this.state.firsttime){
                this.props.navigation.navigate('Creation4')
                this.setState({firsttime:false})
            }
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
                        <Text style = {styles.concerto}>Room Code</Text>
                        <Text style = {styles.roomcode}>{this.state.roomname}</Text>
                    </View>
                </View>

                <View style = {{flex:0.1,backgroundColor:colors.background, 
                    justifyContent:'center', alignItems:'center'}}>
                    <Text style = {styles.concerto}>How experienced</Text>
                    <Text style = {styles.concerto}>is your Group?</Text>
                </View>

                <TouchableOpacity
                    style = {{flex:0.19, justifyContent:'center', alignItems:'center',
                    backgroundColor:this.state.difficulty==1?colors.font:colors.color2,
                    marginLeft:10, marginRight:10, marginTop:10, borderRadius:10}}
                    onPress = {()=>{
                        this._selectDifficulty(1)
                    }} >
                    <MaterialCommunityIcons name='star-circle'
                        style={{color:this.state.difficulty==1?colors.background:colors.font,fontSize:30}}/>
                    <Text style = {this.state.difficulty==1?styles.dconcerto:styles.concerto}>New</Text>
                    <Text style = {this.state.difficulty==1?styles.dsconcerto:styles.sconcerto}>
                        {'We are just trying out' + '\n' + 'Mafia for the first time!'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style = {{flex:0.19, justifyContent:'center', alignItems:'center',
                    backgroundColor:this.state.difficulty==2?colors.font:colors.color2,
                    marginLeft:10, marginRight:10, marginTop:10, borderRadius:10}}
                    onPress = {()=>{
                        this._selectDifficulty(2)
                    }} >
                    <View style = {{flexDirection:'row'}}>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:this.state.difficulty==2?colors.background:colors.font,fontSize:30}}/>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:this.state.difficulty==2?colors.background:colors.font,fontSize:30}}/>
                    </View>
                <Text style = {this.state.difficulty==2?styles.dconcerto:styles.concerto}>Average</Text>
                <Text style = {this.state.difficulty==2?styles.dsconcerto:styles.sconcerto}>
                        {'We play once and a while' + '\n' + 'and know most of the roles.'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style = {{flex:0.19, justifyContent:'center', alignItems:'center',
                    backgroundColor:this.state.difficulty==3?colors.font:colors.color2,
                    marginLeft:10, marginRight:10, marginTop:10, borderRadius:10}}
                    onPress = {()=>{
                        this._selectDifficulty(3)
                    }}
                >   
                    <View style = {{flexDirection:'row'}}>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:this.state.difficulty==3?colors.background:colors.font,fontSize:30}}/>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:this.state.difficulty==3?colors.background:colors.font,fontSize:30}}/>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:this.state.difficulty==3?colors.background:colors.font,fontSize:30}}/>
                    </View>
                    <Text style = {this.state.difficulty==3?styles.dconcerto:styles.concerto}>Expert</Text>
                    <Text style = {this.state.difficulty==3?styles.dsconcerto:styles.sconcerto}>
                        {'We play very frequently' + '\n' + 'and enjoy complicated gameplay.'}</Text>
                </TouchableOpacity>

                <View style = {{flex:0.03}}/>

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

export class Creation4 extends Component {

    constructor(props) {
        
        super(props);

        this.state = {

            roomname: '',
            difficulty: 1,

            townlist: [],
            mafialist: [],
            neutrallist: [],

            showtown:    true,
            showmafia:   false,
            showneutral: false,
        }

        this.listOfRoles = firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid);   
    }

    componentWillMount() {

        AsyncStorage.getItem('ROOM-KEY',(error,result)=>{
            this.setState({
                roomname: result,
                loading: false,
            })
        })

        var keys = Object.keys(Rolesheet).sort()
        var townlist = [];
        var mafialist = [];
        var neutrallist = [];
        keys.forEach(function(key){
            if(Rolesheet[key].type == 1){
                mafialist.push({
                    name:           Rolesheet[key].name,
                    index:          Rolesheet[key].index,
                    category:       Rolesheet[key].category,
                    count:          0,
                    image:          Rolesheet[key].image,
                    color:          Rolesheet[key].color,
                    difficulty:     Rolesheet[key].difficulty,
                    key:            key,
                })
            } else if (Rolesheet[key].type == 2) {
                townlist.push({
                    name:           Rolesheet[key].name,
                    index:          Rolesheet[key].index,
                    category:       Rolesheet[key].category,
                    count:          0,
                    image:          Rolesheet[key].image,
                    color:          Rolesheet[key].color,
                    difficulty:     Rolesheet[key].difficulty,
                    key:            key,
                })
            } else {
                neutrallist.push({
                    name:           Rolesheet[key].name,
                    index:          Rolesheet[key].index,
                    category:       Rolesheet[key].category,
                    count:          0,
                    image:          Rolesheet[key].image,
                    color:          Rolesheet[key].color,
                    difficulty:     Rolesheet[key].difficulty,
                    key:            key,
                })
            }
        })
        this.setState({
            mafialist:mafialist,
            townlist:townlist,
            neutrallist:neutrallist,
        })

        this.listOfRoles.on('value',snap=>{
            if(snap.exists()){
                var mafialist = this.state.mafialist;
                var townlist = this.state.townlist;
                var neutrallist = this.state.neutrallist;
                snap.forEach((child)=>{
                    if(Rolesheet[child.key].type == 1){
                        mafialist[Rolesheet[child.key].index]['count'] = child.val()
                    } else if (Rolesheet[child.key].type == 2) {
                        townlist[Rolesheet[child.key].index]['count'] = child.val()
                    } else {
                        neutrallist[Rolesheet[child.key].index]['count'] = child.val()
                    }
                })
                this.setState({
                    ownermode:true,
                    mafialist:mafialist,
                    townlist:townlist,
                    neutrallist:neutrallist
                })
            } else {
                this.setState({ownermode:false})
            }
        })

    }

    componentWillUnmount(){
        if(this.listOfRoles){
            this.listOfRoles.off();
        }
    }

    _roleBtnPress(key,index,count) {
        if(count>0){
            firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid 
            + '/' + key).transaction((count)=>{
                return count - 1;
            })
        } else {
            firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid 
            + '/' + key).transaction((count)=>{
                return count + 1;
            })
        }
    }

    render() {

        return <View style = {{flex:1,backgroundColor:colors.background}}>

            <View style = {{flexDirection:'row', flex:0.1, marginTop:10, 
                justifyContent:'center',alignItems:'center'}}>
                <View style = {{flex:0.15}}/>
                <View style = {{flex:0.70}}>
                    <Text style = {styles.concerto}>
                    {'Select' + ' 10 ' + 'Roles'}</Text>
                </View>
                <TouchableOpacity
                    style = {{flex:0.15}}
                    onPress = {()=>{
                        this.props.navigation.dispatch(NavigationActions.back());
                    }} >
                    <MaterialCommunityIcons name='close'
                        style={{color:colors.font,fontSize:30}}/>
                </TouchableOpacity>
            </View>

            <View style = {{flex:0.8, justifyContent:'center', marginLeft:4, marginRight:4}}>

                <TouchableOpacity
                    style = {{backgroundColor:colors.font, borderRadius:2,
                        justifyContent:'center', alignItems:'center',
                        marginBottom:3, marginTop:3, marginLeft:6, marginRight:6, 
                        flex:0.075}}
                    onPress = {()=>{
                        this.setState({
                            showtown:true,
                            showmafia:false,
                            showneutral:false,
                        })
                    }} >
                    <Text style = {styles.mdconcerto}>Town</Text>
                </TouchableOpacity>
    
                {!this.state.showtown? null: <View style = {{flex:0.7}}><FlatList
                    data={this.state.townlist}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress = {()=>{
                                this._roleBtnPress(item.key,item.index,item.count)  
                            }}
                            style = {{backgroundColor:item.count?colors.main:(
                                item.difficulty==this.state.difficulty?colors.color2:colors.disabled),
                                flex:0.5, borderRadius:2, margin:3}}>
                            <View style = {{justifyContent:'center',alignItems:'center'}}>
                                <Image 
                                    style={{width:70,height:70}}
                                    source={{uri: Rolesheet[item.key].image}}
                                />
                                <Text style = {{
                                    color:item.count?colors.background:colors.font,
                                    fontFamily: 'ConcertOne-Regular',
                                    fontSize:18}}>{item.name}</Text>
                                <Text style = {{
                                    color:item.count?colors.background:colors.font,
                                    fontFamily: 'ConcertOne-Regular',
                                    fontSize:14,
                                    marginBottom:5}}>{item.category}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    style={{margin:3}}
                    numColumns = {2}
                    keyExtractor={item => item.key}
                />
                </View>}
    
                <TouchableOpacity
                    style = {{backgroundColor:colors.font, borderRadius:2,
                        justifyContent:'center', alignItems:'center',
                        marginBottom:3, marginTop:3, marginLeft:6, marginRight:6, 
                        flex:0.075}}
                    onPress = {()=>{
                        this.setState({
                            showmafia:true,
                            showtown:false,
                            showneutral:false,
                        }) 
                    }} >
                    <Text style = {styles.mdconcerto}>Mafia</Text>
                </TouchableOpacity>
    
                {!this.state.showmafia?null:<View style = {{flex:0.7}}><FlatList
                    data={this.state.mafialist}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress = {()=>{
                                this._roleBtnPress(item.key,item.index,item.count)  
                            }}
                            style = {{backgroundColor:item.count?colors.main:colors.color2,flex:0.5,
                                borderRadius:2, margin:3}}>
                            <View style = {{justifyContent:'center',alignItems:'center'}}>
                                <Image 
                                    style={{width:70,height:70}}
                                    source={{uri: Rolesheet[item.key].image}}
                                />
                                <Text style = {{
                                    color:item.count?colors.background:colors.font,
                                    fontFamily: 'ConcertOne-Regular',
                                    fontSize:18}}>{item.name}</Text>
                                <Text style = {{
                                    color:item.count?colors.background:colors.font,
                                    fontFamily: 'ConcertOne-Regular',
                                    fontSize:14,
                                    marginBottom:5}}>{item.category}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    style={{margin:3}}
                    numColumns = {2}
                    keyExtractor={item => item.key}
                />
                </View>}
    
                <TouchableOpacity
                    style = {{backgroundColor:colors.font, borderRadius:2,
                        justifyContent:'center', alignItems:'center',
                        marginBottom:3, marginTop:3, marginLeft:6, marginRight:6,  
                        flex:0.075}}
                    onPress = {()=>{
                        this.setState({
                            showneutral:true,
                            showtown:false,
                            showmafia:false,
                        })
                    }} >
                    <Text style = {styles.mdconcerto}>Neutral</Text>
                </TouchableOpacity>
    
                {!this.state.showneutral?null:<View style = {{flex:0.7}}><FlatList
                    data={this.state.neutrallist}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress = {()=>{
                                this._roleBtnPress(item.key,item.index,item.count)  
                            }}
                            style = {{backgroundColor:item.count?colors.main:colors.color2,flex:0.5,
                                borderRadius:2, margin:3}}>
                            <View style = {{justifyContent:'center',alignItems:'center'}}>
                                <Image 
                                    style={{width:70,height:70}}
                                    source={{uri: Rolesheet[item.key].image}}
                                />
                                <Text style = {{
                                    color:item.count?colors.background:colors.font,
                                    fontFamily: 'ConcertOne-Regular',
                                    fontSize:18}}>{item.name}</Text>
                                <Text style = {{
                                    color:item.count?colors.background:colors.font,
                                    fontFamily: 'ConcertOne-Regular',
                                    fontSize:14,
                                    marginBottom:5}}>{item.category}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    style={{margin:3}}
                    numColumns = {2}
                    keyExtractor={item => item.key}
                />
                </View>}
            </View>

            <View style = {{flex:0.1, flexDirection:'row', 
            justifyContent:'center', alignItems:'center'}}>
                <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                    style={{color:colors.font,fontSize:15}}/>
                <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                    style={{color:colors.font,fontSize:15, marginLeft:20}}/>
                <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                    style={{color:colors.font,fontSize:15, marginLeft:20}}/>
                <MaterialCommunityIcons name='checkbox-blank-circle'
                    style={{color:colors.font,fontSize:15, marginLeft:20}}/>
                <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                    style={{color:colors.font,fontSize:15, marginLeft:20}}/>
            </View>
        </View>
    }
}

export class Creation5 extends Component {
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

        if(this.state.starting){
            return <View style = {{
                backgroundColor: colors.background,
                flex: 1,
                justifyContent:'center'}}>
                    <ActivityIndicator size='large' color={colors.font}/>
                    <Text style = {{fontSize:23,
                    fontFamily:'ConcertOne-Regular',
                    color:colors.font,
                    alignSelf: 'center',
                    }}>Handing out Roles</Text>
                    <View style = {{flex:0.25}}/>
                </View>
        }

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

                <View style = {{flex:0.49, flexDirection:'row',justifyContent:'center',
                    marginTop:10, marginBottom:10}}>
                    <View style = {{flex:0.9,justifyContent:'center', alignItems:'center'}}>
                        {this._renderListComponent()}
                    </View>
                </View>

                <View style = {{flex:0.06, flexDirection:'row', justifyContent:'center'}}>
                    {this._renderOptions()}
                </View>

                <View style = {{flex:0.05}}/>

                <View style = {{flex:0.1, flexDirection:'row', 
                justifyContent:'center', alignItems:'center'}}>
                    <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                        style={{color:colors.font,fontSize:15}}/>
                    <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                        style={{color:colors.font,fontSize:15, marginLeft:20}}/>
                    <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                        style={{color:colors.font,fontSize:15, marginLeft:20}}/>
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
    mconcerto: {
        fontSize: 30,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    mdconcerto: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 25, color: colors.background,
        marginTop:5, marginBottom:5
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
    dsconcerto: {
        fontSize: 15,
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