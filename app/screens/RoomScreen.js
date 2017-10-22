
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    BackHandler,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    Keyboard,
    FlatList,
    ListView,
    TouchableOpacity,
    TouchableWithoutFeedback,
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import randomize from 'randomatic';

import { Button, List } from "react-native-elements";

import { isInGame } from "../auth";
import { isInRoom } from "../auth";

import Mafia_Screen from './MafiaScreen.js';
import { Option_Screen, Expired_Screen } from './OptionScreen.js';

//Firebase
import firebase from '../firebase/FirebaseController.js';

class Room_Screen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        
        this.state = {
            roomtype:'',
        };
    }

    componentWillMount() {

        //Necessary???
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room/type')
            .on('value',snap=>{
                this.setState({roomtype: snap.val()})
            })

    }

    componentWillUnmount() {
    }

    _createRoom() {
        this.props.navigation.navigate('Create_Screen');
    }

    _findRoom() {
        this.props.navigation.navigate('Join_Screen');
    }

    render() {
        return <View 
        style = {{
            flex:1,
            backgroundColor:'white'
        }}>
            <View style = {{flex:1}}> 
                <TouchableWithoutFeedback 
                    style = {{ flex:1,justifyContent:'center' }}
                    onPress={()=>{ this._createRoom() }}>
                    <View style = {{flex:1,backgroundColor:'black',justifyContent:'center',alignItems:'center'}}>
                        <Text style = {{
                            fontFamily:'ConcertOne-Regular',
                            color:'white',
                            fontSize:30,
                            justifyContent:'center'}}>Make a Room</Text>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback 
                    style = {{ flex:1,justifyContent:'center' }}
                    onPress={()=>{ this._findRoom() }}>
                    <View style = {{flex:1,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                        <Text style = {{
                            fontFamily:'ConcertOne-Regular',
                            color:'black',
                            fontSize:30,
                            justifyContent:'center'}}>Join a Room</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    }
}

class Create_Screen extends React.Component {
    
    static navigationOptions = {
        title: 'Make a Room',
    };

    constructor(props) {
        super(props);

        this.state = {
            alias:'',
        };
    }

    _createRoom() {
        const roomname = randomize('A',4);

        //TODO: Check if room already exists
        
        AsyncStorage.setItem('ROOM-KEY', roomname);

        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room').update({
            name: roomname,
        });
        
        firebase.database().ref('rooms/' + roomname).set({
            phase: 1,
            owner: firebase.auth().currentUser.uid,
            playernum: 1,
            daycounter:1,
        });

        //Set up list of players
        firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
            + firebase.auth().currentUser.uid).set({
                name: this.state.alias,
                dead:false,
                bloody:false,
                suspicious:false,
        });

        //Set up phases and rules
        //Set up temporary list of roles
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room/type').once('value',outsnap=>{
        
            firebase.database().ref(outsnap.val() + '/roles').once('value',snap => {
                snap.forEach((child)=>{

                    firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid 
                    + '/' + child.val().name).set({
                        count:0,
                        color: child.val().color,
                        desc: child.val().desc,
                        type: child.val().type,
                        roleid: child.key,
                    })

                })
            }) 

            firebase.database().ref(outsnap.val() + '/phases').once('value',snap=>{
                snap.forEach((child)=>{

                    firebase.database().ref('rooms/' + roomname + '/phases/' + child.key).set({
                        action:     child.val().action,
                        actionreset:child.val().actionreset,
                        continue:   child.val().continue,
                        locked:     child.val().locked,
                        name:       child.val().name,
                        nominate:   child.val().nominate,
                        trigger:    child.val().trigger,
                        type:       child.val().type,
                    })

                })
            })
        })
        
        //this.props.navigation.navigate('Lobby_Screen', {roomname: roomname});
        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: 'Lobby_Screen', params:{roomname:roomname}})
                ]
            })
        )
        Keyboard.dismiss();
    }

    render() {
        return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ Keyboard.dismiss() }}>
            <View style = {{flex:1,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',
                    color:'black',
                    fontSize:30}}>Who are you?
                </Text>

                <View style = {{ justifyContent: 'center', flexDirection: 'row', marginBottom:10 }}>
                    <TextInput
                        placeholder="Who are you? ..."
                        style={{
                            backgroundColor: 'white',
                            flex:0.6,
                        }}
                        value={this.state.alias}
                        onChangeText = {(text) => {this.setState({alias: text})}}
                        autoFocus={true}
                        onSubmitEditing = {()=>{Keyboard.dismiss()}}
                    />
                </View>

                <View style = {{ justifyContent: 'center', alignItems:'center', flexDirection: 'row' }}>
                    <View style = {{flex:0.75}}>
                    <Button
                        title="Go"
                        backgroundColor='black'
                        onPress={()=>{this._createRoom()}}
                    /></View>
                </View>

                {/*Make-shift Keyboard Avoiding View*/}
                <View style = {{flex:0.4}}/> 
            </View>
        </TouchableWithoutFeedback>
    }
}

class Join_Screen extends React.Component {

    static navigationOptions = {
        title: 'Join a Room',
    };

    constructor(props) {
        super(props);

        this.state = {
            joincode: '',
            alias:'',
        };
    }

    _joinRoom(joincode) {
        firebase.database().ref('rooms/' + joincode).once('value', snap => {
            if(snap.exists() && (snap.val().phase == 1)){

                AsyncStorage.setItem('ROOM-KEY', joincode);

                firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room').update({name:joincode});
                firebase.database().ref('rooms/' + joincode 
                    + '/listofplayers/' + firebase.auth().currentUser.uid).update({
                        name: this.state.alias,
                        dead:false,
                        bloody:false,
                        suspicious:false,
                });   

                firebase.database().ref('rooms/' + joincode + '/playernum').transaction((playernum) => {
                    return (playernum + 1);
                });       
                
                firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
                .update({ name:joincode })

                //this.props.navigation.navigate('Lobby_Screen', { roomname: joincode});
                this.props.navigation.dispatch(
                    NavigationActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({ routeName: 'Lobby_Screen', params:{roomname:roomname}})
                        ]
                    })
                )
            } else if (snap.exists() && (snap.val().phase > 1)) {
                alert('Game has already started.')
            } else {
                alert('Room does not Exist.')
            }
        })
    }

    render() {
        return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ Keyboard.dismiss() }}>
            <View style = {{flex:1,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',
                    color:'black',
                    fontSize:30}}>Join Room
                </Text>


                <View style = {{ justifyContent: 'center', flexDirection: 'row' }}>
                    <TextInput
                        placeholder="Who are you? ..."
                        style={{
                            backgroundColor: 'white',
                            flex:0.6,
                        }}
                        value={this.state.alias}
                        autoFocus = {true}
                        blurOnSubmit={false}
                        onChangeText = {(text) => {this.setState({alias: text})}}
                        onSubmitEditing = {()=>this.refs['roomcode'].focus()}
                    />
                </View>

                <View style = {{ justifyContent: 'center', flexDirection: 'row' }}>
                    <TextInput
                        ref='roomcode'
                        placeholder="Room Code ..."
                        style={{
                            backgroundColor: 'white',
                            flex:0.6,
                        }}
                        value={this.state.joincode}
                        autoCapitalize='characters'
                        blurOnSubmit={false}
                        onChangeText = {(text) => {this.setState({joincode: text})}}
                        onSubmitEditing = {()=>{Keyboard.dismiss()}}
                    />
                </View>

                <View style = {{ margin: 5, justifyContent: 'center', alignItems:'center', flexDirection: 'row' }}>
                        <View style = {{flex:0.75}}>
                        <Button
                            title="Go"
                            backgroundColor='black'
                            onPress={()=>{this._joinRoom(this.state.joincode.toUpperCase())}}
                        /></View>

                </View>

                {/*Makeshift Keyboard Avoiding View*/}
                <View style = {{flex:0.5}}/>
            </View>


        </TouchableWithoutFeedback>
    }
}

class Lobby_Screen extends React.Component {

    static navigationOptions = {
        header: null
    };
    
    constructor(props) {
        super(props);

        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        //Navigation parameters
        const { params } = this.props.navigation.state;
        const roomname = params.roomname.toUpperCase();

        this.state = {
            roomname: params.roomname.toUpperCase(),

            namelist:dataSource,

            rolecount:0,
            playercount:0,

            amiowner:false,
        };

        this.roleCount = firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid);
        this.playerCount = firebase.database().ref('rooms/' + roomname + '/listofplayers');
        this.gameStart = firebase.database().ref('rooms/' + roomname + '/phase');
        this.playerList = firebase.database().ref('rooms/' + roomname + '/listofplayers');
        this.ownerListener = firebase.database().ref('rooms/' + roomname + '/owner');

    }

    componentWillMount() {

        this._pullListOfPlayers();
        this._count();
        this._checkIfStart();

        this.ownerListener.on('value',snap=>{
            if(snap.val() == firebase.auth().currentUser.uid){
                this.setState({amiowner:true})
            } else {
                this.setState({amiowner:false})
            }
        })
    }

    componentWillUnmount() {

        if(this.roleCount){
            this.roleCount.off();
        }
        if(this.playerCount){
            this.playerCount.off();
        }
        if(this.gameStart){
            this.gameStart.off();
        }
        if(this.playerList){
            this.playerList.off();
        }
        if(this.ownerListener){
            this.ownerListener.off();
        }
    }

    _pullListOfPlayers() {
        this.playerList.on('value',snap => {
            
            var list = [];
            snap.forEach((child)=> {
                list.push({
                    name: child.val().name,
                    key: child.key,
                })
            })
            this.setState({namelist:list})
        })
    }

    _deleteRoom() {

        AsyncStorage.removeItem('ROOM-KEY');

        firebase.database().ref('rooms/' + this.state.roomname).remove();
        firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid).remove();
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room').update({name:null});
        //this.props.navigation.navigate('Room_Screen');
        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: 'Room_Screen'})
                ]
            })
        )
    }

    _leaveRoom(roomname) {

        AsyncStorage.removeItem('ROOM-KEY');

        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room').update({name:null});
        firebase.database().ref('rooms/' + roomname.toUpperCase() + '/playernum').transaction((playernum) => {
            return (playernum - 1);
        });  
        //this.props.navigation.navigate('Room_Screen');
        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: 'Room_Screen'})
                ]
            })
        )
    }

    _count() {

        //Role Count
        this.roleCount.on('value',snap=>{
            var rolecount = 0;
            snap.forEach((child)=>{
                rolecount = rolecount + child.val().count;
            })
            this.setState({rolecount:rolecount})
        });

        //Player Count
        this.playerCount.on('value',snap=>{
            this.setState({playercount:snap.numChildren()})
        });
    }

    _checkIfStart() {
        this.gameStart.on('value',snap=> {
            if(snap.val() > 1 ){
                
                AsyncStorage.setItem('GAME-KEY',this.state.roomname);

                firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
                    .update({phase: snap.val()})
                //this.props.navigation.navigate('Mafia_Screen', {roomname: this.state.roomname})
                this.props.navigation.dispatch(
                    NavigationActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({ routeName: 'Mafia_Screen',
                            params:{roomname:this.state.roomname}})
                        ]
                    })
                )
            }
        })
    }

    _startGame(rolecount,playercount,roomname) {

        if(rolecount==playercount){

            AsyncStorage.setItem('GAME-KEY',roomname);

            this._handOutRoles(roomname);

            firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid).remove();

            firebase.database().ref('rooms/' + roomname).update({phase:2});

            //this.props.navigation.navigate('Mafia_Screen', { roomname:roomname })
            this.props.navigation.dispatch(
                NavigationActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'Mafia_Screen',
                        params:{roomname:this.state.roomname}})
                    ]
                })
            )
        } else {
            alert('The number of players does not match the Game set-up.');
        }
    }

    _handOutRoles(roomname){

        var randomstring = '';
        var charcount = 0;

        firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid).once('value',snap=>{

            snap.forEach((child)=>{
                if(child.val().count > 0){
                    for(i=0;i<child.val().count;i++){
                        if(child.val().roleid == 'E'){
                            randomstring = randomstring + randomize('?', 1, {chars: 'BCD'})
                            charcount++
                        } else if (child.val().roleid == 'I'){ //Random Mischeif Mafia
                            randomstring = randomstring + randomize('?', 1, {chars: 'BCD'})
                            charcount++
                        } else if (child.val().roleid == 'M'){ //Random Inspective Town
                            randomstring = randomstring + randomize('?', 1, {chars: 'KL'})
                            charcount++
                        } else if (child.val().roleid == 'P'){ //Random Stalling Town
                            randomstring = randomstring + randomize('?', 1, {chars: 'NO'})
                            charcount++
                        } else if (child.val().roleid == 'S'){ //Random Specialist Town
                            randomstring = randomstring + randomize('?', 1, {chars: 'QR'})
                            charcount++
                        } else if (child.val().roleid == 'T'){ //Random Town
                            randomstring = randomstring + randomize('?', 1, {chars: 'KLNOQR'})
                            charcount++
                        } else {
                            randomstring = randomstring + child.val().roleid
                            charcount++
                        }
                    }
                }
            })

            var min = Math.ceil(1);
            var max = Math.ceil(charcount);

            firebase.database().ref('rooms/' + roomname + '/listofplayers').once('value',insidesnap=>{
                insidesnap.forEach((child)=>{

                    var randomnumber = Math.floor(Math.random() * (max - min + 1)) + min;

                    firebase.database().ref('rooms/' + roomname + '/listofplayers/' + child.key)
                        .update({roleid: randomstring.charAt(randomnumber - 1)});

                    if(randomstring.charAt(randomnumber - 1) == 'A' ||
                        randomstring.charAt(randomnumber - 1) == 'B' ||
                        randomstring.charAt(randomnumber - 1) == 'C' ||
                        randomstring.charAt(randomnumber - 1) == 'D' ||
                        randomstring.charAt(randomnumber - 1) == 'J'){
                            firebase.database().ref('rooms/' + roomname + '/mafia/' 
                                + child.key).update({roleid:randomstring.charAt(randomnumber - 1)})
                    }
                    
                    max = max - 1;
                    randomstring = randomstring.slice(0,randomnumber-1) + randomstring.slice(randomnumber);

                })
            })

        })
    }

    render() {
        return <View style = {{
            backgroundColor: 'white',
            flex: 1,
        }}>
            <View style = {{flex:1,flexDirection:'row'}}>
                <View style = {{flex:1}}/>
                <View style = {{
                    flex:15, 
                    borderBottomLeftRadius: 15, borderBottomRightRadius: 15, 
                    backgroundColor: 'black', justifyContent: 'center', }}
                > 
                    <Text style = {{color:'white', alignSelf:'center',
                        fontFamily:'ConcertOne-Regular', fontSize:25}}>
                        {'Room Name: ' + this.state.roomname}
                    </Text>
                </View>
                <View style = {{flex:1}}/>
            </View>

            <View style = {{flex:0.15}}/>

            <View style = {{flex:10.65,flexDirection: 'row'}}>
                <View style = {{flex:0.2}}/>
                <View style = {{flex:3}}><FlatList
                        data={this.state.namelist}
                        renderItem={({item}) => (
                            <TouchableOpacity 
                                onPress={() => { }}
                                style = {{height:40,
                                    flex:0.5,
                                    borderRadius:5,
                                    backgroundColor: 'black',
                                    margin: 3,
                                    justifyContent:'center'
                            }}> 
                                <Text style = {styles.concerto}>{item.name}</Text>
                            </TouchableOpacity>

                        )}
                        keyExtractor={item => item.key}
                        numColumns={2}
                    />
                </View>
                <View style = {{flex:0.2}}/>
            </View>

            <View style = {{flex:0.15}}/>

            <View style = {{flex:1,flexDirection:'row'}}>
                <View style = {{flex:0.2}}/>
                <View style = {{flex:0.36,justifyContent:'center',
                    backgroundColor:'black',borderTopLeftRadius:15,borderBottomLeftRadius:15}}>
                    <TouchableOpacity
                        onPress={()=> {
                            alert('does nothing')
                        }}>
                        <MaterialCommunityIcons name='cursor-pointer'
                                    style={{color:'white', fontSize:26,alignSelf:'center'}}/>
                    </TouchableOpacity>
                </View>
                <View style = {{flex:0.36,justifyContent:'center',backgroundColor:'black'}}>
                    <TouchableOpacity
                        onPress={()=> {
                            AsyncStorage.getItem('ROOM-KEY',(error,result)=>{
                                alert(result)
                            })
                        }}>
                        <MaterialCommunityIcons name='dice-5'
                                    style={{color:'white', fontSize:26,alignSelf:'center'}}/>
                    </TouchableOpacity>
                </View>
                <View style = {{flex:0.36,justifyContent:'center',backgroundColor:'black'}}>
                    <TouchableOpacity
                        onPress={()=> {
                            this.state.amiowner?this._startGame(this.state.rolecount,this.state.playercount,
                                this.state.roomname):alert('You are not the Owner');
                        }}>
                        <MaterialCommunityIcons name='play-circle'
                                    style={{color:'white', fontSize:32,alignSelf:'center'}}/>
                    </TouchableOpacity>
                </View>
                <View style = {{flex:0.36,justifyContent:'center',backgroundColor:'black'}}>
                    <TouchableOpacity
                        onPress={()=> {
                            alert(randomize('?', 1, {chars: 'AB'}))
                        }}>
                        <MaterialCommunityIcons name='bookmark'
                                    style={{color:'white', fontSize:26,alignSelf:'center'}}/>
                    </TouchableOpacity>
                </View>
                <View style = {{flex:0.36,justifyContent:'center',backgroundColor:'black',
                    borderTopRightRadius:15,borderBottomRightRadius:15}}>
                    <TouchableOpacity
                        onPress={()=> {
                            this.state.amiowner?this._deleteRoom():this._leaveRoom(this.state.roomname);
                        }}>
                        <MaterialCommunityIcons name={this.state.amiowner?'delete-circle':'close-circle'}
                                    style={{color:'white', fontSize:26,alignSelf:'center'}}/>
                    </TouchableOpacity>
                </View>
                <View style = {{flex:0.2}}/>
            </View>

            <View style = {{flex:0.15}}/>

        </View>
    }
}


export default class App extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          inGame:           false,
          checkedInGame:    false,

          inRoom:           false,
          checkedInRoom:    false,

          isExpired:        false,
          checkedExpired:   false,

        };

        AsyncStorage.getItem('ROOM-KEY',(error,result)=>{
            this.state.roomname = result;
        })
      }
    
    componentWillMount() {
        
        isInGame()
            .then(res => this.setState({ inGame: res, checkedInGame: true }))
            .catch(err => alert("is In Game error"));
            
        isInRoom()
            .then(res => this.setState({ inRoom: res, checkedInRoom: true }))
            .catch(err => alert("is In Room error"));

        AsyncStorage.getItem('ROOM-KEY',(error,result)=>{
            if(result){
                firebase.database().ref('rooms/' + result + '/listofplayers/' 
                + firebase.auth().currentUser.uid).once('value',snap=>{
                    if(!snap.exists()){
                        this.setState({isExpired:true, checkedExpired:true})
                    } else {
                        this.setState({isExpired:false, checkedExpired:true})
                    }
                })
            }  else {
                this.setState({checkedExpired:true})
            }
        })
        
    }

    render(){
        const { checkedInGame, inGame, checkedInRoom, inRoom,
            checkedExpired, isExpired, roomname } = this.state;
        
        // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
        if (!checkedInGame || !checkedInRoom || !checkedExpired) {
            return null;
        }

        const Layout = createRoomNavigator(inGame,inRoom,isExpired,roomname);
        return <Layout />;
    }
}

export const createRoomNavigator = (inGame,inRoom,isExpired,key) => {
    return StackNavigator(
    
        {
            Room_Screen: {
                screen: Room_Screen,
            },
            Create_Screen: {
            screen: Create_Screen,
            },
            Join_Screen: {
            screen: Join_Screen,
            },
            Expired_Screen: {
                screen: Expired_Screen,
            },
            Lobby_Screen: {
            screen: Lobby_Screen,
            },
            Mafia_Screen: {
                screen: Mafia_Screen,
            },
            Option_Screen: {
                screen: Option_Screen,
            },
        },
            {
                headerMode: 'screen',
                initialRouteName: 
                    inRoom?(
                        inGame?(
                            isExpired?'Expired_Screen':'Mafia_Screen'
                        ):'Lobby_Screen'
                    ):'Room_Screen',
                initialRouteParams: {roomname:key}
            }
        );
} 

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: '#a98fe0',
    },
    actionButtonItem: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    concerto: {
        fontSize:17,
        fontFamily:'ConcertOne-Regular',
        color:'white',
        alignSelf: 'center',
    },

});