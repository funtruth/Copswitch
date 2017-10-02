// app/router.js

import React from "react";
import { Platform, StatusBar, Image } from "react-native";
import { StackNavigator, TabNavigator } from "react-navigation";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import styles from "./app/styles/Styles";

import SignUp from "./app/loginscreens/SignUp";
import SignIn from "./app/loginscreens/SignIn";

import Lists from "./app/screens/ListsScreen";
import Room from "./app/screens/RoomScreen";
import Game from "./app/screens/MafiaScreen";
import Profile from "./app/screens/ProfileScreen";

export const SignedOut = StackNavigator(
  {
    SignIn: {
        screen: SignIn,
      },
    SignUp: {
      screen: SignUp,
    },
  },
    {
    headerMode: 'none',
    }
  );
  
  export const SignedIn = TabNavigator(
    {
      Lists: {
        screen: Lists,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name="assignment" style={styles.icon}/>
          ),
          
        }
      },
      Room: {
        screen: Room,
        navigationOptions : {
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name="home" style={styles.icon}/>
          ),
        }
      },
      Game: {
        screen: Game,
        navigationOptions : {
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name="gamepad" style={styles.icon}/>
          ),
        }
      },
      Profile: {
        screen: Profile,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name="person" style={styles.icon}/>
          ),
        }
      },
    },
    {
      tabBarPosition: 'bottom',
      tabBarOptions: {
        showIcon: true,
        showLabel: false,
        activeTintColor:'#9373d9',
        inactiveTintColor:'#9373d9',
        style: {
          backgroundColor: 'black',
        },
        indicatorStyle: {
          backgroundColor: 'white',
          height:5,
        }
      },
      initialRouteName: 'Room',
    }
  );
  
  export const createRootNavigator = (signedIn) => {
    
    return StackNavigator(
      {
        SignedIn: {
          screen: SignedIn,
          navigationOptions: {
            gesturesEnabled: false
          }
        },
        SignedOut: {
          screen: SignedOut,
          navigationOptions: {
            gesturesEnabled: false
          }
        }
      },
      {
        headerMode: "none",
        mode: "modal",
        initialRouteName: signedIn ? "SignedIn" : "SignedOut",
      }
    );
  };
