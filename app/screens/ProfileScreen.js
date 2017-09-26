
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    BackHandler,
    Text,
    ScrollView,
    StyleSheet,
    TextInput
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import ModalPicker from 'react-native-modal-picker';

import { Button, List, ListItem, Avatar } from "react-native-elements";
import ProfileButton from '../components/ProfileButton.js';
import HeaderButton from '../components/HeaderButton.js';
import ToggleListItem from '../components/ToggleListItem.js';
import NormalListItem from '../components/NormalListItem.js';

//import { onSignOut } from "../auth";

//Facebook
import { LoginManager } from 'react-native-fbsdk'

//Firebase
import firebase from '../firebase/FirebaseController.js';

class ProfileScreen extends React.Component {

static navigationOptions = {
  headerTitle: 'My Profile',
  headerTintColor: 'white',
  headerStyle: {
      backgroundColor: '#b18d77',
  }
}

  constructor(props) {
    super(props);
    this.state = {
      uid:null,
      username:null,
      email:null,
      loading: true,
    }
    this.ref = null;
  }

componentWillMount() {
  //Grabs the username and email of current user
  this.setState({uid:firebase.auth().currentUser.uid})
  const uid = firebase.auth().currentUser.uid 
  this.ref = firebase.database().ref("users/" + uid)

  this.ref.on('value',snapshot => {
    this.setState({
      firstname: snapshot.val().firstname,
      lastname: snapshot.val().lastname,
      username: snapshot.val().username,
      email: snapshot.val().email,
    })
  })
}

componentWillUnmount() {
  this.ref.off();
}
  render(){
    return <View style={{
              flex: 1,
              backgroundColor: '#e6ddd1',
          }}>
            
            <View style = {{
              flex: 1,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
                <View style = {{
                  flex: 1,
                  alignItems: 'center',
                }}>
                    <Avatar
                      large
                      rounded
                      containerStyle={{
                        borderWidth: 2,
                        borderColor: '#b18d77',
                      }}
                    />
                </View>
              
                <View style = {{
                    flex: 1,
                  }}>
                    <Text style={{ color:'#b18d77', fontSize: 24}}>{this.state.firstname 
                        + " " + this.state.lastname}</Text>
                    <Text style={{ color: '#b18d77', fontSize: 12}}>{this.state.email}</Text>
                    <Text style={{ color:'#b18d77', fontSize: 18}}>{this.state.username}</Text>
                </View>
            </View>

            <View style = {{
              flex: 2,
              backgroundColor: '#e6ddd1',
            }}>

              <ScrollView style = {{
                flex: 1,
              }}>
                <View style = {{
                  flex: 1,
                  flexDirection: 'row',
                  backgroundColor: '#e6ddd1',
                }}>
                  <View style = {{
                    flex: 1,
                    margin: 5,
                  }}>
                    <ProfileButton title="Settings" 
                      icon={{name: 'settings', size: 16}}
                      onPress={() => {
                        this.props.navigation.navigate('SettingsScreen')
                      }}/>
                  </View>
                  <View style = {{
                    flex: 1,
                    margin: 5,
                  }}>
                    <ProfileButton
                      title="Defaults"
                      icon={{name: 'menu', size: 16}}
                      onPress={() => {
                        this.props.navigation.navigate('DefaultsScreen')
                      }}/>
                    </View>
                </View>

                <View style = {{
                  flex: 1,
                  flexDirection: 'row',
                  backgroundColor: '#e6ddd1',
                }}>
                  <View style = {{
                    flex: 1,
                    margin: 5,
                  }}>
                    <ProfileButton
                      title="Log Out"
                      icon={{name: 'subdirectory-arrow-left', size: 16}}
                      onPress={() => {
                        this.props.navigation.navigate('SignedOut');
                      
                        //onSignOut().then(() => {
                          //firebase.auth().signOut();
                        //this.props.navigation.navigate('SignedOut');
                        //}) 
                    }}/>
                  </View>
                  <View style = {{
                    flex: 1,
                    margin: 5
                  }}>
                    <ProfileButton
                      title="Delete Account"
                      icon={{name: 'delete', size: 16}}
                      onPress={() => {
                        firebase.database().ref('users/' + this.state.uid).remove();
                        firebase.auth().currentUser.delete().then(() => {
                          this.props.navigation.navigate('SignedOut');
                        }).catch(() => {
                          alert('Failed to Delete');
                        })
                      }}/>
                    </View>
                </View>


                </ScrollView>
            </View>
    </View>
}};

class SettingsScreen extends React.Component {

static navigationOptions = ({navigation}) => ({
  headerTitle: 'Settings',
  headerTintColor: 'white',
  headerStyle: {
      backgroundColor: '#b18d77',
  },
  headerRight: 
  <HeaderButton
      title="Save"
      onPress={()=> {
              navigation.dispatch(NavigationActions.reset({
                  index: 0,
                  actions: [
                      NavigationActions.navigate({ routeName: 'ProfileScreen'})
                  ]
      }));
  }} />
})

render() {
  return <ScrollView style = {{
      backgroundColor: '#e6ddd1',
      flex: 1,
  }}>
    <Text style={{
      color: '#987057',
      marginLeft: 10,
      marginBottom: 5,
      marginTop: 15,
    }}>My Account</Text>

      <List style = {{borderBottomWidth:0, borderTopWidth: 0,}} >

        <NormalListItem
          title='Edit Account'
        />
        <NormalListItem
          title='Notifications'
        />

      </List>

    <Text>Options</Text>
    <List>

      <ListItem
      />
      <ListItem
      />
      <ListItem
      />
      <ListItem
      />
      <ListItem
      />
      <ListItem
      />
      <ListItem
      />

    </List> 

  </ScrollView>
}

}

class DefaultsScreen extends React.Component {

static navigationOptions = ({navigation}) => {
  const { state } = navigation;
  const params = state.params || {};
  return{
      headerTitle: 'Defaults',
      headerTintColor: 'white',
      headerStyle: {
          backgroundColor: '#b18d77',
      },
      headerRight: 
      <HeaderButton
          title="Save"
          onPress={params.handleSave}
      />
  }
}

constructor(props) {
  super(props)
  this.state = {
    coffeeshop: '',
    _coffeeshop: false,
    drinktype: '',
    _drinktype: false,
    coffeeorder: '',
    _coffeeorder: false,
    size: '',
    _size: false,
    dropoffloc: '',
    _dropoffloc: false,
    dropofftime: '',
    _dropofftime: false,
  }
  this.ref = null;

  this._handleSavePress = this._handleSavePress.bind(this);
}

_pullDefaultsDB() {
  const uid = firebase.auth().currentUser.uid
  this.ref = firebase.database().ref('defaults/' + uid)

  this.ref.once('value', (snapshot) => {
    this.setState({
      coffeeshop: snapshot.val().coffeeshop,
      _coffeeshop: snapshot.val()._coffeeshop,
      drinktype: snapshot.val().drinktype,
      _drinktype: snapshot.val()._drinktype,
      coffeeorder: snapshot.val().coffeeorder,
      _coffeeorder: snapshot.val()._coffeeorder,
      size: snapshot.val().size,
      _size: snapshot.val()._size,
      dropoffloc: snapshot.val().dropoffloc,
      _dropoffloc: snapshot.val()._dropoffloc,
      dropofftime: snapshot.val().dropofftime,
      _dropofftime: snapshot.val()._dropofftime,
    })
  })
}

_handleSavePress() {
  firebase.database().ref('defaults/' + firebase.auth().currentUser.uid)
  .update({
    coffeeshop: this.state.coffeeshop,
    _coffeeshop: this.state._coffeeshop,
    drinktype: this.state.drinktype,
    _drinktype: this.state._drinktype,
    coffeeorder: this.state.coffeeorder,
    _coffeeorder: this.state._coffeeorder,
    size: this.state.size,
    _size: this.state._size,
    dropoffloc: this.state.dropoffloc,
    _dropoffloc: this.state._dropoffloc,
    dropofftime: this.state.dropofftime,
    _dropofftime: this.state._dropofftime,
  });

  this.props
      .navigation
      .dispatch(NavigationActions.reset(
        {
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'ProfileScreen'})
          ]
        }));
}

componentWillMount() {
  this._pullDefaultsDB();
  this.props.navigation.setParams({ 
    handleSave: this._handleSavePress,
  });
}

render() {

  const coffeeshops = [
      { key: 1, section: true, label: 'Coffeeshops' },
      { key: 2, label: "Tim Horton's" },
      { key: 3, label: "William's" },
      { key: 4, label: "Starbucks" },
      { key: 5, label: "Second Cup" },
  ];
  const drinks = [
    { key: 1, section: true, label: 'Drink' },
    { key: 2, label: "Coffee" },
    { key: 3, label: "Tea" },
  ];
  const coffeeorders = [
    { key: 1, section: true, label: 'Order' },
    { key: 2, label: "Placeholder" },
    { key: 3, label: "Placeholder" },
    { key: 4, label: "Placeholder" },
    { key: 5, label: "Placeholder" },
  ];
  const sizes = [
    { key: 1, section: true, label: 'Size' },
    { key: 2, label: "Large" },
    { key: 3, label: "Medium" },
    { key: 4, label: "Small" },
  ];
  const locations = [
    { key: 1, section: true, label: 'Locations' },
    { key: 2, label: "Placeholder" },
    { key: 3, label: "Placeholder" },
    { key: 4, label: "Placeholder" },
    { key: 5, label: "Placeholder" },
  ];
  const times = [
    { key: 1, section: true, label: 'Time' },
    { key: 2, label: "Placeholder" },
    { key: 3, label: "Placeholder" },
    { key: 4, label: "Placeholder" },
    { key: 5, label: "Placeholder" },
  ];

  return <ScrollView style = {{
      backgroundColor: '#e6ddd1',
      flex: 1,
  }}>
    <List style = {{borderTopWidth: 0, borderBottomWidth: 0}}>
      <ToggleListItem
        title={'Coffeeshop:'}
        subtitle={
          <ModalPicker
              data={coffeeshops}
              initValue={this.state.coffeeshop}
              onChange={(option)=>{ this.setState({coffeeshop: option.label, _coffeeshop: true}) }}>
                  <TextInput
                      style={{marginLeft:20, height:35, width: 150,}}
                      editable={false}
                      value={this.state.coffeeshop} />
          </ModalPicker>}
        switched={this.state._coffeeshop}
        onSwitch={() => {
          if(this.state._coffeeshop){this.setState({_coffeeshop:false})} 
          else {this.setState({_coffeeshop:true})}          
        }}
      />

      <ToggleListItem
        title='Drink:'
        subtitle={
          <ModalPicker
              data={drinks}
              initValue={this.state.drinktype}
              onChange={(option)=>{ this.setState({drinktype: option.label, _drinktype: true}) }}>
                  <TextInput
                      style={{marginLeft:20, height:35, width: 150,}}
                      editable={false}
                      value={this.state.drinktype} />
          </ModalPicker>}
        switched={this.state._drinktype}
        onSwitch={() => {
          if(this.state._drinktype){this.setState({_drinktype:false})} 
          else {this.setState({_drinktype:true})} 
        }}
      />
      
      <ToggleListItem
        title='Order:'
        subtitle={
          <ModalPicker
              data={coffeeorders}
              initValue={this.state.coffeeorder}
              onChange={(option)=>{ this.setState({coffeeorder: option.label, _coffeeorder: true}) }}>
                  <TextInput
                      style={{marginLeft:20, height:35, width: 150,}}
                      editable={false}
                      value={this.state.coffeeorder} />
          </ModalPicker>}
        switched={this.state._coffeeorder}
        onSwitch={() => {
          if(this.state._coffeeorder){this.setState({_coffeeorder:false})} 
          else {this.setState({_coffeeorder : true})} 
        }}
      />
      
      <ToggleListItem
        title='Size:'
        subtitle={
          <ModalPicker
              data={sizes}
              initValue={this.state.size}
              onChange={(option)=>{ this.setState({size: option.label,_size: true}) }}>
                  <TextInput
                      style={{marginLeft:20, height:35, width: 150,}}
                      editable={false}
                      value={this.state.size} />
          </ModalPicker>}
        switched={this.state._size}
        onSwitch={() => {
          if(this.state._size){this.setState({_size:false})} 
          else {this.setState({_size : true})} 
        }}
      />
      
      <ToggleListItem
        title='Locations:'
        subtitle={
          <ModalPicker
              data={locations}
              initValue={this.state.dropoffloc}
              onChange={(option)=>{ this.setState({dropoffloc: option.label,_dropoffloc: true}) }}>
                  <TextInput
                      style={{marginLeft:20, height:35, width: 150,}}
                      editable={false}
                      value={this.state.dropoffloc} />
          </ModalPicker>}
        switched={this.state._dropoffloc}
        onSwitch={() => {
          if(this.state._dropoffloc){this.setState({_dropoffloc:false})} 
          else {this.setState({_dropoffloc : true})} 
        }}/>
      
      <ToggleListItem
        title='Time:'
        subtitle={
          <ModalPicker
              data={times}
              initValue={this.state.dropofftime}
              onChange={(option)=>{ this.setState({dropofftime: option.label,_dropofftime:true}) }}>
                  <TextInput
                      style={{marginLeft:20, height:35, width: 150,}}
                      editable={false}
                      value={this.state.dropofftime} />
          </ModalPicker>}
        switched={this.state._dropofftime}
        onSwitch={() => {
          if(this.state._dropofftime){this.setState({_dropofftime:false})} 
          else {this.setState({_dropofftime: true})} 
        }}
      />
      
    </List> 
  </ScrollView>
}

}

export default stackNav = StackNavigator(
  {
      ProfileScreen: {
          screen: ProfileScreen,
      },
      SettingsScreen: {
        screen: SettingsScreen,
      },
      DefaultsScreen: {
          screen: DefaultsScreen,
      },
  },
      {
          headerMode: 'screen',
          initialRouteName: 'ProfileScreen',
      }
  );


  const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },

});