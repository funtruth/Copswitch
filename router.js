// app/router.js

import React from "react";
import { Platform, StatusBar, Image } from "react-native";
import { StackNavigator, TabNavigator } from "react-navigation";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import styles from "./app/styles/Styles";

import SignUp from "./app/loginscreens/SignUp";
import SignIn from "./app/loginscreens/SignIn";

import Rooms from "./app/screens/CreateScreen";
import Deliver from "./app/screens/DeliveryScreen";
import Profile from "./app/screens/ProfileScreen";
import Group from "./app/screens/GroupScreen.js";

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
      Rooms: {
        screen: Rooms,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name="home" style={styles.icon}/>
          ),
          
        }
      },
      Deliver: {
        screen: Deliver,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name="shopping-cart" style={styles.icon}/>
          ),
          
        }
      },
      Group: {
        screen: Group,
        navigationOptions : {
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name="group" style={styles.icon}/>
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
        activeTintColor:'#8b6f4b',
        inactiveTintColor:'#b89d7a',
        style: {
          backgroundColor: '#DECFC6',
        },
        indicatorStyle: {
          backgroundColor: '#b18d77',
          height:5,
        }
      },
      initialRouteName: 'Rooms',
    }
  );
  
  export const createRootNavigator = (signedIn = true) => {
    
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
