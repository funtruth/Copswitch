
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
    TouchableOpacity
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import ModalPicker from 'react-native-modal-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import randomize from 'randomatic';

import { Button, List, ListItem, FormInput } from "react-native-elements";
import ProfileButton from '../components/ProfileButton.js';

import Mafia_Screen from './MafiaScreen.js';

//Firebase
import firebase from '../firebase/FirebaseController.js';

class Room_Screen extends React.Component {

constructor(props) {
    super(props);

    this.state = {
        joincode: '',
        creatorname:'',
        alias:'',
    };

}

componentWillMount() {

    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
    
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room').once('value',snap=>{
        if(snap.val().phase > 1){
            this.props.navigation.navigate('Mafia_Screen', {roomname:snap.val().name})
        } else if (snap.val().name){
            this.props.navigation.navigate('Lobby_Screen', {roomname:snap.val().name})
        }
    })

    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room/type')
        .on('value',snap=>{
            this.setState({roomtype: snap.val()})
        })

}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);

}

_handleBackButton() {
    return true;
}

_createRoom() {
    const roomname = randomize('A',4);

    //TODO: Check if room already exists
    
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room').update({
        name: roomname,
    });
    
    firebase.database().ref('rooms/' + roomname).set({
        phase: 1,
        owner: firebase.auth().currentUser.uid,
        playernum: 1,
    });

    //Set up list of players
    firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
        + firebase.auth().currentUser.uid).set({
            name: this.state.creatorname,
            dead:false,
            actionbtnvalue: false,
            presseduid: 'foo',
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
    
    this.props.navigation.navigate('Lobby_Screen', {roomname: roomname})
}

_joinRoom(joincode) {
    firebase.database().ref('rooms/' + joincode.toUpperCase()).once('value', snap => {
        if(snap.exists() && (snap.val().phase == 1)){

            firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room').update({name:joincode});
            firebase.database().ref('rooms/' + joincode.toUpperCase() 
                + '/listofplayers/' + firebase.auth().currentUser.uid).set({
                    name: this.state.alias,
                    dead:false,
                    actionbtnvalue:false,
                    presseduid:'foo',
            });   
            firebase.database().ref('rooms/' + joincode.toUpperCase()).update({playernum:snap.val().playernum+1});       
            
            firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
            .update({ name:joincode })

            this.props.navigation.navigate('Lobby_Screen', { roomname: this.state.joincode});
        } else if (snap.exists() && (snap.val().phase > 1)) {
            alert('Game has already started.')
        } else {
            alert('Room does not Exist.')
        }
    })
}

render() {
    return <View style = {{
        backgroundColor: 'white',
        flex: 1,
    }}>

        <View style = {{
            flex:1,
            margin: 10,
            borderRadius: 10,
            backgroundColor: 'black',
            justifyContent: 'center',
        }}>
            <Text style = {{color:'white', marginLeft:20, fontWeight: 'bold',}}>
                {'Mafia'}
            </Text>
        </View>

        <View style = {{flex:1.5}}/>

        <View style = {{
            flex:1,
            margin: 5,
            borderWidth: 1,
            justifyContent: 'center',
            flexDirection: 'row',
        }}>
            <View style = {{flex:1}}/>
            <TextInput
                placeholder="Who are you? ..."
                style={{
                    backgroundColor: 'white',
                    borderWidth:2,
                    flex:2,
                }}
                value={this.state.creatorname}
                onChangeText = {(text) => {this.setState({creatorname: text})}}
            />
            <View style = {{flex:1}}/>
        </View>

        <View style = {{
            flex:1.5,
            margin: 5,
            borderWidth: 1,
            justifyContent: 'center',
            flexDirection: 'row',
        }}>
                <View style = {{flex:1}}/>
                <View style = {{flex:4}}>
                <ProfileButton
                    title="Create Room"
                    backgroundColor='black'
                    onPress={()=>{this._createRoom()}}
                /></View>
                <View style = {{flex:1}}/>

        </View>
        
        <View style = {{flex:1}}/>

        <View style = {{
            flex:1,
            margin: 5,
            borderWidth: 1,
            justifyContent: 'center',
            flexDirection: 'row',
        }}>
            <View style = {{flex:1}}/>
            <TextInput
                placeholder="Who are you? ..."
                style={{
                    backgroundColor: 'white',
                    borderWidth:2,
                    flex:2,
                }}
                value={this.state.alias}
                onChangeText = {(text) => {this.setState({alias: text})}}
            />
            <View style = {{flex:1}}/>
        </View>

        <View style = {{
            flex:1,
            margin: 5,
            borderWidth: 1,
            justifyContent: 'center',
            flexDirection: 'row',
        }}>
            <View style = {{flex:1}}/>
            <TextInput
                placeholder="Room Code ..."
                style={{
                    backgroundColor: 'white',
                    borderWidth:2,
                    flex:2,
                }}
                value={this.state.joincode}
                onChangeText = {(text) => {this.setState({joincode: text})}}
            />
            <View style = {{flex:1}}/>
        </View>

        <View style = {{
            flex:1.5,
            margin: 5,
            borderWidth: 1,
            justifyContent: 'center',
            flexDirection: 'row',
        }}>
        
            <View style = {{flex:1}}/>
            <View style = {{flex:4}}>
            <ProfileButton
                title="Join Room"
                backgroundColor='black'
                onPress={()=>{this._joinRoom(this.state.joincode.toUpperCase())}}
            /></View>
            <View style = {{flex:1}}/>

        </View>

        <View style = {{flex:2}}/>


    </View>
}
}

class Lobby_Screen extends React.Component {

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

        leftlist:dataSource,
        rightlist:dataSource,

        rolecount:0,
        playercount:0,
    };

    this.roleCount = firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid);
    this.playerCount = firebase.database().ref('rooms/' + roomname + '/listofplayers');
    this.gameStart = firebase.database().ref('rooms/' + roomname + '/phase');

}

componentWillMount() {
    
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
    this._pullListOfPlayers();
    this._count();
    this._checkIfStart();

}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);

    if(this.roleCount){
        this.roleCount.off();
    }
    if(this.playerCount){
        this.playerCount.off();
    }
    if(this.gameStart){
        this.gameStart.off();
    }
}

_pullListOfPlayers() {

    firebase.database().ref('rooms/' + this.state.roomname.toUpperCase() 
        + '/listofplayers').on('value',snap => {
        
        var leftlist = [];
        var rightlist = [];
        var counter = 1;

        snap.forEach((child)=> {
            if((counter%2) == 1){
                leftlist.push({
                    name: child.val().name,
                    key: child.key,
                })
            } else {
                rightlist.push({
                    name: child.val().name,
                    key: child.key,
                })
            }
            counter++;
        })

        this.setState({leftlist:leftlist})
        this.setState({rightlist:rightlist})
    })
}

_handleBackButton() {
    return true;
}

_deleteRoom() {
    firebase.database().ref('rooms/' + this.state.roomname).remove();
    firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid).remove();
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room').update({name:null});
    this.props.navigation.navigate('Room_Screen');
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
        var playercount = 0;

        snap.forEach((child)=>{
            playercount++;
        })

        this.setState({playercount:playercount})
    });
}

_checkIfStart() {
    this.gameStart.on('value',snap=> {
        if(snap.val() > 1 ){
            firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
                .update({phase: snap.val()})
            this.props.navigation.navigate('Mafia_Screen', {roomname: this.state.roomname})
        }
    })
}

_startGame(rolecount,playercount,roomname) {

    if(rolecount==playercount){

        this._handOutRoles(roomname);

        firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid).remove();

        firebase.database().ref('rooms/' + roomname).update({phase:2});

        this.props.navigation.navigate('Mafia_Screen', { roomname:roomname })
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
                    randomstring = randomstring + child.val().roleid
                    charcount++
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
                    randomstring.charAt(randomnumber - 1) == 'E'){
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
                flex:2,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                backgroundColor: 'black',
                justifyContent: 'center',
            }}> 
                <Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>
                    Lobby
                </Text>
                <Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>
                    {this.state.roomname}
                </Text>
            </View>
            <TouchableOpacity style = {{
                    flex:1,
                    borderBottomLeftRadius: 10,
                    backgroundColor: 'black',
                    alignItems: 'center',
                    justifyContent:'center',
                    marginLeft:10,
                    marginBottom:10}}
                onPress={()=>{this._deleteRoom()}}>
                <MaterialIcons name="delete" style={{color:'white', fontSize:20}}/>
            </TouchableOpacity>
        </View>

        <View style = {{flex:0.2}}/>

        <View style = {{flex:7,flexDirection: 'row'}}>
            <View style = {{flex:3}}><FlatList
                    data={this.state.leftlist}
                    renderItem={({item}) => (
                        <TouchableOpacity 
                            onPress={() => {alert('dumb')}}
                            style = {{
                                height:40,
                                backgroundColor: 'black',
                                borderBottomRightRadius: 10,
                                borderTopRightRadius: 10,
                                marginBottom: 10,
                                justifyContent:'center'
                        }}> 
                            <Text style = {{color:'white', alignSelf: 'center'}}>{item.name}</Text>
                        </TouchableOpacity>

                    )}
                    keyExtractor={item => item.key}
                />
            </View>
            <View style = {{flex:2}}/>
            <View style = {{flex:3}}><FlatList
                    data={this.state.rightlist}
                    renderItem={({item}) => (
                        <TouchableOpacity 
                            onPress={() => {alert('dumb')}}
                            style = {{
                                height:40,
                                backgroundColor: 'black',
                                borderBottomLeftRadius: 10,
                                borderTopLeftRadius: 10,
                                marginBottom: 10,
                                justifyContent:'center'
                        }}> 
                            <Text style = {{color:'white', alignSelf: 'center'}}>{item.name}</Text>
                        </TouchableOpacity>

                    )}
                    keyExtractor={item => item.key}
                />
            </View>
        </View>

        <View style = {{flex:0.2}}/>

        <View style = {{flex:1,flexDirection:'row'}}>
            <View style = {{flex:1}}/>
            <View style = {{flex:2}}>
                <ProfileButton
                    title='Start Game'
                    backgroundColor='black'
                    onPress={()=> {this._startGame(this.state.rolecount,this.state.playercount,
                        this.state.roomname)}}
                />
            </View>
            <View style = {{flex:1}}/>
        </View>

    </View>
}}


export default stackNav = StackNavigator(
  {
      Room_Screen: {
          screen: Room_Screen,
      },
      Lobby_Screen: {
        screen: Lobby_Screen,
      },
      Mafia_Screen: {
          screen: Mafia_Screen,
      }
  },
      {
          headerMode: 'none',
          initialRouteName: 'Room_Screen',
      }
  );


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

});