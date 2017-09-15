
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    BackHandler,
    Text,
    ScrollView,
    StyleSheet
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import { Button, List, ListItem, Avatar } from "react-native-elements";
import ProfileButton from '../components/ProfileButton.js';
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
      username:null,
      email:null,
      loading: true,
    }
    this.ref = null;
  }

componentWillMount() {
  //Grabs the username and email of current user
  const uid = firebase.auth().currentUser.uid
  this.ref = firebase.database().ref("users/" + uid)

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

static navigationOptions = {
  headerTitle: 'Settings',
  headerTintColor: 'white',
  headerStyle: {
      backgroundColor: '#b18d77',
  }
}

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

static navigationOptions = {
  headerTitle: 'Defaults',
  headerTintColor: 'white',
  headerStyle: {
      backgroundColor: '#b18d77',
  }
}

render() {
  return <ScrollView style = {{
      backgroundColor: '#e6ddd1',
      flex: 1,
  }}>
    <Text>Choose Defaults</Text>
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