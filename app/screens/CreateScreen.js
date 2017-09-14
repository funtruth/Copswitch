
import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    Image,
    Platform,
    StatusBar,
    BackHandler,
    AsyncStorage,
    TextInput,
    StyleSheet,
    Keyboard,
    ListView,
    FlatList
}   from 'react-native';
import { Card, FormInput, List, ListItem } from "react-native-elements";
import ModalPicker from 'react-native-modal-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import firebase from '../firebase/FirebaseController.js';

class Create_FirstScreen extends Component {

static navigationOptions = {
    headerTitle: 'Create a Room',
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: '#b18d77',
    }
}

//Initial Room Creation -> Makes a room in Database
_MakeRoomDB(roomname,coffeeshop,roomsize,dropoffloc,dropofftime,uid,cups,owner){
    firebase.database().ref('rooms/' + uid)
    .set({
        roomname,
        owner,
        coffeeshop,
        dropoffloc,
        dropofftime,
        roomsize,
        cups,
        spot1: '',
        spot2: '',
        spot3: '',
        drinktype1: '',
        drinktype2: '',
        drinktype3: '',
        size1: '',
        size2: '',
        size3: '',
        coffeeorder1: '',
        coffeeorder2: '',
        coffeeorder3: '',
        comment1: '',
        comment2: '',
        comment3: '',
    })
    AsyncStorage.setItem("is_there_a_room", "true")
}

constructor(props) {
    super(props);
    this.currentRouteName = 'Createfirst';
    this.state = {
        username: null,
        roomname: '',
        coffeeshop: '', 
        roomsize: '',
        dropoffloc: '', 
        dropofftime: '',
        cups: '',
        loading: false,

        currentuid: '',
    }
  }

componentWillMount() {

    const uid = firebase.auth().currentUser.uid
    const UserDB = firebase.database().ref("users/" + uid)

    UserDB.child('username').on('value',snapshot => {
        this.setState({
            username: snapshot.val(),
        })
    })

    this.setState({currentuid: firebase.auth().currentUser.uid});
    
    
}

render(){

    //Arrays with Dropdown menu options
    let index = 0;
    const shops = [
        { key: index++, section: true, label: 'Coffeeshops' },
        { key: index++, label: "Tim Horton's" },
        { key: index++, label: "William's" },
        { key: index++, label: "Starbucks" },
        { key: index++, label: "Second Cup" },
    ];
    let index2 = 0;
    const cups = [
        { key: index2++, section: true, label: 'How many more Cups?' },
        { key: index2++, label: "1" },
        { key: index2++, label: "2" },
        { key: index2++, label: "3" },
    ];


    this.state.roomname = this.state.username + "'s Room"

    return <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#e6ddd1'        
            }}>

                <FormInput
                    value={this.state.roomname}
                    onChangeText={roomname => this.setState({ roomname })}
                    style={{
                        width: 180,
                        alignSelf: 'center',
                        textAlign: 'center'
                    }}
                />
                
                <ModalPicker
                    data={shops}
                    initValue="LOL"
                    onChange={(option)=>{ this.setState({coffeeshop:option.label})}}>
                        <TextInput
                            style={{
                                padding:10, 
                                height:50,
                                width: 250,
                                alignSelf: 'center',
                                textAlign: 'center'}}
                            editable={false}
                            placeholder="Select a Coffeeshop ..."
                            value={this.state.coffeeshop} />
                </ModalPicker>

                <ModalPicker
                    data={cups}
                    initValue="LOL"
                    onChange={(option)=>{ this.setState({roomsize:option.label})}}>
                        <TextInput
                            style={{
                                padding:10, 
                                height:50,
                                width: 250,
                                alignSelf: 'center',
                                textAlign: 'center'}}
                            editable={false}
                            placeholder="How many more Cups?"
                            value={this.state.roomsize} />
                </ModalPicker>

                <FormInput
                    placeholder="Location ..."
                    value={this.state.dropoffloc}
                    onChangeText={dropoffloc => this.setState({ dropoffloc })}
                />

                <FormInput
                    placeholder="Time ..."
                    value={this.state.dropofftime}
                    onChangeText={dropofftime => this.setState({ dropofftime })}
                />

                <View style = {{marginTop:20, width: 180}}>
                <Button
                    backgroundColor="#8b6f4b"
                    color='#b18d77'
                    title="Create Room"
                    onPress={() => {
                        this._MakeRoomDB(this.state.roomname,this.state.coffeeshop,
                            this.state.roomsize,this.state.dropoffloc,this.state.dropofftime,
                            this.state.currentuid,1,this.state.username);

                        this.props.navigation.navigate('Create_SecondScreen',{uid: this.state.currentuid,
                            roomname: this.state.roomname})
                        Keyboard.dismiss() }
                    }
                    
                />
                </View>
            </View>
        }
}


class Create_SecondScreen extends Component {

static navigationOptions = ({navigation}) => ({
    headerTitle: navigation.state.params.roomname,
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: '#b18d77',
    },
})


constructor(props) {
    super(props);
    this.currentRouteName = 'Createsecond';
    this.state = {
        roomname: '',
        owner: '',
        coffeeshop: '',
        dropoffloc: '',
        dropofftime: '',
        roomsize: '',
        cups: '',
        spot1: '',
        spot2: '',
        spot3: '',
        loading: false,

        drinktype1: '',
        size1: '',
        coffeeorder1: '',
        comment1: '',
        drinktype2: '',
        size2: '',
        coffeeorder2: '',
        comment2: '',
        drinktype3: '',
        size3: '',
        coffeeorder3: '',
        comment3: '',

        currentuid: '',
    }
}

componentWillMount() {

    this.setState({currentuid: firebase.auth().currentUser.uid});

    this._compileRoomDB();
}

//Sets all the this.state values that are necessary for viewing your own room
//listens for changes and updates
_compileRoomDB(){
    const { params } = this.props.navigation.state;
    const uid = params.uid
    
    firebase.database().ref('rooms/' + uid).on('value', (snapshot) => {
        if(snapshot.exists()){
            this.setState({
                roomname: snapshot.val().roomname,
                owner: snapshot.val().owner,
                coffeeshop: snapshot.val().coffeeshop,
                dropoffloc: snapshot.val().dropoffloc,
                dropofftime: snapshot.val().dropofftime,
                roomsize: snapshot.val().roomsize,
                cups: snapshot.val().cups,
                spot1: snapshot.val().spot1,
                spot2: snapshot.val().spot2,
                spot3: snapshot.val().spot3,

                drinktype1: snapshot.val().drinktype1,
                size1: snapshot.val().size1,
                coffeeorder1: snapshot.val().coffeeorder1,
                comment1: snapshot.val().comment1,
                drinktype2: snapshot.val().drinktype2,
                size2: snapshot.val().size2,
                coffeeorder2: snapshot.val().coffeeorder2,
                comment2: snapshot.val().comment2,
                drinktype3: snapshot.val().drinktype3,
                size3: snapshot.val().size3,
                coffeeorder3: snapshot.val().coffeeorder3,
                comment3: snapshot.val().comment3,

                _key: snapshot.key
            })
        }
    })
}

//Renders the Order
_renderActiveOrder(username,drinktype,size,coffeeorder,comment) {
if(username){
    return <View style={styles.orderDetails}>
        <Text style={{flex:1.2,borderWidth:1,textAlignVertical:'center'}}>{size + " " + drinktype}</Text>
        <Text style={{flex:1,borderWidth:1,textAlignVertical:'center'}}>{coffeeorder}</Text>
        <Text style={{flex:5,borderWidth:1,textAlignVertical:'center'}}>picture</Text>
        <Text style={{flex:0.8,borderWidth:1,textAlignVertical:'center'}}>{username}</Text>
        <Text style={{flex:0.8,borderWidth:1,textAlignVertical:'center'}}>{comment}</Text>
    </View>
} else {
        return <View 
                style={styles.orderDetails}>
                <Button 
                    color='#b18d77'
                    title="Add an Order!"
                    onPress = {() => {
                        this.props.navigation.navigate('Deliver_SecondScreen')
                    }}
                />
            </View> 
}}


//Deletes a room from the database and from AsyncStorage
_DeleteRoomDB(uid){
    firebase.database().ref('rooms/' + uid).remove()
    AsyncStorage.removeItem("is_there_a_room")
}

_resetStack(){
    return this.props
               .navigation
               .dispatch(NavigationActions.reset(
                 {
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'JoinScreen'})
                    ]
                  }));
  }

//Renders a different button based on whether the uid of the room
//matches the current user.
_renderDeleteRoom(owneruid) {
const compareuid = this.state.currentuid

if(owneruid==compareuid){
    return <View
    ><Button
        color='#b18d77'
        title="Delete"
        onPress={() => {
            this._DeleteRoomDB(this.state.currentuid)
            this.props.navigation.navigate('JoinScreen')
            this._resetStack()

        }}
    />
</View>      
}}

    render(){
        
        const { params } = this.props.navigation.state;

        return <View style={{
                flex: 1,
                backgroundColor: '#e6ddd1',
                }}>
                    <View style = {{
                        flex: 1,
                    }}>
                        <View style ={{
                            flexDirection: 'row',
                            backgroundColor: '#DECFC6',
                        }}>
                            <View style={{
                                flex: 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{fontSize: 16}}>{this.state.coffeeshop}</Text>
                            </View>

                            <View style={{
                                flex: 1.6,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text 
                                    style={{fontSize: 16}}
                                    numberOfLines= {2}>
                                {this.state.dropoffloc + "\n" + this.state.dropofftime}</Text>
                            </View>

                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{fontSize: 16}}>{this.state.owner}</Text>
                            </View>

                            <View style ={{
                                flex: 1.5,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {this._renderDeleteRoom(this.state._key)}
                            </View>
                        </View>
                    </View>

                    {/*order boxes*/}
                    <View style={{
                        flex: 9,
                        marginBottom: 5,
                    }}>
                        {/*first row*/}
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                        }}>
                            {/*first order*/}
                            <View style={styles.orderBox}>
                                <View style={styles.orderDetails}>
                                    <Text>{this.state.owner}</Text>
                                </View>
                            </View >

                            {/*second order*/}
                            <View style={styles.orderBox}>
                                {this._renderActiveOrder(this.state.spot1,this.state.drinktype1,
                                this.state.size1,this.state.coffeeorder1,this.state.comment1)}
                            </View>

                        </View>

                        {/*second row*/}
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                        }}>

                            {/*3rd order*/}
                            <View style={styles.orderBox}>
                                {this._renderActiveOrder(this.state.spot2,this.state.drinktype2,
                                this.state.size2,this.state.coffeeorder2,this.state.comment2)}
                            </View>

                            {/*4th order*/}
                            <View style={styles.orderBox}>
                                {this._renderActiveOrder(this.state.spot3,this.state.drinktype3,
                                this.state.size3,this.state.coffeeorder3,this.state.comment3)}
                            </View>

                        </View>

                    </View>
            </View>
}}

class JoinScreen extends React.Component {

static navigationOptions = {
    headerTitle: 'Rooms',
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: '#b18d77',
    }
}

constructor(props) {
    super(props);
    this.currentRouteName = 'Join';

    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
        datac: dataSource,
        loading: false,

        myroomname: '',
        currentuid: '',
    };
}

//Renders the Appropriate Action Button
_doIHaveARoom(checkuid,myroomname) {

    if(myroomname){
        return <ActionButton.Item
            buttonColor='#b18d77' 
            title="My Room" 
            hideShadow
            onPress={() => {
                this.props.navigation.navigate('Create_SecondScreen',{uid:checkuid,
                    roomname:myroomname})}}>
            <MaterialIcons name="home" style={styles.actionButtonItem} />
        </ActionButton.Item>
    } else {
        return <ActionButton.Item 
            buttonColor='#b18d77' 
            title="Create Room" 
            hideShadow
            onPress={() => {
                this.props.navigation.navigate('Create_FirstScreen')}}>
            <MaterialIcons name="add" style={styles.actionButtonItem} />
        </ActionButton.Item>
    }
}

_makeRoomRequest = () => {

    this.setState({ 
        loading: true,
        currentuid: firebase.auth().currentUser.uid 
    });

    firebase.database().ref('rooms/').on('value', (dataSnapshot) => {  
        if(dataSnapshot.exists()){
            var tasks = [];
            dataSnapshot.forEach((child) => {
            if(child.key != this.state.currentuid){
                tasks.push({
                    "owner": child.val().owner,
                    "coffeeshop": child.val().coffeeshop,
                    "dropoffloc": child.val().dropoffloc,
                    "dropofftime": child.val().dropofftime,
                    "roomname": child.val().roomname,
                    "roomsize": child.val().roomsize,
                    "spot1": child.val().spot1,
                    "spot2": child.val().spot2,
                    "spot3": child.val().spot3,
                    "cups": child.val().cups,
                    "_key": child.key
                });
            }
    });
        
        this.setState({
            datac: tasks,
        });
    } else {
        this.setState({
            datac: [],
        })
    }
    });

    //Grab the name of my Room
    firebase.database().ref('rooms/' + firebase.auth().currentUser.uid  + '/roomname/')
        .on('value',(snapshot) => {
            if(snapshot.exists()){
                this.setState({
                    myroomname: snapshot.val(),
                })
            } else {
                this.setState({myroomname: null,})
            }
        })
    

};

componentWillMount() {

    //Back Handler
    BackHandler.addEventListener('hardwareBackPress', function() {
        if(this.currentRouteName != 'Join'){
            this.navigation.navigate('JoinScreen')
            return true 
    } else {
            this.props.navigation.navigate('JoinScreen')
            return false
    }
    })

    this._makeRoomRequest();
}

render(){
    return <View 
                style={{    
                    backgroundColor: '#e6ddd1',
                    flex: 1
                }}>

            <List style={{ borderTopWidth:0, borderBottomWidth:0, backgroundColor: '#b18d77', }}>
                <FlatList
                    data={this.state.datac}
                    renderItem={({item}) => (
                        <ListItem 
                            roundAvatar
                            avatar={'http://www.actuallywecreate.com/wp-content/uploads/2012/10/tim-hortons-logo.jpg'}
                            title={item.roomname}
                            titleStyle={{
                                fontWeight: 'bold',
                                color: 'white'
                            }}
                            subtitle={item.coffeeshop + "\n" + item.dropoffloc
                                + "\n" + item.dropofftime + "\n" +  item.owner }
                            subtitleStyle={{
                                color: '#ece4df'
                            }}
                            subtitleNumberOfLines={4}
                            rightTitle= {item.cups + '/4'}
                            rightTitleStyle={{
                                color: 'white'
                            }}
                            onPress={() => {
                                this.props.navigation.navigate('Create_SecondScreen',{ uid: item._key,roomname:item.roomname })
                            }}
                            
                        />
                    )}
                    keyExtractor={item => item._key}
                />  
            </List>

            <ActionButton
                buttonColor="rgba(222, 207, 198, 1)"
                degrees={30}
                useNativeFeedback = {false} 
                icon={<MaterialIcons name="menu" style={styles.actionButtonIcon }/>}>
                
                    {this._doIHaveARoom(this.state.currentuid,this.state.myroomname)}

             </ActionButton>
        </View>
}};

export default stackNav = StackNavigator(
{
    Create_FirstScreen: {
        screen: Create_FirstScreen,
    },
    Create_SecondScreen: {
        screen: Create_SecondScreen,
    },
    JoinScreen: {
        screen: JoinScreen,
    },
},
    {
        headerMode: 'screen',
        initialRouteName: 'JoinScreen',
    }
);

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: '#8b6f4b',
    },
    actionButtonItem: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    orderBox: {
        flex: 1,
        borderWidth: 3,
        margin: 5,
        borderColor: '#b18d77',
        borderStyle: 'dotted',
        borderRadius: 5,
    },
    orderDetails: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});