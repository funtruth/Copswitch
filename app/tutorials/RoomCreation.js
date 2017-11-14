
import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    Image,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
    TouchableWithoutFeedback,
}   from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MenuButton } from '../components/MenuButton.js';

import { StackNavigator, TabNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import Rolesheet from '../misc/roles.json';
import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';

export class Creation1 extends Component {

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

                <View style = {{flexDirection:'row', flex:0.1, marginTop:20, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.85}}/>
                    <TouchableOpacity
                        style = {{flex:0.15}}
                        onPress = {()=>{
                            this.props.navigation.navigate('SignedIn');
                        }} >
                        <MaterialCommunityIcons name='close'
                            style={{color:colors.main,fontSize:30}}/>
                    </TouchableOpacity>
                </View>

                <View style = {{flexDirection:'row', flex:0.1, marginTop:20, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.7}}> 
                        <Text style = {styles.concerto}>Room Code</Text>
                        <Text style = {styles.roomcode}>ABCD</Text>
                    </View>
                </View>

                <View style = {{flex:0.3,backgroundColor:colors.background, 
                    justifyContent:'center', alignItems:'center'}}>

                    <View style = {{ flexDirection: 'row'}}>
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
                            onSubmitEditing = {()=>{ this.props.navigation.navigate('Screenb')}}
                        />
                    </View>

                </View>
            </View>
        </TouchableWithoutFeedback>
    }
}

export class Creation2 extends Component {

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

                <View style = {{flexDirection:'row', flex:0.1, marginTop:20, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.85}}/>
                    <TouchableOpacity
                        style = {{flex:0.15}}
                        onPress = {()=>{
                            this.props.navigation.navigate('SignedIn');
                        }} >
                        <MaterialCommunityIcons name='close'
                            style={{color:colors.main,fontSize:30}}/>
                    </TouchableOpacity>
                </View>

                <View style = {{flexDirection:'row', flex:0.1, marginTop:20, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.7}}> 
                        <Text style = {styles.concerto}>Room Code</Text>
                        <Text style = {styles.roomcode}>ABCD</Text>
                    </View>
                </View>

                <View style = {{flex:0.3,backgroundColor:colors.background, 
                    justifyContent:'center', alignItems:'center'}}>

                    <View style = {{ flexDirection: 'row'}}>
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
                            onSubmitEditing = {()=>{ this.props.navigation.navigate('Screenb')}}
                        />
                    </View>

                </View>
            </View>
        </TouchableWithoutFeedback>
    }
}

export class Creation3 extends Component {
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

                <View style = {{flexDirection:'row', flex:0.1, marginTop:20, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.85}}/>
                    <TouchableOpacity
                        style = {{flex:0.15}}
                        onPress = {()=>{
                            this.props.navigation.navigate('SignedIn');
                        }} >
                        <MaterialCommunityIcons name='close'
                            style={{color:colors.main,fontSize:30}}/>
                    </TouchableOpacity>
                </View>

                <View style = {{flexDirection:'row', flex:0.1, marginTop:20, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.7}}> 
                        <Text style = {styles.concerto}>Room Code</Text>
                        <Text style = {styles.roomcode}>ABCD</Text>
                    </View>
                </View>

                <View style = {{flex:0.3,backgroundColor:colors.background, 
                    justifyContent:'center', alignItems:'center'}}>

                    <View style = {{ flexDirection: 'row'}}>
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
                            onSubmitEditing = {()=>{ this.props.navigation.navigate('Screenb')}}
                        />
                    </View>

                </View>
            </View>
        </TouchableWithoutFeedback>
    }
}

export class Creation4 extends Component {

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

                <View style = {{flexDirection:'row', flex:0.1, marginTop:20, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.85}}/>
                    <TouchableOpacity
                        style = {{flex:0.15}}
                        onPress = {()=>{
                            this.props.navigation.navigate('SignedIn');
                        }} >
                        <MaterialCommunityIcons name='close'
                            style={{color:colors.main,fontSize:30}}/>
                    </TouchableOpacity>
                </View>

                <View style = {{flexDirection:'row', flex:0.1, marginTop:20, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.7}}> 
                        <Text style = {styles.concerto}>Room Code</Text>
                        <Text style = {styles.roomcode}>ABCD</Text>
                    </View>
                </View>

                <View style = {{flex:0.3,backgroundColor:colors.background, 
                    justifyContent:'center', alignItems:'center'}}>

                    <View style = {{ flexDirection: 'row'}}>
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
                            onSubmitEditing = {()=>{ this.props.navigation.navigate('Screenb')}}
                        />
                    </View>

                </View>
            </View>
        </TouchableWithoutFeedback>
    }
}

const styles = StyleSheet.create({
    roomcode: {
        fontSize: 30,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    concerto: {
        fontSize: 20,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.main,
    },

});