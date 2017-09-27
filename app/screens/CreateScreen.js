
import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    BackHandler,
    AsyncStorage,
    TextInput,
    StyleSheet,
    Keyboard,
    ListView,
    FlatList,
    TouchableOpacity
}   from 'react-native';
import { FormInput, List, ListItem, Button } from "react-native-elements";
import ModalPicker from 'react-native-modal-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import firebase from '../firebase/FirebaseController.js';

//Components
import HeaderButton from '../components/HeaderButton.js';
import ProfileButton from '../components/ProfileButton.js';

class CreateRoom_Screen extends Component {

static navigationOptions = {
    headerTitle: 'Create a Room',
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: '#b18d77',
    }
}

//Makes an order 
_createRoom(groupid,dropoffloc,uid,roomname,owner,firstname,lastname,coffeeshop,roomsize,cups) {
        firebase.database().ref('rooms/' + groupid + '/' + dropoffloc + '/' + uid)
        .set({
            roomname,
            owner,
            firstname,
            lastname,
            coffeeshop,
            dropoffloc,
            roomsize,
            cups,
        })
    }

constructor(props) {
    super(props);
    this.currentRouteName = 'Createfirst';
    this.state = {
        username: null,
        firstname: '',
        lastname: '',
        roomname: '',
        coffeeshop: '', 
        roomsize: '',
        dropoffloc: '', 
        cups: '',
        loading: false,

        activegroup: '',
        activelocation: '',

        currentuid: '',

        coffeeshopsarray: [
            { key: 1, section: true, label: 'Coffeeshops' },
        ],
        roomsizearray: [
            { key: 1, section: true, label: 'How many Cups?' },
            { key: 2, label: "2" },
            { key: 3, label: "3" },
            { key: 4, label: "4" },
        ],
        locationsarray: [
            { key: 1, section: true, label: 'Choose a Location:'},
        ],

    }

    this.UserDB = firebase.database().ref("users/" + firebase.auth().currentUser.uid);
  }

componentWillMount() {

    this.UserDB.once('value',snapshot => {

        this.setState({
            username: snapshot.val().username,
            firstname: snapshot.val().firstname,
            lastname: snapshot.val().lastname,
            activegroup: snapshot.val().activegroup,
            roomname: snapshot.val().firstname + " " + snapshot.val().lastname + "'s Room"
        })

        //Draw list of coffeeshops for Active Group
        firebase.database().ref('groups/' + snapshot.val().activegroup + '/coffeeshops')
        .once('value', snap => {

            var counter = 2;
            snap.forEach((child)=> {
                this.state.coffeeshopsarray.push({key: counter, label: child.key})
                counter = counter + 1
            })
        })

        //Draw list of Drop-off Locations for Active Group
        firebase.database().ref('groups/' + snapshot.val().activegroup + '/locations')
            .once('value', snap => {

                var counter = 2;
                snap.forEach((child)=> {
                    this.state.locationsarray.push({key: counter, label: child.key})
                    counter = counter + 1
                })
        })
    })

    this.setState({currentuid: firebase.auth().currentUser.uid});

}

render(){

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
                    data={this.state.coffeeshopsarray}
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
                    data={this.state.roomsizearray}
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

                <ModalPicker
                    data={this.state.locationsarray}
                    onChange={(option)=>{ this.setState({dropoffloc:option.label})}}>
                        <TextInput
                            style={{
                                padding:10, 
                                height:50,
                                width: 250,
                                alignSelf: 'center',
                                textAlign: 'center'}}
                            editable={false}
                            placeholder="Location ..."
                            value={this.state.dropoffloc} />
                </ModalPicker>

                <View style = {{marginTop:20, width: 180}}>
                <Button
                    backgroundColor='#b18d77'
                    color='white'
                    title="Create Room"
                    onPress={() => {
                        this._createRoom(this.state.activegroup,this.state.dropoffloc,
                            this.state.currentuid,this.state.roomname,this.state.username,
                            this.state.firstname,this.state.lastname,this.state.coffeeshop,
                            this.state.roomsize,1);

                        alert('navigate to MyRoom')

                        Keyboard.dismiss() }

                    }
                />
                </View>
            </View>
        }
}


class ViewRoom_Screen extends Component {

static navigationOptions = ({navigation}) => ({
    headerTitle: navigation.state.params.roomname,
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: '#b18d77',
    },
    headerLeft: null,
    headerRight: 
        <HeaderButton
            title="Return"
            onPress={()=> {
                    navigation.dispatch(NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'JoinRoom_Screen'})
                        ]
                    }));
            }}
    />,       
})


constructor(props) {
    super(props);
    this.currentRouteName = 'Createsecond';
    this.state = {
        roomname: '',
        owner: '',
        firstname: '',
        lastname: '',
        coffeeshop: '',
        dropoffloc: '',
        dropofftime: '',
        roomsize: '',
        cups: '',
        loading: false,

        currentuid: '',

        //Passed uid from navigation
        passeduid: '',
        passedgroup: '',
        passedlocation: '',

        drinktype: '',
        size: '',
        coffeeorder: '',
        comment: '',

    }

    this.ref=null;

}

//Sets all the this.state values that are necessary for viewing your own room
//listens for changes and updates
_compileRoomDB(){

    const { params } = this.props.navigation.state;
    const uid = params.uid;
    const activegroup = params.group;
    const activelocation = params.location;
    
    this.setState({passeduid: uid, currentuid: firebase.auth().currentUser.uid,
        passedgroup: activegroup, passedlocation: activelocation});

    this.ref = firebase.database().ref('rooms/' + activegroup + '/' 
    + activelocation + '/' + uid)

    this.ref.on('value', datasnap => {

            this.setState({

                roomname: datasnap.val().roomname,
                owner: datasnap.val().owner,
                firstname: datasnap.val().firstname,
                lastname: datasnap.val().lastname,
                coffeeshop: datasnap.val().coffeeshop,
                dropoffloc: datasnap.val().dropoffloc,
                roomsize: datasnap.val().roomsize,
                cups: datasnap.val().cups,

                _key: datasnap.key

            })
        })
  
}

componentWillUnmount(){

    if(this.ref) {
        this.ref.off();
    }
}

//Renders a different button based on whether the uid of the room
//matches the current user.
_renderDeleteButton(owneruid,currentuid) {

    if(owneruid==currentuid){
        return <View><Button
            color='white'
            backgroundColor='#b18d77'
            title="Delete"
            borderRadius={16}
            fontSize={15}
            buttonStyle={{marginTop: 5, marginBottom: 5, paddingTop: 5, paddingBottom: 5, 
                paddingLeft: 8, paddingRight: 8}}
            onPress={() => {
                this._DeleteRoomDB(currentuid)
                this.props.navigation.navigate('JoinRoom_Screen')
                this._resetStack()
        }}/>
    </View>      
    }
}


componentWillMount() {
    this._compileRoomDB();
}

    render(){
        
        const { params } = this.props.navigation.state;

        return <View style={{
                flex: 1,
                backgroundColor: '#e6ddd1',
                }}>
                    <View style = {{
                        borderWidth: 1,
                        flex: 1,
                        flexDirection: 'row',
                    }}>
                        <View style = {{flex:2.4,borderWidth:1,}}>
                            <Text>{'Coffeeshop: ' + this.state.coffeeshop}</Text>
                            <Text>{'Location: ' + this.state.dropoffloc}</Text>
                            <Text>{'Owner: ' + this.state.firstname + ' ' + this.state.lastname}</Text>
                            <Text>{'Username: ' + this.state.owner}</Text>
                        </View>

                        <View style = {{flex:1,borderWidth:1,}}>
                            <Text>LOGO</Text>
                        </View>
                    </View>

                    <View style = {{
                        borderWidth: 1,
                        flex: 3,
                        flexDirection: 'row',
                    }}>
                        <View style = {{flex:1.2,borderWidth:1,}}>
                            <Text style = {{ flex:3 }}>Order Picture</Text>
                            
                            <View style = {{flex:1}}><ProfileButton 
                                title = "Add Order!"
                                icon={{name: 'add-circle', size: 18}}
                                onPress = {() => {alert('hi')}}
                            /></View>
                        </View>

                        <View style = {{flex:1,borderWidth:1,}}>
                            <View style = {{flex:0.3,borderWidth:1}}></View>
                            <Text style = {{flex:1}}>Order Details</Text>
                            <View style = {{flex:0.3,borderWidth:1}}></View>
                        </View>
                    </View>

                    <View style = {{
                        borderWidth: 1,
                        flex: 1.5,
                    }}>
                        <View style = {{flex:1,justifyContent:'center'}}>
                            <TextInput
                                placeholder='Comment ...'
                                style={{
                                    backgroundColor: '#decfc6',
                                    borderRadius: 10,
                                    marginLeft: 10,
                                    marginRight: 10,
                                    fontSize: 10,
                                }}
                                value = {this.state.comment}
                                onChangeText = {(text) => {this.setState({comment: text})}}
                            />
                        </View>
                        <View style = {{flex:1,borderWidth:1,}}>
                            <Text>Blank Space?</Text>
                        </View>
                    </View>
            </View>
}}

class JoinRoom_Screen extends React.Component {

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

        roomflag: '',
        currentuid: '',

        activegroup: '',
        activelocation: '',
    };

    this.userRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
    this.filterRef = firebase.database().ref('filters/' + firebase.auth().currentUser.uid);
}

//Renders the Appropriate Action Button
_doIHaveARoom(checkuid) {

    if(this.state.roomflag == true){
        return <ActionButton.Item
            buttonColor='#b18d77' 
            title="My Room" 
            hideShadow
            onPress={() => {
                alert('Navigate to My Room')    
            }}>
            <MaterialIcons name="home" style={styles.actionButtonItem} />
        </ActionButton.Item>
    } else {
        return <ActionButton.Item 
            buttonColor='#b18d77' 
            title="Create Room" 
            hideShadow
            onPress={() => {
                this.props.navigation.navigate('CreateRoom_Screen')}}>
            <MaterialIcons name="add" style={styles.actionButtonItem} />
        </ActionButton.Item>
    }
}

_makeRoomRequest = () => {

    this.setState({ 
        loading: true,
        currentuid: firebase.auth().currentUser.uid 
    });

    this.userRef.on('value', snapshot => {

        //Check if user has a room
        this.setState({roomflag: snapshot.val().roomflag, activegroup: snapshot.val().activegroup})

        firebase.database().ref('locations/' + firebase.auth().currentUser.uid
            + '/' + snapshot.val().activegroup).once('value', snap => {

                this.setState({activelocation: snap.val().activelocation})

                this.filterRef.once('value', filtersnap => {

                    firebase.database().ref('rooms/' + snapshot.val().activegroup + '/'
                        + snap.val().activelocation).orderByChild("coffeeshop")
                        .equalTo(filtersnap.val().roomfilter).once('value', insidesnap => {

                            var tasks = [];
                            insidesnap.forEach((child) => {
                            
                                //Set to != for non-debugging purposes
                                if(child.key == this.state.currentuid){
                                    tasks.push({
                                        "owner": child.val().owner,
                                        "coffeeshop": child.val().coffeeshop,
                                        "dropoffloc": child.val().dropoffloc,
                                        "roomname": child.val().roomname,
                                        "roomsize": child.val().roomsize,
                                        "spot1": child.val().spot1,
                                        "spot2": child.val().spot2,
                                        "spot3": child.val().spot3,
                                        "cups": child.val().cups,
                                        "_key": child.key
                                    });
                                }

                            })
                    
                            this.setState({
                                datac: tasks,
                            });
                    })

                })

        })

    });
}

componentWillMount() {
    this._makeRoomRequest();
};

componentWillUnmount() {
    if (this.userRef) {
        this.userRef.off();
    }
};

render(){
    return <View style={{ backgroundColor: '#e6ddd1',flex: 1 }}>

            <Button
            title={'Group: ' + this.state.activegroup + ' / ' + 'Location: ' + this.state.activelocation}
            onPress={()=>{}}
            backgroundColor= '#b18d77'
            borderRadius= {10}
            buttonStyle={{marginTop:5,marginBottom:5, height:23}}
            fontSize={12}
            />

            <List style={{ borderRadius:10,marginLeft:10,marginRight:10,marginBottom:10,
                backgroundColor: '#b18d77',}}>
                <FlatList
                    data={this.state.datac}
                    renderItem={({item}) => (
                        <ListItem 
                            title={item.roomname}
                            titleStyle={{
                                fontWeight: 'bold',
                                color: 'white',
                            }}
                            subtitle={item.coffeeshop + "\n" + item.dropoffloc + "\n" 
                                + item.firstname+" "+item.lastname+" ("+item.owner+")"}
                            subtitleNumberOfLines={4}
                            subtitleStyle={{
                                color: '#decfc6'
                            }}
                            onPress={() => {
                                this.props.navigation.navigate('ViewRoom_Screen',
                                    { uid: item._key,roomname:item.roomname,
                                    group:this.state.activegroup, location: this.state.activelocation })
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
                
                    {this._doIHaveARoom(this.state.currentuid)}

             </ActionButton>
             
        </View>
}};

export default stackNav = StackNavigator(
{
    CreateRoom_Screen: {
        screen: CreateRoom_Screen,
    },
    ViewRoom_Screen: {
        screen: ViewRoom_Screen,
    },
    JoinRoom_Screen: {
        screen: JoinRoom_Screen,
    },
},
    {
        headerMode: 'screen',
        initialRouteName: 'JoinRoom_Screen',
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
    },
    orderDetailCoffee: {
        flex:1,
        textAlignVertical:'center',
        backgroundColor: '#b18d77',
        color: 'white',
        borderRadius:5,
        margin: 2,
        paddingLeft: 10,
        paddingRight: 10,
    },
    orderDetailOrder: {
        flex:1,
        textAlignVertical:'center',
        backgroundColor: '#b18d77',
        color: 'white',
        borderRadius:5,
        margin: 2,
        paddingLeft: 10,
        paddingRight: 10,
    },
    orderDetailUsername: {
        flex:1,
        textAlignVertical:'center',
        backgroundColor: '#b18d77',
        color: 'white',
        borderRadius:5,
        margin: 2,
        paddingLeft: 10,
        paddingRight: 10,
    },
    orderDetailComment: {
        flex:1,
        textAlignVertical:'center',
        backgroundColor: '#b18d77',
        color: 'white',
        borderRadius:5,
        margin: 2,
        paddingLeft: 10,
        paddingRight: 10,
    }
});