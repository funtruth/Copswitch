
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
import colors from '../misc/colors.js';

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
            backgroundColor:colors.lightbackground,
        }}>
            <View style = {{flex:1}}> 
                <TouchableWithoutFeedback 
                    style = {{ flex:1,justifyContent:'center' }}
                    onPress={()=>{ this._createRoom() }}>
                    <View style = {{flex:1,backgroundColor:colors.darkbackground,
                        justifyContent:'center',alignItems:'center'}}>
                        <Text style = {{
                            fontFamily:'ConcertOne-Regular',
                            color:colors.lightfont,
                            fontSize:30,
                            justifyContent:'center'}}>Make a Room</Text>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback 
                    style = {{ flex:1,justifyContent:'center' }}
                    onPress={()=>{ this._findRoom() }}>
                    <View style = {{flex:1,backgroundColor:colors.lightbackground,
                        justifyContent:'center',alignItems:'center'}}>
                        <Text style = {{
                            fontFamily:'ConcertOne-Regular',
                            color:colors.lightfont,
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
        headerStyle: { backgroundColor: colors.headerbackground},
        titleStyle: { fontFamily:'ConcertOne-Regular' },
        headerTintColor: colors.headerfont,
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
            name: roomname, actionbtnvalue: false, presseduid: 'foo'
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
                name:       this.state.alias,
                dead:       false,
                immune:     false,
                bloody:     false,
                suspicious: false,
        });

        //Set up phases and rules
        //Set up temporary list of roles
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room/type').once('value',outsnap=>{

            firebase.database().ref(outsnap.val() + '/phases').once('value',snap=>{
                snap.forEach((child)=>{

                    firebase.database().ref('rooms/' + roomname + '/phases/' + child.key).set({
                        action:     child.val().action,
                        actionreset:child.val().actionreset,
                        color:      child.val().color,
                        continue:   child.val().continue,
                        locked:     child.val().locked,
                        lynch:      child.val().lynch,
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
            <View style = {{flex:1,backgroundColor:colors.background,
                justifyContent:'center',alignItems:'center'}}>
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',
                    color:colors.font,
                    fontSize:30}}>Who are you?
                </Text>

                <View style = {{ justifyContent: 'center', flexDirection: 'row', marginBottom:10 }}>
                    <TextInput
                        placeholder="Who are you? ..."
                        style={{
                            backgroundColor: colors.background,
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
                        borderRadius={15}
                        backgroundColor={colors.button}
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
        headerStyle: { backgroundColor: colors.headerbackground},
        titleStyle: { fontFamily:'ConcertOne-Regular' },
        headerTintColor: colors.headerfont,
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
                        name:       this.state.alias,
                        dead:       false,
                        immune:     false,
                        bloody:     false,
                        suspicious: false,
                });   

                firebase.database().ref('rooms/' + joincode + '/playernum').transaction((playernum) => {
                    return playernum + 1;
                });       
                
                firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
                .update({ name:joincode, presseduid: 'foo', actionbtnvalue:false })

                //this.props.navigation.navigate('Lobby_Screen', { roomname: joincode});
                this.props.navigation.dispatch(
                    NavigationActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({ routeName: 'Lobby_Screen', params:{roomname:joincode}})
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
            <View style = {{flex:1,backgroundColor:colors.background,
                justifyContent:'center',alignItems:'center'}}>
                
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',
                    color:colors.font,
                    fontSize:30}}>Join Room
                </Text>


                <View style = {{ justifyContent: 'center', flexDirection: 'row' }}>
                    <TextInput
                        placeholder="Who are you? ..."
                        style={{
                            backgroundColor: colors.background,
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
                            backgroundColor: colors.background,
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
                            backgroundColor={colors.button}
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
            listview: false,

            namelist:dataSource,
            rolelist: dataSource,

            rolecount:0,
            playercount:0,

            amiowner:false,
        };

        this.roleCount = firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid)
            .orderByChild('roleid');
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
            var list = [];
            snap.forEach((child)=>{
                rolecount = rolecount + child.val().count;
                list.push({
                    name: child.key,
                    count: child.val().count,
                    color: child.val().color,
                    key: child.val().roleid,
                })
            })
            this.setState({rolecount:rolecount, rolelist:list})
        });

        //Player Count
        this.playerCount.on('value',snap=>{
            this.setState({playercount:snap.numChildren()})
        });
    }

    _recommendedBtnPress(mode,playercount){
        this.roleCount.remove();

        firebase.database().ref('Original/recommended/' + playercount + '/' + mode).once('value',snap=>{
            snap.forEach((child)=>{
                this.roleCount.child(child.key).update({
                    color:child.val().color,
                    count:child.val().count,
                    roleid:child.val().roleid})
            })
        })
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

    _renderListComponent(){
        if(this.state.listview){
            return <FlatList
                data={this.state.namelist}
                renderItem={({item}) => (
                    <TouchableOpacity 
                        onPress={() => { }}
                        style = {{height:40,
                            borderRadius:5,
                            backgroundColor: colors.button,
                            margin: 3,
                            justifyContent:'center'
                    }}> 
                        <Text style = {styles.concerto}>{item.name}</Text>
                    </TouchableOpacity>

                )}
                keyExtractor={item => item.key}
            />
        } else {
            return <FlatList
                data={this.state.rolelist}
                renderItem={({item}) => (
                    <TouchableOpacity 
                        onPress={() => {
                            firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid 
                                + '/' + item.name + '/count').transaction((count)=>{
                                    if(count > 1){
                                        return count - 1;
                                    } else {
                                        firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid 
                                        + '/' + item.name).remove();
                                    }
                                })
                        }}
                        style = {{height:40,
                            borderRadius:5,
                            backgroundColor: item.color,
                            margin: 3,
                            justifyContent:'center'
                    }}> 
                        <Text style = {styles.concerto}>{item.name + ' x' + item.count}</Text>
                    </TouchableOpacity>

                )}
                keyExtractor={item => item.key}
            />
        }
    }

    render() {
        return <View style = {{
            backgroundColor: colors.background,
            flex: 1,
        }}>
            <View style = {{flex:1,flexDirection:'row'}}>
                <View style = {{flex:1}}/>
                <View style = {{
                    flex:4, 
                    borderBottomLeftRadius: 15, borderBottomRightRadius: 15, 
                    backgroundColor: colors.button, justifyContent: 'center', }}
                > 
                    <Text style = {{color:colors.lightfont, alignSelf:'center',
                        fontFamily:'ConcertOne-Regular', fontSize:25}}>
                        {'Room Name: ' + this.state.roomname}
                    </Text>
                </View>
                <View style = {{flex:1, justifyContent:'center'}}>
                    <TouchableOpacity
                        onPress={()=> {
                            this.state.amiowner?this._deleteRoom():this._leaveRoom(this.state.roomname);
                        }}>
                        <MaterialCommunityIcons name={this.state.amiowner?'close-circle':'close-circle'}
                                    style={{color:colors.button, fontSize:26,alignSelf:'center'}}/>
                    </TouchableOpacity>
                </View>
            </View>

            <View style = {{flex:0.15}}/>

            <View style = {{flex:0.85,flexDirection:'row', justifyContent:'center'}}>
                <TouchableOpacity
                    style = {{
                        flex: 0.6,
                        backgroundColor:colors.button,
                        borderRadius: 15,
                        justifyContent:'center',
                    }}
                    onPress = {()=>{
                        if(this.state.listview){
                            this.setState({listview:false})
                        } else {
                            this.setState({listview:true})
                        }
                    }}
                >
                    <Text style = {styles.concerto}>
                        {this.state.listview?'Game Set-up':'Players: ' + this.state.playercount}</Text>
                </TouchableOpacity>
            </View>

            <View style = {{flex:0.15}}/>

            <View style = {{flex:8.65, flexDirection:'row',justifyContent:'center'}}>
                <View style = {{flex:0.85}}>
                    {this._renderListComponent()}
                </View>
            </View>
            
            <View style = {{flex:0.15}}/>

            <View style = {{flex:1,flexDirection:'row',justifyContent:'center'}}>
                <View style = {{flex:0.66,justifyContent:'center',backgroundColor:colors.button,borderRadius:15}}>
                    <TouchableOpacity
                        onPress={()=> {
                            this._startGame(this.state.rolecount,this.state.playercount,this.state.roomname)
                        }}
                        disabled={!this.state.amiowner}>
                        <Text style = {styles.concerto}>START GAME</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style = {{flex:0.15}}/>

            <View style = {{flex:1.5,justifyContent:'center',alignItems:'center'}}>
                <Text style = {{fontFamily:'ConcertOne-Regular', fontSize:23, color:colors.button, flex:1}}>
                    Recommended Set-Up</Text>
                <View style = {{flex:1,flexDirection:'row'}}>
                    <TouchableOpacity
                        style = {{
                            backgroundColor:colors.button, borderBottomLeftRadius: 10, borderTopLeftRadius: 10,
                            justifyContent:'center', alignItems:'center', flex:0.3
                        }}
                        onPress = {()=>{this._recommendedBtnPress('easy',this.state.playercount)}}
                    >
                        <Text style = {{color:'white',fontFamily:'ConcertOne-Regular',fontSize:15}}>
                            Easy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {{
                            backgroundColor:colors.button, flex:0.3, 
                            justifyContent:'center', alignItems:'center'
                        }}
                        onPress = {()=>{this._recommendedBtnPress('medium',this.state.playercount)}}
                    >
                        <Text style = {{color:'white',fontFamily:'ConcertOne-Regular',fontSize:15}}>
                            Normal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {{
                            backgroundColor:colors.button, borderBottomRightRadius: 10, borderTopRightRadius: 10,
                            justifyContent:'center', alignItems:'center', flex:0.3
                        }}
                        onPress = {()=>{this._recommendedBtnPress('hard',this.state.playercount)}}
                    >
                        <Text style = {{color:'white',fontFamily:'ConcertOne-Regular',fontSize:15}}>
                            Difficult</Text>
                    </TouchableOpacity>
                </View>
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
            } else {
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
        color:colors.lightfont,
        alignSelf: 'center',
    },

});