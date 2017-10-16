
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import randomize from 'randomatic';

import { Button, List } from "react-native-elements";
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
                    bloody:false,
                    suspicious:false,
            });   

            firebase.database().ref('rooms/' + joincode.toUpperCase() + '/playernum').transaction((playernum) => {
                return (playernum + 1);
            });       
            
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

        amiowner:false,
    };

    this.roleCount = firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid);
    this.playerCount = firebase.database().ref('rooms/' + roomname + '/listofplayers');
    this.gameStart = firebase.database().ref('rooms/' + roomname + '/phase');
    this.ownerListener = firebase.database().ref('rooms/' + roomname + '/owner');

}

componentWillMount() {
    
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
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
    if(this.ownerListener){
        this.ownerListener.off();
    }
}

_pullListOfPlayers() {
    firebase.database().ref('rooms/' + this.state.roomname.toUpperCase() 
        + '/listofplayers').on('value',snap => {
        
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

_handleBackButton() {
    return true;
}

_deleteRoom() {
    firebase.database().ref('rooms/' + this.state.roomname).remove();
    firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid).remove();
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room').update({name:null});
    this.props.navigation.navigate('Room_Screen');
}

_leaveRoom(roomname) {
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room').update({name:null});
    firebase.database().ref('rooms/' + roomname.toUpperCase() + '/playernum').transaction((playernum) => {
        return (playernum - 1);
    });  
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
        this.setState({playercount:snap.numChildren()})
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
                <Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>
                    Lobby
                </Text>
                <Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>
                    {this.state.roomname}
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
                            onPress={() => {alert('dumb')}}
                            style = {{height:40,
                                flex:0.5,
                                borderRadius:5,
                                backgroundColor: 'black',
                                margin: 3,
                                justifyContent:'center'
                        }}> 
                            <Text style = {{color:'white', alignSelf: 'center'}}>{item.name}</Text>
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
                        
                    }}>
                    <MaterialCommunityIcons name='cursor-pointer'
                                style={{color:'white', fontSize:26,alignSelf:'center'}}/>
                </TouchableOpacity>
            </View>
            <View style = {{flex:0.36,justifyContent:'center',backgroundColor:'black'}}>
                <TouchableOpacity
                    onPress={()=> {
                        
                    }}>
                    <MaterialCommunityIcons name='dice-5'
                                style={{color:'white', fontSize:26,alignSelf:'center'}}/>
                </TouchableOpacity>
            </View>
            <View style = {{flex:0.36,justifyContent:'center',backgroundColor:'black'}}>
                <TouchableOpacity
                    onPress={()=> {
                        this._startGame(this.state.rolecount,this.state.playercount,
                            this.state.roomname);
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