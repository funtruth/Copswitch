// app/router.js

import React from "react";
import { Image, StyleSheet } from "react-native";
import { StackNavigator, TabNavigator } from "react-navigation";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Splash, SignUp, SignIn } from "./app/loginscreens/LogIn";
import colors from './app/misc/colors.js';

import Lists from "./app/screens/ListsScreen";
import Room from "./app/screens/RoomScreen";

export const SignedOut = StackNavigator(
  {
    Splash: {
        screen: Splash,
      },
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
      Room: {
        screen: Room,
        navigationOptions : {
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name="gamepad" style={styles.icon}/>
          ),
        }
      },
      Lists: {
        screen: Lists,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <MaterialCommunityIcons name="book-open-variant" style={styles.icon}/>
          ),
          
        }
      },
    },
    {
      tabBarPosition: 'bottom',
      tabBarOptions: {
        showIcon: true,
        showLabel: false,
        style: {
          backgroundColor: colors.tabbackground,
        },
        indicatorStyle: {
          backgroundColor: colors.indicatorcolor,
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
            gesturesEnabled: false,
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


const styles = StyleSheet.create({
  icon: {
    height: 26,
    color: colors.iconcolor,
    fontSize: 20
  },
});