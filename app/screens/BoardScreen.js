
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
import HeaderButton from '../components/HeaderButton.js';
import NormalListItem from '../components/NormalListItem.js';
import ToggleListItem from '../components/ToggleListItem.js';

import MafiaScreen from './MafiaScreen.js';

//Firebase
import firebase from '../firebase/FirebaseController.js';

class Room_Screen extends React.Component {

constructor(props) {
    super(props);

    this.state = {
        joincode: '',
        creatorname:'',
        alias:'',

        roomtype:'',
    };

    this.roomTypeRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/roomtype');

}

componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
    
    firebase.database().ref('users/' + firebase.auth().currentUser.uid).once('value',snap=>{
        if(snap.val().roomname){
            this.props.navigation.navigate('Lobby_Screen', {roomname:snap.val().roomname})
        }
    })

    this.roomTypeRef.on('value', snap => {
        this.setState({roomtype:snap.val()})
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

    firebase.database().ref('users/' + firebase.auth().currentUser.uid).update({
        roomname:roomname,
        roomtype: this.state.roomtype,
    });
    
    firebase.database().ref('rooms/' + roomname).set({
        phase: 1,
        owner: firebase.auth().currentUser.uid,
        roomtype: this.state.roomtype,
    });

    //Set up list of players
    firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
        + firebase.auth().currentUser.uid).set({
            name: this.state.creatorname,
            immune: false,
            votes: 0,
    });

    //Set up temporary list of roles
    firebase.database().ref('games/' + this.state.roomtype).once('value',snap => {
        snap.forEach((child)=>{

            firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid 
            + '/' + child.val().name).set({
                count:0,
                color: child.val().color,
                desc: child.val().desc,
                type: child.val().type,
                image: child.val().image,
            })

        })
    })
    
    this.props.navigation.navigate('Lobby_Screen', {roomname: roomname})
}

_joinRoom(joincode) {
    firebase.database().ref('rooms/' + joincode.toUpperCase()).once('value', snap => {
        if(snap.exists()){

            firebase.database().ref('users/' + firebase.auth().currentUser.uid).update({roomname:joincode});
            firebase.database().ref('rooms/' + joincode.toUpperCase() 
                + '/listofplayers/' + firebase.auth().currentUser.uid).set({
                    name: this.state.alias,
                    immune: false,
                    votes: 0,
            });        

            firebase.database().ref('users/' + firebase.auth().currentUser.uid)
                .update({
                    roomtype:snap.val().roomtype,
                })
            this.props.navigation.navigate('Lobby_Screen', { roomname: this.state.joincode});
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
                {'Selected Game: ' + this.state.roomtype}
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
                onPress={()=>{this._joinRoom(this.state.joincode)}}
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
    const roomname = params.roomname;

    this.state = {
        roomname: params.roomname,

        leftlist:dataSource,
        rightlist:dataSource,

        rolecount:0,
        playercount:0,
    };

    this.roleCount = firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid);
    this.playerCount = firebase.database().ref('rooms/' + roomname + '/listofplayers');

}

componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
    this._pullListOfPlayers();
    this._count();

}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);

    if(this.roleCount){
        this.roleCount.off();
    }
    if(this.playerCount){
        this.playerCount.off();
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
    firebase.database().ref('users/' + firebase.auth().currentUser.uid).update({roomname:null});
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/bookflag').remove();
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

_startGame(rolecount,playercount,roomname) {

    if(rolecount==playercount){
        firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid).remove();
        this.props.navigation.navigate('Mafia_Screen', { roomname:roomname })
    } else {
        alert('The number of players does not match the Game set-up.');
    }
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
            <View style = {{flex:3}}>
                <FlatList
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
            <View style = {{flex:3}}>
                <FlatList
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
                    onPress={()=> {this._startGame(this.state.rolecount,this.state.playercount,this.state.roomname)}}
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
        screen: MafiaScreen,
      },
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