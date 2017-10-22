
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    Text,
    ListView,
    FlatList,
    TouchableOpacity
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import { Button, List } from "react-native-elements";
import { onSignOut } from "../auth";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//Firebase
import firebase from '../firebase/FirebaseController.js';

export default class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    
    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {

      role: '',
      description: '',
      inagame:false,

      roomname:'',
      messages: dataSource,

      hidden:true,

    }
    this.userRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room');

  }

componentWillMount() {
    this.userRef.on('value',snap=>{

        firebase.database().ref('rooms/' + snap.val().name + '/listofplayers/' 
        + firebase.auth().currentUser.uid).once('value',status=> {
            if(status.exists()){
                
                if(snap.val().phase > 1){
                    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room/type')
                    .once('value',outsnap=>{
                        firebase.database().ref(outsnap.val() + '/roles/' + status.val().roleid).once('value',rolesnap=>{

                            this.setState({
                                role: rolesnap.val().name,
                                description: rolesnap.val().desc,
                                inagame: true,
                            })
                        })
                    })

                } else {
                    this.setState({
                        role:'None',
                        description: 'There is no Active Game.',
                        inagame:false,
                    })
                }
            }
        })
        
    })
}

componentWillUnmount() {

    if(this.userRef){
      this.userRef.off();
    }
}

_leaveGame() {

    AsyncStorage.removeItem('ROOM-KEY');
    AsyncStorage.removeItem('GAME-KEY');

    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
        .update({ name: null, phase:1 })
    //this.props.navigation.navigate('SignedIn')
    this.props.navigation.dispatch(
        NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
              NavigationActions.navigate({ routeName: 'SignedIn'})
            ]
        })
    )
}

_logOutPress() {
    if(firebase.auth().currentUser.isAnonymous){
        onSignOut().then(() => { firebase.auth().currentUser.delete() })
        this.props.navigation.navigate('SignedOut');
    } else {
        onSignOut().then(() => { firebase.auth().signOut() }) 
        this.props.navigation.navigate('SignedOut');
    }
}

  render(){
    return <View style={{ flex: 1, backgroundColor: 'white' }}>

            <View style = {{flex:2,flexDirection:'row',justifyContent:'center'}}>
                <TouchableOpacity
                    style={{ flex:0.75,justifyContent:'center' }}
                    onPressIn={()=>{ this.setState({hidden:false}) }}
                    onPressOut={()=>{ this.setState({hidden:true}) }}>
                    <View style = {{flex:2.5,alignItems: 'center',justifyContent:'center'}}>
                        <Text style = {{fontFamily:'ConcertOne-Regular'}}>My Role:</Text>
                        <Text style={{fontSize:30,color:'black',fontFamily:'ConcertOne-Regular'}}>
                        {this.state.hidden ? 'Hidden' : this.state.role}</Text>
                </View>
                </TouchableOpacity>
            </View>

            <View style = {{flex:10, flexDirection:'row'}}>

            </View>

            <View style = {{flex:1,flexDirection:'row'}}>
                <View style = {{flex:0.5, flexDirection:'row', justifyContent:'center'}}>
                <TouchableOpacity
                    style = {{flex:0.75, justifyContent:'center', alignItems:'center',
                        backgroundColor:'black', borderRadius:10}}
                    onPress={() => {
                        this._leaveGame();     
                    }}
                >
                    <Text style={{color:'white'}}>Quit</Text>
                </TouchableOpacity>
                </View>

                <View style = {{flex:0.5, flexDirection:'row', justifyContent:'center'}}>
                <TouchableOpacity
                    style = {{flex:0.75, justifyContent:'center', alignItems:'center',
                        backgroundColor:'black', borderRadius:10}}
                    onPress={() => {
                        this._logOutPress();     
                    }}
                >
                    <Text style={{color:'white'}}>Logout</Text>
                </TouchableOpacity>
                </View>
            </View>

        <View style = {{ flex: 0.15 }}/>
    </View>
}};
