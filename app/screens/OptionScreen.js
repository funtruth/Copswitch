
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    Text,
    Keyboard,
    TouchableOpacity
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import colors from '../misc/colors.js';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//Firebase
import firebase from '../firebase/FirebaseController.js';

export class Option_Screen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        
        const { params } = this.props.navigation.state;
        const roomname = params.roomname;

        this.state = {
            roomname:           params.roomname,
            townwin:            false,
            checked:            false,
        };

        this.roomRef = firebase.database().ref('rooms/' + roomname);

    }

    componentWillMount() {

        this.roomRef.on('value',snap=>{
            if(snap.exists()){
                this.roomRef.child('mafia').once('value',mafia=>{
                    if(mafia.numChildren() == 0){
                        this.setState({
                            checked:    true,
                            townwin:    true,
                        })
                    } else if(mafia.numChildren()*2+1 > snap.val().playernum){
                        this.setState({
                            checked:    true,
                            townwin:    false,
                        })
                    //Should not be triggered?
                    } else {
                        this.setState({
                            checked: true,
                        })
                    }
                })
            } else {
                this.setState({
                    checked: true,
                })
            }
        })

    }

    componentWillUnmount() {

        if(this.roomRef){
            this.roomRef.off();
        }

    }

    _returnGame(){
        
    }

    _leaveGame(){
        AsyncStorage.removeItem('ROOM-KEY');
        AsyncStorage.removeItem('GAME-KEY');

        //Either remove yourself from the room or delete it
        firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers').once('value',snap=>{
            if(snap.numChildren() < 2){
                firebase.database().ref('rooms/' + this.state.roomname).remove();
            } else {
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                    + firebase.auth().currentUser.uid).remove();
            }
        })

        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
            .update({ name: null, phase:1, actionbtnvalue: false, presseduid: 'foo' })
        
        //this.props.navigation.navigate('Room_Screen')
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
        return this.state.townwin?<Text>town wins</Text>:<Text>mafia wins</Text>
    }

    _renderImage() {
        return this.state.townwin?<Text>town wins image</Text>:<Text>mafia wins image</Text>
    }

    render() {

        if(!this.state.checked){
            return null
        }

        return <View style = {{flex:1,backgroundColor:colors.background}}>
            <View style = {{flex:1,justifyContent:'center'}}>
                <View style = {{flex:0.7,justifyContent:'center',alignItems:'center'}}>
                    {this._renderHeader()}
                </View>
            </View>
            <View style = {{flex:2,justifyContent:'center'}}>
                <View style = {{flex:0.7,justifyContent:'center',alignItems:'center'}}>
                    {this._renderImage()}
                </View>
            </View>
            <View style = {{flex:1,justifyContent:'center'}}>
                <TouchableOpacity
                    onPress={()=>{this._returnGame()}}
                    style={{
                        flex:0.8,
                        justifyContent:'center',
                        backgroundColor:colors.main,
                    }}
                ><Text style = {{alignSelf:'center',color:colors.background,
                    fontFamily:'ConcertOne-Regular',fontSize:25}}>PLAY AGAIN</Text>
                </TouchableOpacity>
            </View>
            <View style = {{flex:0.5,justifyContent:'center',flexDirection:'row'}}>
                <TouchableOpacity
                    onPress={()=>{this._leaveGame()}}
                    style={{flex:0.65,justifyContent:'center',backgroundColor:colors.main,borderRadius:15}}>
                <Text style = {{alignSelf:'center',color:colors.background,
                    fontFamily:'ConcertOne-Regular',fontSize:20}}>QUIT</Text>
                </TouchableOpacity>
            </View>
            <View style = {{flex:0.2}}/>
        </View>
    }
}

export class Expired_Screen extends React.Component {
    
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }
    
    _resetGame(){
        AsyncStorage.removeItem('ROOM-KEY');
        AsyncStorage.removeItem('GAME-KEY');
    
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
            .update({ name: null, phase:1, actionbtnvalue: false, presseduid: 'foo' })
        //this.props.navigation.navigate('Room_Screen')
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
        return <Text>Your game expired</Text>
    }
    
    _renderImage() {
        return <Text>awww poor baby</Text>
    }
    
    render() {
        return <View style = {{flex:3,backgroundColor:colors.background}}>
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
    