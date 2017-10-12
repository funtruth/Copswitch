
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    BackHandler,
    Text,
    ListView,
    FlatList,
    TouchableOpacity
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import { Button, List, ListItem, Avatar } from "react-native-elements";
import ProfileButton from '../components/ProfileButton.js';
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
        })
    })
}

componentWillUnmount() {

    if(this.userRef){
      this.userRef.off();
    }
}

  render(){
    return <View style={{ flex: 1, backgroundColor: 'white' }}>

                <View style = {{flex:1.15,flexDirection:'row' }}>
                    <View style = {{ flex:0.75 }}/>
                    <View style = {{flex:2.5,alignItems: 'center',justifyContent:'center'}}>
                        <Text>My Role:</Text>
                        <Text style={{fontWeight:'bold',fontSize:20,color:'black'}}>
                            {this.state.hidden ? 'Hidden' : this.state.role}</Text>
                    </View>
                    <TouchableOpacity
                        style={{ flex:0.75,justifyContent:'center' }}
                        onPressIn={()=>{ this.setState({hidden:false}) }}
                        onPressOut={()=>{ this.setState({hidden:true}) }}>
                        <MaterialCommunityIcons name='eye'
                            style={{color:'black', fontSize:26,alignSelf:'center'}}/>
                    </TouchableOpacity>
                </View>

                <View style = {{flex:10, flexDirection:'row'}}>

                        <View style = {{flex:1}}>
                            <View style = {{flex:4.4}}/>
                            <View style = {{flex:2.4}}/>
                        </View>

                        <View style = {{flex:0.2}}/>

                        <View style = {{flex:5.6}}/>

                        <View style = {{flex:0.2}}/>

                        <View style = {{flex:1}}>
                            <View style = {{flex:4.4}}/>
                            <View style = {{flex:0.6,justifyContent:'center',
                                backgroundColor:'black',borderTopLeftRadius:15}}>
                                <TouchableOpacity
                                    disabled={this.state.inagame?false:true}
                                    onPress={() => {
                                        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
                                          .update({ name: null, phase:1 })
                                        this.props.navigation.navigate('Room_Screen') }}>
                                    <MaterialCommunityIcons name='wrench'
                                        style={{color:this.state.inagame? 'white' : '#b5b3b0',
                                            fontSize:26,alignSelf:'center'}}/>
                                </TouchableOpacity>
                            </View>
                            <View style = {{flex:0.6,backgroundColor:'black'}}/>
                            <View style = {{flex:0.6,backgroundColor:'black'}}/>

                            <View style = {{flex:0.6,justifyContent:'center',
                                backgroundColor:'black',borderBottomLeftRadius:15}}>
                                <TouchableOpacity
                                    disabled={this.state.inagame}
                                    onPress={() => {
                                        this.props.navigation.navigate('SignedOut');
                                      onSignOut().then(() => { firebase.auth().signOut() })  }}>
                                    <MaterialCommunityIcons name='logout' 
                                        style={{color:this.state.inagame ?  '#b5b3b0' : 'white',
                                            fontSize:26,alignSelf:'center'}}/>
                                </TouchableOpacity>
                            </View>
                        </View>

                </View>

            <View style = {{ flex: 0.15 }}/>
    </View>
}};
