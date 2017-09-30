
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
        username:'',
    };

}

componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
    
    firebase.database().ref('users/' + firebase.auth().currentUser.uid).once('value',snap=>{
        if(snap.val().roomname != null){
            this.props.navigation.navigate('Lobby_Screen', {roomname:snap.val().roomname})
        }
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

    firebase.database().ref('users/' + firebase.auth().currentUser.uid).update({roomname:roomname});
    firebase.database().ref('rooms/' + roomname).set({
        phase: 1,
        owner: firebase.auth().currentUser.uid,
    });
    firebase.database().ref('rooms/' + roomname + '/listofplayers/' + this.state.creatorname).set({
        immune: false,
        votes: 0,
    });
    this.props.navigation.navigate('Lobby_Screen', {roomname: roomname})
}

_joinRoom(joincode) {
    firebase.database().ref('rooms/' + joincode.toUpperCase()).once('value', snap => {
        if(snap.exists()){

            firebase.database().ref('users/' + firebase.auth().currentUser.uid).update({roomname:joincode});
            firebase.database().ref('rooms/' + joincode.toUpperCase() + '/listofplayers/' + this.state.username).set({
                immune: false,
                votes: 0,
            });        

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
                Active Game
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
                value={this.state.username}
                onChangeText = {(text) => {this.setState({username: text})}}
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

    this.state = {
        roomname: '',

        leftlist:dataSource,
        rightlist:dataSource,
    };

}

componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);

    const { params } = this.props.navigation.state;
    const roomname = params.roomname;
    this.setState({roomname: roomname})

    firebase.database().ref('rooms/' + roomname.toUpperCase() + '/listofplayers').on('value',snap => {
        
        var leftlist = [];
        var rightlist = [];
        var counter = 1;

        snap.forEach((child)=> {
            if((counter%2) == 1){
                leftlist.push({
                    name: child.key,
                })
            } else {
                rightlist.push({
                    name: child.key,
                })
            }
            counter++;
        })

        this.setState({leftlist:leftlist})
        this.setState({rightlist:rightlist})
    })
}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);
}

_handleBackButton() {
    return true;
}

_deleteRoom() {
    firebase.database().ref('rooms/' + this.state.roomname).remove()
    firebase.database().ref('users/' + firebase.auth().currentUser.uid).update({roomname:null})
    this.props.navigation.navigate('Room_Screen')
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
                    keyExtractor={item => item.name}
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
                    keyExtractor={item => item.name}
                />
            </View>
        </View>

        <View style = {{flex:0.2}}/>

        <View style = {{flex:1,flexDirection:'row'}}>
            <View style = {{flex:1}}/>
            <View style = {{flex:2}}>
                <ProfileButton
                    title='Start Game'
                    onPress={()=> {
                        this.props.navigation.navigate('Mafia_Screen', { roomname: this.state.roomname})
                    }}
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