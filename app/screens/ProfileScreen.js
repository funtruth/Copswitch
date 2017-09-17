
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
  this.state.uid = firebase.auth().currentUser.uid
  this.ref = firebase.database().ref("users/" + this.state.uid)

  this.ref.once('value',snapshot => {
    this.setState({
      username: snapshot.val().username,
      email: snapshot.val().email,
    })
  })
}

  render(){
    return <View style={{
              flex: 1,
              backgroundColor: '#e6ddd1',
          }}>
            
            <View style = {{
              flex: 1,
              alignItems: 'center'
            }}>
              <Avatar
                large
                rounded
                containerStyle={{
                  marginTop: 15,
                  borderWidth: 2,
                  borderColor: '#b18d77',
                }}
              />
              <Text style={{ color:'#b18d77', fontSize: 24}}>{this.state.username}</Text>
              <Text style={{ color: '#b18d77', fontSize: 12}}>{this.state.email}</Text>
              
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
    <Text>My Account</Text>
    <List>

      <ListItem
        title='placeholder'
        hideChevron={true}
        switchButton={true}
        onSwitch={() => {
          alert('test')
        }}
      />
      <ListItem
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

  let index = 0;
  const shops = [
      { key: index++, section: true, label: 'Coffeeshops' },
      { key: index++, label: "Tim Horton's" },
      { key: index++, label: "William's" },
      { key: index++, label: "Starbucks" },
      { key: index++, label: "Second Cup" },
  ];

  return <ScrollView style = {{
      backgroundColor: '#e6ddd1',
      flex: 1,
  }}>
    <List style = {{borderTopWidth: 0, borderBottomWidth: 0}}>
      <ToggleListItem
        title={'Coffeeshop:'}
        datalist={shops}
        pickertype={this.state.coffeeshop}
        switched={this.state._coffeeshop}
        onSwitch={() => {
          if(this.state._coffeeshop){this.setState({_coffeeshop:false})} 
          else {this.setState({_coffeeshop:true})}          
        }}
      />

      <ToggleListItem
        title='Drink:'
        datalist={shops}
        pickertype={this.state.drinktype}
        switched={this.state._drinktype}
        onSwitch={() => {
          if(this.state._drinktype){this.setState({_drinktype:false})} 
          else {this.setState({_drinktype:true})} 
        }}
      />
      
      <ToggleListItem
        title='Order:'
        datalist={shops}
        pickertype={this.state.coffeeorder}
        switched={this.state._coffeeorder}
        onSwitch={() => {
          if(this.state._coffeeorder){this.setState({_coffeeorder:false})} 
          else {this.setState({_coffeeorder : true})} 
        }}
      />
      
      <ToggleListItem
        title='Size:'
        datalist={shops}
        pickertype={this.state.size}
        switched={this.state._size}
        onSwitch={() => {
          if(this.state._size){this.setState({_size:false})} 
          else {this.setState({_size : true})} 
        }}
      />
      
      <ToggleListItem
        title='Locations:'
        datalist={shops}
        pickertype={this.state.dropoffloc}
        switched={this.state._dropoffloc}
        onSwitch={() => {
          if(this.state._dropoffloc){this.setState({_dropoffloc:false})} 
          else {this.setState({_dropoffloc : true})} 
        }}/>
      
      <ToggleListItem
        title='Time:'
        datalist={shops}
        pickertype={this.state.dropofftime}
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