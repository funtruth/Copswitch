// app/router.js

import React from "react";
import { Image, StyleSheet } from "react-native";
import { StackNavigator, TabNavigator } from "react-navigation";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Splash } from "./app/loginscreens/LogIn";
import colors from './app/misc/colors.js';

import Lists from "./app/screens/ListsScreen";
import Room from "./app/screens/RoomScreen";

import { Creation1, Creation2, Creation3, Creation4 } from './app/tutorials/RoomCreation.js';

export const SignedOut = StackNavigator(
  {
    Splash: {
        screen: Splash,
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
          //tabBarVisible: false,
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
      //swipeEnabled: false,
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

export const Creation = TabNavigator(
  {
    Creation1: {
      screen: Creation1,
      navigationOptions : {
        tabBarVisible: false,
      }
    },
    Creation2: {
      screen: Creation2,
      navigationOptions: {
        tabBarVisible: false,
      }
    },
    Creation3: {
      screen: Creation3,
      navigationOptions: {
        tabBarVisible: false,
      }
    },
    Creation4: {
      screen: Creation4,
      navigationOptions: {
        tabBarVisible: false,
      }
    },
  },
  {
    //swipeEnabled: false,
    backBehavior: 'none',
    initialRouteName: 'Creation1',
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
        },
        Creation: {
          screen: Creation,
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