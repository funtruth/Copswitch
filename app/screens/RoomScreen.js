
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    Text,
    StyleSheet,
    TextInput,
    Keyboard,
    FlatList,
    ListView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Modal
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import randomize from 'randomatic';

import { Button } from "react-native-elements";
import { MenuButton } from '../components/MenuButton.js';

import { isInGame } from "../auth";
import { isInRoom } from "../auth";
import FadeInView from '../components/FadeInView.js';
import colors from '../misc/colors.js';
import Rolesheet from '../misc/roles.json';

import Mafia_Screen from './MafiaScreen.js';

//Firebase
import firebase from '../firebase/FirebaseController.js';

class Room_Screen extends React.Component {

    constructor(props) {
        super(props);
    }

    _logOut() {
        if(firebase.auth().currentUser.isAnonymous){
            onSignOut().then(() => { firebase.auth().currentUser.delete() })
            this.props.navigation.navigate('SignedOut');
        } else {
            onSignOut().then(() => { firebase.auth().signOut() }) 
            this.props.navigation.navigate('SignedOut');
        }
    }

    render() {
        return <View style = {{ flex:1, backgroundColor:colors.background }}>

            <View style = {{flex:0.74}}/>
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Make Room'
                onPress = {()=>{ this.props.navigation.navigate('Create_Screen') }}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Join Room'
                onPress = {()=>{ this.props.navigation.navigate('Join_Screen') }}
            />
            <View style = {{flex:0.02}}/>
        </View>
    }
}

class Create_Screen extends React.Component {

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
        
        firebase.database().ref('rooms/' + roomname).set({
            phase: 1,
            owner: firebase.auth().currentUser.uid,
            playernum: 1,
            daycounter:1,
        });

        //Set up list of players
        firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
            + firebase.auth().currentUser.uid).set({
                name:               this.state.alias,
                actionbtnvalue:     false,
                presseduid:         'foo',
        });
        
        firebase.database().ref('listofroles/'+firebase.auth().currentUser.uid).update({b:0})

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

    _validName(name) {
        if(name.length>0 && name.length < 11){
            return true
        } else {
            alert('Name is not a valid length (10 characters or less)')
            return false
        }
    }

    render() {
        return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ Keyboard.dismiss() }}>
            <View style = {{flex:1,backgroundColor:colors.background}}>

                <TouchableOpacity
                    style = {{flexDirection:'row',flex:0.2,
                        justifyContent:'center',alignItems:'center'}}
                    onPress = {()=>{
                        this.props.navigation.goBack();
                    }}
                >
                    <MaterialCommunityIcons name='home'
                        style={{color:colors.main,fontSize:40,alignSelf:'center'}}/>
                </TouchableOpacity>

                <View style = {{flex:0.2}}/>

                <View style = {{ justifyContent: 'center', flexDirection: 'row', flex:0.1}}>
                    <TextInput
                        placeholder="Who are you?"
                        placeholderTextColor={colors.main}
                        style={{
                            backgroundColor: colors.background,
                            flex:0.6,
                            fontFamily:'ConcertOne-Regular',
                            fontSize: 20,
                            color:colors.font,
                            textAlign:'center',
                        }}
                        value={this.state.alias}
                        onChangeText = {(text) => {this.setState({alias: text})}}
                        autoFocus={true}
                        onSubmitEditing = {()=>{Keyboard.dismiss()}}
                    />
                </View>

                <MenuButton
                    title="Create Room"
                    flex = {0.75}
                    fontSize={20}
                    onPress={()=>{
                        if(this._validName(this.state.alias)){
                            this._createRoom()
                        }
                    }}
                />

            </View>
        </TouchableWithoutFeedback>
    }
}

class Join_Screen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            roomname: '',
            alias:'',
        };
    }

    _valid(name,roomname) {
        if(name.length > 0 && name.length < 11){
            if(roomname.length == 4){
                firebase.database().ref('rooms/' + roomname + '/listofplayers')
                .orderByChild('name').equalTo(name).once('value',snap=>{
                    if(snap.exists()){
                        alert('Name is already taken.')
                    } else {
                        firebase.database().ref('rooms/' + roomname).once('value', snap => {
                            if(snap.exists() && (snap.val().phase == 1)){
                                this._joinRoom(roomname)
                            } else if (snap.exists() && (snap.val().phase > 1)) {
                                alert('Game has already started.')
                            } else {
                                alert('Room does not Exist.')
                            }
                        })
                    }
                })
            } else {
                alert('Room name must be 4 characters in length.')
            }
        } else {
            alert('Name is not a valid length (10 characters or less).')
        }
    }

    _joinRoom(roomname) {
        AsyncStorage.setItem('ROOM-KEY', roomname);

        firebase.database().ref('rooms/' + roomname 
            + '/listofplayers/' + firebase.auth().currentUser.uid).update({
                name:               this.state.alias,
                actionbtnvalue:     false,
                presseduid:         'foo',
        });   

        firebase.database().ref('rooms/' + roomname + '/playernum').transaction((playernum) => {
            return playernum + 1;
        });       
        
        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Lobby_Screen', params:{roomname:roomname}})
                ]
            })
        )
    }

    render() {
        return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ Keyboard.dismiss() }}>
            <View style = {{flex:1,backgroundColor:colors.background}}>

                <TouchableOpacity
                    style = {{flexDirection:'row',flex:0.2,
                        justifyContent:'center',alignItems:'center'}}
                    onPress = {()=>{
                        this.props.navigation.goBack();
                    }}
                >
                    <MaterialCommunityIcons name='home'
                        style={{color:colors.main,fontSize:40,alignSelf:'center'}}/>
                </TouchableOpacity>

                <View style = {{flex:0.1}}/>

                <View style = {{ justifyContent: 'center', flexDirection: 'row', flex:0.1 }}>
                    <TextInput
                        placeholder="Who are you?"
                        placeholderTextColor={colors.main}
                        style={{
                            backgroundColor: colors.background,
                            flex:0.6,
                            fontFamily:'ConcertOne-Regular',
                            fontSize: 20,
                            color:colors.font,
                            textAlign:'center',
                        }}
                        value={this.state.alias}
                        autoFocus = {true}
                        blurOnSubmit={false}
                        onChangeText = {(text) => {this.setState({alias: text})}}
                        onSubmitEditing = {()=>this.refs['roomcode'].focus()}
                    />
                </View>
                <View style = {{ justifyContent: 'center', flexDirection: 'row', flex:0.1 }}>
                    <TextInput
                        ref='roomcode'
                        placeholder="Room Code"
                        placeholderTextColor={colors.main}
                        style={{
                            backgroundColor: colors.background,
                            flex:0.6,
                            fontFamily:'ConcertOne-Regular',
                            fontSize: 20,
                            color:colors.font,
                            textAlign:'center',
                        }}
                        value={this.state.roomname}
                        autoCapitalize='characters'
                        blurOnSubmit={false}
                        onChangeText = {(text) => {this.setState({roomname: text})}}
                        onSubmitEditing = {()=>{Keyboard.dismiss()}}
                    />
                </View>

                <MenuButton 
                    title="Join Room"
                    flex = {0.75}
                    fontSize={20}
                    onPress={()=>{
                        this._valid(this.state.alias,this.state.roomname.toUpperCase())
                    }}
                />

                <View style = {{flex:0.5}}/>
            </View>


        </TouchableWithoutFeedback>
    }
}

class Lobby_Screen extends React.Component {

    constructor(props) {
        super(props);

        //Navigation parameters
        const { params }    = this.props.navigation.state;
        const roomname      = params.roomname.toUpperCase();

        this.state = {
            roomname:       params.roomname.toUpperCase(),
            xdisabled:      true,
            namelist:       [],
            rolecount:      0,
            playercount:    0,
            amiowner:       false,
            
            loading:        false,
        };

        this.roleCount      = firebase.database().ref('listofroles/' 
                              + firebase.auth().currentUser.uid);
        this.roomRef        = firebase.database().ref('rooms/' + roomname);
        this.listRef        = this.roomRef.child('listofplayers');
    }

    componentWillMount() {

        this.roomRef.on('value',roomsnap=>{

            this.listRef.once('value',snap => {
                var list = [];
                snap.forEach((child)=> {
                    list.push({
                        name: child.val().name,
                        owner: roomsnap.val().owner == child.key,
                        key: child.key,
                    })
                })
                this.setState({namelist:list,playercount:snap.numChildren()})
            })

            if(roomsnap.val().phase > 1 ){
                AsyncStorage.setItem('GAME-KEY',this.state.roomname);

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

            if(roomsnap.val().owner == firebase.auth().currentUser.uid){
                this.setState({amiowner:true})
            } else {
                this.setState({amiowner:false})
            }

        })

        
        //List of Roles information
        this.roleCount.on('value',snap=>{
            if(snap.exists()){
                var rolecount = 0;
                snap.forEach((child)=>{
                    rolecount = rolecount + child.val();
                })
                this.setState({rolecount:rolecount})
            }
        });
    }

    componentWillUnmount() {

        if(this.roomRef){
            this.roomRef.off();
        }
        if(this.roleCount){
            this.roleCount.off();
        }
        clearTimeout(this.timer);
    }

    _deleteRoom() {
        AsyncStorage.removeItem('ROOM-KEY');

        firebase.database().ref('rooms/' + this.state.roomname).remove();
        firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid).remove();
        
        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Room_Screen'})
                ]
            })
        )
    }

    _leaveRoom() {

        AsyncStorage.removeItem('ROOM-KEY');

        firebase.database().ref('rooms/'+this.state.roomname+'/playernum').transaction((playernum) => {
            return (playernum - 1);
        });
        this.listRef.child(firebase.auth().currentUser.uid).remove();
        
        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 0,
                actions: [
                NavigationActions.navigate({ routeName: 'Room_Screen'})
                ]
            })
        )
    }

    _recommendedBtnPress(mode,playercount){
        this.roleCount.remove();

        firebase.database().ref('recommended/' + playercount + '/' + mode).once('value',snap=>{
            snap.forEach((child)=>{
                this.roleCount.child(child.key).update(child.val())
            })
        })
    }

    _startGame(rolecount,playercount,roomname) {

        if(rolecount==playercount){

            AsyncStorage.setItem('GAME-KEY',roomname);

            this._handOutRoles(roomname);

            firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid).remove();

            this.setState({loading:true})

            setTimeout(()=>{
                this.roomRef.child('phase').set(2)

                this.props.navigation.dispatch(
                    NavigationActions.reset({
                        index: 0,
                        key: null,
                        actions: [
                        NavigationActions.navigate({ routeName: 'Mafia_Screen',
                            params:{roomname:this.state.roomname}})
                        ]
                    })
                )
            },5000)
                
        } else {
            alert('The number of players does not match the Game set-up.');
        }
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

            this.listRef.once('value',insidesnap=>{
                insidesnap.forEach((child)=>{

                    var randomnumber = Math.floor(Math.random() * (max - min + 1)) + min;
                    var randomrole = randomstring.charAt(randomnumber-1);

                    this.listRef.child(child.key).update({
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
                    style = {{height:40,
                        borderRadius:5,
                        backgroundColor: colors.main,
                        margin: 3,
                        justifyContent:'center',
                        alignItems:'center',
                        flexDirection:'row',
                    }}
                > 
                    <MaterialCommunityIcons name={item.owner?'crown':null}
                        style={{color:'white', fontSize:20}}/>
                    <Text style = {styles.concerto}>{item.name}</Text>
                </TouchableOpacity>
            )}
            numColumns={1}
            keyExtractor={item => item.key}
        />
        
    }

    _renderBottomComponent() {
        return <View style = {{flex:0.24}}>
            <MenuButton
                viewFlex = {0.5}
                flex = {0.9}
                fontSize = {20}
                title = 'Start Game'
                onPress = {()=>{
                    this._startGame(this.state.rolecount,this.state.playercount,this.state.roomname)
                }}
            />
            <MenuButton
                viewFlex = {0.5}
                flex = {0.9}
                fontSize = {20}
                title = {this.state.amiowner?'Delete Room':'Leave Room'}
                onPress = {()=>{
                    this.state.amiowner?this._deleteRoom():this._leaveRoom();
                }}
            /></View>
    }

    render() {

        if(this.state.loading){
            return <View style = {{
                backgroundColor: colors.background,
                flex: 1,
                justifyContent:'center'}}>
                    <ActivityIndicator size='large' color={colors.main}/>
                    <Text style = {{fontSize:23,
                    fontFamily:'ConcertOne-Regular',
                    color:colors.main,
                    alignSelf: 'center',
                    marginTop: 10
                    }}>Setting up Game</Text>
                </View>
        }

        return <View style = {{
            backgroundColor: colors.background,
            flex: 1,
        }}>
            <View style = {{flex:0.15,flexDirection:'row', justifyContent:'center'}}>
                <View style = {{
                    flex:0.9, 
                    borderBottomLeftRadius: 15, borderBottomRightRadius: 15, 
                    backgroundColor: colors.main, justifyContent: 'center', }}
                > 
                    <Text style = {{color:colors.font, alignSelf:'center',
                        fontFamily:'ConcertOne-Regular', fontSize:18}}>
                        Room Code
                    </Text>
                    <Text style = {{color:colors.font, alignSelf:'center',
                        fontFamily:'ConcertOne-Regular', fontSize:25}}>
                        {this.state.roomname}
                    </Text>
                </View>
            </View>

            <View style = {{flex:0.01}}/>

            <View style = {{flex:0.77, flexDirection:'row',justifyContent:'center'}}>
                <View style = {{flex:0.9,justifyContent:'center'}}>
                    {this._renderListComponent()}
                </View>
            </View>
            
            <View style = {{flex:0.01}}/>

            {this._renderBottomComponent()}

            <View style = {{flex:0.04}}/>

        </View>
    }
}

class Expired_Screen extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    _resetGame(){
        AsyncStorage.removeItem('ROOM-KEY');
        AsyncStorage.removeItem('GAME-KEY');
    
        firebase.database().ref('messages/' + firebase.auth().currentUser.uid).remove();
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
            .update({ name: null });

        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: 'Room_Screen'})
                ]
            })
        )
    }
    
    _renderHeader() {
        return <Text style = {{fontFamily:'ConcertOne-Regular',fontSize:25,color:colors.font}}>
        Your game expired</Text>
    }
    
    _renderImage() {
        return <Text style = {{fontFamily:'ConcertOne-Regular',fontSize:25,color:colors.font}}>
        awww poor baby</Text>
    }
    
    render() {
        return <View style = {{flex:3,backgroundColor:colors.color2}}>
            <View style = {{flex:1,justifyContent:'center'}}>
                <View style = {{flex:0.7,justifyContent:'center',alignItems:'center'}}>
                    {this._renderHeader()}
                </View>
            </View>
            <View style = {{flex:5,justifyContent:'center'}}>
                <View style = {{flex:0.7,justifyContent:'center',alignItems:'center'}}>
                    {this._renderImage()}
                </View>
            </View>
            <View style = {{flex:1,justifyContent:'center',flexDirection:'row'}}>
                <TouchableOpacity
                    onPress={()=>{this._resetGame()}}
                    style={{
                        flex:0.7,
                        justifyContent:'center',
                        backgroundColor:colors.main,
                        borderRadius:15,
                    }}
                ><Text style = {{alignSelf:'center',color:'white',
                    fontFamily:'ConcertOne-Regular',fontSize:25}}>CONTINUE</Text>
                </TouchableOpacity>
            </View>
            <View style = {{flex:1}}/>
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
            } else {
                this.setState({checkedExpired:true})
            }
        })
        
    }

    render(){
        const { checkedInGame, inGame, checkedInRoom, inRoom,
            checkedExpired, isExpired, roomname } = this.state;
        
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
        },
            {
                headerMode: 'none',
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
    actionButtonItem: {
        fontSize: 20,
        height: 22,
        color: colors.font,
    },
    concerto: {
        fontSize:17,
        fontFamily:'ConcertOne-Regular',
        color:colors.font,
        alignSelf: 'center',
    },
    headerStyle: {
        fontSize:20,
        fontFamily: 'ConcertOne-Regular',
        color:colors.font,
    },

});