
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
import { MenuButton } from '../components/MenuButton.js';

import { StackNavigator, TabNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import Rolesheet from '../misc/roles.json';
import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';

import * as Animatable from 'react-native-animatable';

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
        };

        this.nameRef = firebase.database().ref('rooms').child(params.roomname)
            .child('listofplayers').child(firebase.auth().currentUser.uid).child('name');
        
    }

    
    componentWillMount() {
        this.nameRef.once('value',snap=>{
            this.setState({
                alias:snap.val(),
                loading:false,
            })
        })

        BackHandler.addEventListener("hardwareBackPress", this._onBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this._onBackPress);
    }

    _onBackPress = () => {
        firebase.database().ref('rooms').child(this.state.roomname).remove().then(()=>{
            this.props.navigation.dispatch(NavigationActions.back({key:'Room'}));
        })
    }


    _continue(name) {

        if(name && name.length>0 && name.length < 11){
            firebase.database().ref('rooms').child(this.state.roomname).child('listofplayers')
            .child(firebase.auth().currentUser.uid).update({
                name: name,
            }).then(()=>{
                this.setState({errormessage:null})
                this.props.navigation.navigate('Creation2')
            })
        } else {
            this.setState({errormessage:'Your name must be 1 - 10 Characters'})
            this.refs.nameerror.shake(800)
        }

    }

    render() {

        if(this.state.loading){
            <View style = {{backgroundColor:colors.main}}/>
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

                <View style = {{flex:0.1}}/>

                <View style = {{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                    <View style = {{flex:0.4,flexDirection:'row'}}>
                        <TextInput
                            ref={(input) => { this.textInput = input; }}
                            placeholder="Who are you?"
                            placeholderTextColor={colors.font}
                            style={{
                                backgroundColor: colors.main,
                                flex:0.6,
                                fontFamily:'ConcertOne-Regular',
                                fontSize: 20,
                                color:colors.font,
                                textAlign:'center',
                            }}
                            value={this.state.alias}
                            onChangeText = {(text) => {this.setState({alias: text})}}
                            onSubmitEditing = {()=>{ 
                                this._continue(this.state.alias);
                            }}
                        />
                    </View>
                    <View style = {{flex:0.6}}>
                    <Animatable.Text style = {styles.sconcerto} ref = 'nameerror'>
                    {this.state.errormessage}</Animatable.Text></View>
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
        };
    }

    componentWillMount() {
        AsyncStorage.getItem('ROOM-KEY',(error,result)=>{
            firebase.database().ref('rooms').child(result).once('value',snap=>{
                this.setState({
                    playercount: snap.val().playernum,
                    roomname: result,
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
                this.props.navigation.navigate('Creation3')
            })
        }
    }

    render() {

        if(this.state.loading){
            return <View style = {{backgroundColor:colors.main}}/>
        }

        return <View style = {{flex:1,backgroundColor:colors.main}}>

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

            <View style = {{flex:0.3,backgroundColor:colors.main,
                justifyContent:'center', alignItems:'center'}}>
                <Text style = {styles.concerto}>Total Number of Players:</Text>
                <View style = {{flex:0.4, flexDirection:'row'}}>
                    <TouchableOpacity
                        style = {{flex:0.25, backgroundColor:colors.font, marginTop:10,
                            borderRadius:15, justifyContent:'center', alignItems:'center'}}
                    >
                        <Text style = {styles.bigdarkconcerto}>
                            {this.state.playercount?this.state.playercount:'?'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style = {{flex:0.35, justifyContent:'center', alignItems:'center'}}>
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
                        <Text style = {styles.sconcerto}>CLEAR</Text></TouchableOpacity>
                    <TouchableOpacity style = {styles.digit}
                        onPress = {()=>{this._digit(0)}}><Text style={styles.dconcerto}>
                        0</Text></TouchableOpacity>
                    <TouchableOpacity style = {styles.symbol}
                        onPress = {()=>{this._done()}}>
                        <Text style = {styles.sconcerto}>DONE</Text></TouchableOpacity>
                </View>
            </View>

            <View style = {{flex:0.05}}/>

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

export class Creation4 extends Component {

    constructor(props) {
        
        super(props);

        this.state = {

            roomname: '',
            difficulty: 3,

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

        return <View style = {{flex:1,backgroundColor:colors.main}}>

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

            <View style = {{flex:0.8, justifyContent:'center', flexDirection:'row'}}>
                <View style = {{flex:0.7, backgroundColor:colors.main, justifyContent:'center'}}>

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
                        <Text style = {{
                            fontFamily:'ConcertOne-Regular',
                            fontSize: 25, color: colors.main,
                            marginTop:5, marginBottom:3}}>Town</Text>
                    </TouchableOpacity>
        
                    {!this.state.showtown? null: <View style = {{flex:0.7}}><FlatList
                        data={this.state.townlist}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                onPress = {()=>{
                                    this._roleBtnPress(item.key,item.index,item.count)  
                                }}
                                style = {{backgroundColor:item.count?colors.background:colors.main,flex:0.5,
                                    borderRadius:2, margin:3}}>
                                <View style = {{justifyContent:'center',alignItems:'center'}}>
                                    <Image 
                                        style={{width:70,height:70}}
                                        source={{uri: Rolesheet[item.key].image}}
                                    />
                                    <Text style = {{
                                        color:colors.font,
                                        fontFamily: 'ConcertOne-Regular',
                                        fontSize:18}}>{item.name}</Text>
                                    <Text style = {{
                                        color:colors.font,
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
                        <Text style = {{
                            fontFamily:'ConcertOne-Regular',
                            fontSize: 25, color: colors.main,
                            marginTop:5, marginBottom:5}}>Mafia</Text>
                    </TouchableOpacity>
        
                    {!this.state.showmafia?null:<View style = {{flex:0.7}}><FlatList
                        data={this.state.mafialist}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                onPress = {()=>{
                                    this._roleBtnPress(item.key,item.index,item.count)  
                                }}
                                style = {{backgroundColor:item.count?colors.background:colors.main,flex:0.5,
                                    borderRadius:2, margin:3}}>
                                <View style = {{justifyContent:'center',alignItems:'center'}}>
                                    <Image 
                                        style={{width:70,height:70}}
                                        source={{uri: Rolesheet[item.key].image}}
                                    />
                                    <Text style = {{
                                        color:colors.font,
                                        fontFamily: 'ConcertOne-Regular',
                                        fontSize:18}}>{item.name}</Text>
                                    <Text style = {{
                                        color:colors.font,
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
                        <Text style = {{
                            fontFamily:'ConcertOne-Regular',
                            fontSize: 25, color: colors.main,
                            marginTop:5, marginBottom:5}}>Neutral</Text>
                    </TouchableOpacity>
        
                    {!this.state.showneutral?null:<View style = {{flex:0.7}}><FlatList
                        data={this.state.neutrallist}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                onPress = {()=>{
                                    this._roleBtnPress(item.key,item.index,item.count)  
                                }}
                                style = {{backgroundColor:item.count?colors.background:colors.main,flex:0.5,
                                    borderRadius:2, margin:3}}>
                                <View style = {{justifyContent:'center',alignItems:'center'}}>
                                    <Image 
                                        style={{width:70,height:70}}
                                        source={{uri: Rolesheet[item.key].image}}
                                    />
                                    <Text style = {{
                                        color:colors.font,
                                        fontFamily: 'ConcertOne-Regular',
                                        fontSize:18}}>{item.name}</Text>
                                    <Text style = {{
                                        color:colors.font,
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
        };
        
    }

    componentWillMount() {
        AsyncStorage.getItem('ROOM-KEY',(error,result)=>{
            firebase.database().ref('rooms').child(result).once('value',snap=>{
                this.setState({
                    roomname: result,
                })
            })
        })
    }

    render() {

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
                    style = {{flex:0.5, justifyContent:'center', alignItems:'center',
                    backgroundColor:this.state.difficulty==1?colors.font:colors.main,
                    marginLeft:15, marginRight:10, borderRadius:10}}
                    onPress = {()=>{
                        this.props.navigation.dispatch(
                            NavigationActions.navigate({
                                routeName: 'Mafia',
                                action: NavigationActions.navigate({ 
                                    routeName: 'MafiaRoom',
                                    params: {roomname:this.state.roomname}
                                })
                            })
                        )
                    }} >
                    <MaterialCommunityIcons name='star-circle'
                        style={{color:this.state.difficulty==1?colors.main:colors.font,fontSize:30}}/>
                    <Text style = {this.state.difficulty==1?styles.dconcerto:styles.concerto}>New</Text>
                </TouchableOpacity>

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
        color: colors.main,
    },
    dconcerto: {
        fontSize: 20,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.main,
    },
    digit: {
        flex:0.2,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.font, 
        borderRadius:10,
        margin:5
    },
    symbol: {
        flex:0.2,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.main, 
        borderRadius:10,
        margin:5
    },
    

});