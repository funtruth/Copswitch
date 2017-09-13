
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
        spot3: ''
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
    if (1==1) {
    //Grabs the username and email of current user
    const uid = firebase.auth().currentUser.uid
    const UserDB = firebase.database().ref("users/" + uid)

    UserDB.child('username').on('value',snapshot => {
        this.setState({
            username: snapshot.val(),
        })
    })
    } else {
        this.props.navigation.navigate('Create_SecondScreen')
    }
}

render(){

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
    }
}

componentWillMount() {
    this._compileRoomDB();
}

_compileRoomDB = () => {
    //Grabs the username and email of current user
    const uid = firebase.auth().currentUser.uid
    //const UserDB = firebase.database().ref("users/" + uid)

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
                _key: snapshot.key
            })
        }
    })
{/*}
    UserDB.child('username').on('value',snapshot => {
        this.setState({
        username: snapshot.val(),
        })
    }),
    UserDB.child('email').on('value',snapshot => {
        this.setState({
            email: snapshot.val(),
        })
    })
*/}
}

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
                                <Text style={{
                                    alignSelf: 'center'
                                }}>{this.state.spot1}</Text>
                            </View>

                        </View>

                        {/*second row*/}
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                        }}>

                            {/*3rd order*/}
                            <View style={styles.orderBox}>
                                <Text style={{
                                    alignSelf: 'center'
                                }}>{this.state.spot2}</Text>
                            </View>

                            {/*4th order*/}
                            <View style={styles.orderBox}>
                                <Text style={{
                                    alignSelf: 'center'
                                }}>{this.state.spot3}</Text>
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
    }
});