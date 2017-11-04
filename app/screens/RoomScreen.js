
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
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import randomize from 'randomatic';

import { Button } from "react-native-elements";

import { isInGame } from "../auth";
import { isInRoom } from "../auth";
import colors from '../misc/colors.js';

import Mafia_Screen from './MafiaScreen.js';

//Firebase
import firebase from '../firebase/FirebaseController.js';

class Room_Screen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    _createRoom() {
        this.props.navigation.navigate('Create_Screen');
    }

    _findRoom() {
        this.props.navigation.navigate('Join_Screen');
    }

    render() {
        return <View style = {{ flex:1, backgroundColor:colors.background, }}>
            <TouchableWithoutFeedback 
                style = {{ flex:1,justifyContent:'center' }}
                onPress={()=>{ this._createRoom() }}>
                <View style = {{flex:1,backgroundColor:colors.main,
                    justifyContent:'center',alignItems:'center'}}>
                    <Text style = {{
                        fontFamily:'ConcertOne-Regular',
                        color:colors.font,
                        fontSize:30,
                        justifyContent:'center'}}>Make a Room</Text>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback 
                style = {{ flex:1,justifyContent:'center' }}
                onPress={()=>{ this._findRoom() }}>
                <View style = {{flex:1,backgroundColor:colors.color2,
                    justifyContent:'center',alignItems:'center'}}>
                    <Text style = {{
                        fontFamily:'ConcertOne-Regular',
                        color:colors.font,
                        fontSize:30,
                        justifyContent:'center'}}>Join a Room</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    }
}

class Create_Screen extends React.Component {
    
    static navigationOptions = {
        headerTitle: <Text style = {{fontSize:20,
            fontFamily: 'ConcertOne-Regular',
            color:colors.font,
            marginLeft:15}}>Make a Room</Text>,
        headerStyle: { backgroundColor: colors.headerbackground},
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
        AsyncStorage.setItem('OWNER-KEY', roomname);
        
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
                dead:               false,
                immune:             false,
                bloody:             false,
        });
        
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
            <View style = {{flex:1,backgroundColor:colors.color2,
                justifyContent:'center',alignItems:'center'}}>

                <View style = {{ justifyContent: 'center', flexDirection: 'row', marginBottom:10 }}>
                    <TextInput
                        placeholder="Who are you? ..."
                        placeholderTextColor={colors.main}
                        style={{
                            backgroundColor: colors.color2,
                            flex:0.6,
                            fontFamily:'ConcertOne-Regular',
                            fontSize: 20,
                            color:colors.font,
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
                        title="Create Room"
                        fontFamily='ConcertOne-Regular'
                        fontSize={20}
                        color={colors.font}
                        borderRadius={15}
                        backgroundColor={colors.main}
                        onPress={()=>{
                            if(this._validName(this.state.alias)){
                                this._createRoom()
                            }
                        }}
                    /></View>
                </View>

                {/*Make-shift Keyboard Avoiding View*/}
                <View style = {{flex:0.3}}/> 
            </View>
        </TouchableWithoutFeedback>
    }
}

class Join_Screen extends React.Component {

    static navigationOptions = {
        headerTitle: <Text style = {{
            fontSize:20,
            fontFamily: 'ConcertOne-Regular',
            color:colors.font,
            marginLeft:15}}>Join a Room</Text>,
        headerStyle: { backgroundColor: colors.headerbackground},
        headerTintColor: colors.headerfont,
    };

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
                dead:               false,
                immune:             false,
                bloody:             false,
                suspicious:         false,
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
            <View style = {{flex:1,backgroundColor:colors.color2,
                justifyContent:'center',alignItems:'center'}}>

                <View style = {{ justifyContent: 'center', flexDirection: 'row' }}>
                    <TextInput
                        placeholder="Who are you? ..."
                        placeholderTextColor={colors.main}
                        style={{
                            backgroundColor: colors.color2,
                            flex:0.6,
                            fontFamily:'ConcertOne-Regular',
                            fontSize: 20,
                            color:colors.font,
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
                        placeholderTextColor={colors.main}
                        style={{
                            backgroundColor: colors.color2,
                            flex:0.6,
                            fontFamily:'ConcertOne-Regular',
                            fontSize: 20,
                            color:colors.font,
                        }}
                        value={this.state.roomname}
                        autoCapitalize='characters'
                        blurOnSubmit={false}
                        onChangeText = {(text) => {this.setState({roomname: text})}}
                        onSubmitEditing = {()=>{Keyboard.dismiss()}}
                    />
                </View>

                <View style = {{ margin: 5, justifyContent: 'center', alignItems:'center', flexDirection: 'row' }}>
                        <View style = {{flex:0.75}}>
                        <Button
                            title="Join Room"
                            fontFamily='ConcertOne-Regular'
                            fontSize={20}
                            color={colors.font}
                            borderRadius={15}
                            backgroundColor={colors.main}
                            onPress={()=>{
                                this._valid(this.state.alias,this.state.roomname.toUpperCase())
                            }}
                        /></View>
                </View>

                {/*Makeshift Keyboard Avoiding View*/}
                <View style = {{flex:0.4}}/>
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
        const { params }    = this.props.navigation.state;
        const roomname      = params.roomname.toUpperCase();

        this.state = {
            roomname:       params.roomname.toUpperCase(),
            listview:       true,
            xdisabled:      true,
            namelist:       dataSource,
            rolelist:       dataSource,
            rolecount:      0,
            playercount:    0,
            amiowner:       false,
            
            loading:        false,
        };

        this.roleCount      = firebase.database().ref('listofroles/' + roomname).orderByChild('roleid');
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
        AsyncStorage.removeItem('OWNER-KEY');

        firebase.database().ref('rooms/' + this.state.roomname).remove();
        firebase.database().ref('listofroles/' + this.state.roomname).remove();
        
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

    _enableCloseBtn() {
        this.setState({xdisabled:false});
        this.timer = setTimeout(() => {this.setState({xdisabled: true})}, 2000);
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
            AsyncStorage.removeItem('OWNER-KEY');

            this._handOutRoles(roomname);

            firebase.database().ref('listofroles/' + roomname).remove();

            this.setState({loading:true})

            setTimeout(()=>{
                this.roomRef.child('phase').set(2)

                this.props.navigation.dispatch(
                    NavigationActions.reset({
                        index: 0,
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

        firebase.database().ref('listofroles/' + roomname).once('value',snap=>{

            snap.forEach((child)=>{
                for(i=0;i<child.val().count;i++){
                    randomstring = randomstring + randomize('?', 1, {chars: child.val().roleid})
                    charcount++
                }
            })

            var min = Math.ceil(1);
            var max = Math.ceil(charcount);

            firebase.database().ref('rooms/' + roomname + '/listofplayers').once('value',insidesnap=>{
                insidesnap.forEach((child)=>{

                    var randomnumber = Math.floor(Math.random() * (max - min + 1)) + min;
                    var randomrole = randomstring.charAt(randomnumber-1);

                    firebase.database().ref('roles/'+randomrole)
                    .once('value',suspicious=>{
                        firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
                        + child.key).update({
                            roleid: randomrole,
                            type: suspicious.val().type,
                            suspicious:suspicious.val().suspicious,
                        })
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
        if(this.state.listview){
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
                            flex:0.5,
                            flexDirection:'row',
                        }}
                    > 
                        <MaterialCommunityIcons name={item.owner?'crown':null}
                            style={{color:'white', fontSize:20}}/>
                        <Text style = {styles.concerto}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                numColumns={2}
                keyExtractor={item => item.key}
            />
        } else {
            return <FlatList
                data={this.state.rolelist}
                renderItem={({item}) => (
                    <TouchableOpacity 
                        onPress={() => {
                            {this.state.amiowner?
                                firebase.database().ref('listofroles/' + this.state.roomname 
                                + '/' + item.name + '/count').transaction((count)=>{
                                    if(count > 1){
                                        return count - 1;
                                    } else {
                                        firebase.database().ref('listofroles/' 
                                        + this.state.roomname + '/' + item.name).remove();
                                    }
                                })
                            :{}}
                        }}
                        style = {{height:40,
                            borderRadius:5,
                            backgroundColor: item.color,
                            margin: 3,
                            justifyContent:'center',
                            flex:0.5
                        }}
                    >
                        <Text style = {styles.concerto}>{item.name + ' x' + item.count}</Text>
                    </TouchableOpacity>
                )}
                numColumns={2}
                keyExtractor={item => item.key}
            />
        }
    }

    _renderBottomComponent() {
        if(this.state.listview){
            return <View style = {{flex:0.7,justifyContent:'center', alignItems:'center',
                backgroundColor:this.state.amiowner?colors.main:colors.disabled,borderRadius:15}}>
            <TouchableOpacity
                onPress={()=> {
                    this._startGame(this.state.rolecount,this.state.playercount,this.state.roomname)
                }}
                disabled={!this.state.amiowner}
                style = {{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text style = {styles.concerto}>START GAME</Text>
            </TouchableOpacity>
        </View>
        } else {
            return <View style = {{flex:0.7,justifyContent:'center',alignItems:'center'}}>
                <View style = {{flex:1,flexDirection:'row',
                    backgroundColor:this.state.amiowner?colors.main:colors.disabled,borderRadius:15}}>
                    <TouchableOpacity
                        style = {{
                            justifyContent:'center', alignItems:'center', flex:1
                        }}
                        onPress = {()=>{this._recommendedBtnPress('easy',this.state.playercount)}}
                    >
                        <Text style = {{color:colors.font,fontFamily:'ConcertOne-Regular',fontSize:15}}>
                            Easy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {{
                            flex:1, justifyContent:'center', alignItems:'center'
                        }}
                        onPress = {()=>{this._recommendedBtnPress('medium',this.state.playercount)}}
                    >
                        <Text style = {{color:colors.font,fontFamily:'ConcertOne-Regular',fontSize:15}}>
                            Normal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {{
                            justifyContent:'center', alignItems:'center', flex:1
                        }}
                        onPress = {()=>{this._recommendedBtnPress('hard',this.state.playercount)}}
                    >
                        <Text style = {{color:colors.font,fontFamily:'ConcertOne-Regular',fontSize:15}}>
                            Difficult</Text>
                    </TouchableOpacity>
                </View>
            </View>
        }
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
            <View style = {{flex:1,flexDirection:'row'}}>
                <View style = {{flex:1}}/>
                <View style = {{
                    flex:4, 
                    borderBottomLeftRadius: 15, borderBottomRightRadius: 15, 
                    backgroundColor: colors.main, justifyContent: 'center', }}
                > 
                    <Text style = {{color:colors.font, alignSelf:'center',
                        fontFamily:'ConcertOne-Regular', fontSize:25}}>
                        {'Room Name: ' + this.state.roomname}
                    </Text>
                </View>
                <View style = {{flex:1, justifyContent:'center'}}>
                    <TouchableOpacity
                        onPress={()=> {
                            this.state.xdisabled?
                            this._enableCloseBtn():        
                            this.state.amiowner?this._deleteRoom():this._leaveRoom(this.state.roomname);
                        }}>
                        <MaterialCommunityIcons name='close-circle'
                            style={{color:this.state.xdisabled?colors.main:colors.highlight, 
                                fontSize:26,alignSelf:'center'}}/>
                    </TouchableOpacity>
                </View>
            </View>

            <View style = {{flex:0.15}}/>

            <View style = {{flex:0.85,flexDirection:'row', justifyContent:'center'}}>
                <TouchableOpacity
                    style = {{
                        flex: 0.6,
                        backgroundColor:colors.main,
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
                        {this.state.listview?
                            'View Role Selection':' View Players: ' + this.state.playercount}</Text>
                </TouchableOpacity>
            </View>

            <View style = {{flex:0.15}}/>

            <View style = {{flex:10.3, flexDirection:'row',justifyContent:'center'}}>
                <View style = {{flex:0.85,justifyContent:'center'}}>
                    {this._renderListComponent()}
                </View>
            </View>
            
            <View style = {{flex:0.15}}/>

            <View style = {{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                {this._renderBottomComponent()}
            </View>

            <View style = {{flex:0.15}}/>

        </View>
    }
}

class Expired_Screen extends React.Component {
    
    static navigationOptions = {
        header: null
    };

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