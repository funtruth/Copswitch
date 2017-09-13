
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
    Keyboard
}   from 'react-native';
import { Card, FormInput } from "react-native-elements";
import ModalPicker from 'react-native-modal-picker';

import { StackNavigator } from 'react-navigation';

import firebase from '../firebase/FirebaseController.js';

class Create_FirstScreen extends Component {

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
    this.state = {
        username: null,
        roomname: '',
        coffeeshop: '', 
        roomsize: '',
        dropoffloc: '', 
        dropofftime: '',
        cups: '',
        loading: false,
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
            }}
            >

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
                            firebase.auth().currentUser.uid,1,this.state.username);

                        this.props.navigation.navigate('Create_SecondScreen')
                        Keyboard.dismiss() }
                        
                    }
                    
                />
                </View>
            </View>
        }
}

class Create_SecondScreen extends Component {

constructor(props) {
    super(props);
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
    }
}

componentWillMount() {
    this._compileRoomDB();
}

//Sets all the this.state values that are necessary for viewing your own room
//listens for changes and updates
_compileRoomDB = () => {

    const uid = firebase.auth().currentUser.uid

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
        <Text>{username}</Text>
        <Text>{drinktype}</Text>
        <Text>{size}</Text>
        <Text>{coffeeorder}</Text>
        <Text>{comment}</Text>
    </View>
} else {
        return <View style={styles.orderDetails}>
            <Text>Add your Order!</Text>
            </View> 
}}


//Deletes a room from the database and from AsyncStorage
_DeleteRoomDB(uid){
    firebase.database().ref('rooms/' + uid).remove()
    AsyncStorage.removeItem("is_there_a_room")
}

    render(){
        return <View style={{
                flex: 1,
                backgroundColor: '#e6ddd1',
                }}>
                    <View style = {{
                        flex: 1,
                    }}>
                        <View style = {{
                            flexDirection: 'row',
                        }}>
                            <View style={{
                                flex: 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 60,
                            }}>
                                <Text style = {{
                                    fontSize: 28,
                                    borderWidth: 1,
                                }}>{this.state.roomname}</Text>
                            </View>

                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                            }}>
                                <Text></Text>
                            </View>
                        </View>

                        <View style ={{
                            flexDirection: 'row',
                        }}>
                            <View style={styles.debugBox}>
                                <Text>{this.state.coffeeshop}</Text>
                            </View>

                            <View style={styles.debugBox}>
                                <Text>{this.state.dropoffloc}</Text>
                            </View>

                            <View style={styles.debugBox}>
                                <Text>{this.state.dropofftime}</Text>
                            </View>
                        </View>
                    </View>

                    {/*order boxes*/}
                    <View style={{
                        flex: 4,
                        borderWidth: 1,
                        marginBottom: 5,
                    }}>
                        {/*first row*/}
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                        }}>
                            {/*first order*/}
                            <View style={styles.orderBox}>
                                <Text style={{
                                    alignSelf: 'center'
                                }}>My Coffee</Text>
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

                    <View style={{
                        width: 180,
                        alignSelf: 'center',
                        marginBottom: 15,
                    }}>
                    <Button
                        color='#b18d77'
                        title="Delete Room"
                        onPress={() => {
                            this._DeleteRoomDB(firebase.auth().currentUser.uid)

                            this.props.navigation.navigate('Create_FirstScreen')
                        }}
                    />
                </View>
            </View>
}}


export default stackNav = StackNavigator(
{
    Create_FirstScreen: {
        screen: Create_FirstScreen,
    },
    Create_SecondScreen: {
        screen: Create_SecondScreen,
    },
},
    {
        headerMode: 'none',
        initialRouteName: true ? "Create_FirstScreen" : "Create_SecondScreen"
    }
);

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: '#8b6f4b',
    },
    orderBox: {
        flex: 1,
        borderWidth: 5,
        margin: 5,
        borderColor: '#b18d77',
        borderStyle: 'dotted',
        borderRadius: 2,
    },
    debugBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    orderDetails: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});