// app/router.js

import React from "react";
import { Platform, StatusBar, Image } from "react-native";
import { StackNavigator, TabNavigator } from "react-navigation";

//import { FontAwesome } from "react-native-vector-icons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import styles from "./app/styles/Styles";

import SignUp from "./app/loginscreens/SignUp";
import SignIn from "./app/loginscreens/SignIn";
import CreateUsername from "./app/loginscreens/CreateUsername";

import Create from "./app/screens/CreateScreen";
import Deliver from "./app/screens/DeliveryScreen";
import Join from "./app/screens/JoinScreen";
import Profile from "./app/screens/ProfileScreen";
import Settings from "./app/screens/SettingsScreen";

const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

export const SignedOut = StackNavigator({
    SignIn: {
        screen: SignIn,
        navigationOptions: {
          title: "Sign In",
          headerStyle
        }
      },
    SignUp: {
      screen: SignUp,
      navigationOptions: {
        title: "Sign Up",
        headerStyle
      }
    },
    CreateUsername: {
      screen: CreateUsername,
      navigationOptions: {
        title: "Create User",
        headerStyle
      }
    },
  });
  
  export const SignedIn = TabNavigator(
    {
      Join: {
        screen: Join,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <Image 
                source={require('./app/images/coffee.png')}
                style={[styles.icon, {tintColor: tintColor}]}
            />
          ),
          
        }
      },
      Create: {
        screen: Create,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <Image 
                source={require('./app/images/gps.png')}
                style={[styles.icon, {tintColor: tintColor}]}
            />
          ),
          
        }
      },
      Deliver: {
        screen: Deliver,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <Image 
                source={require('./app/images/arrow.png')}
                style={[styles.icon, {tintColor: tintColor}]}
            />
          ),
          
        }
      },
      Profile: {
        screen: Profile,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <Image 
                source={require('./app/images/person.png')}
                style={[styles.icon, {tintColor: tintColor}]}
            />
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
          backgroundColor: '#8b6f4b',
          height:5,
        }
      }
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
        initialRouteName: signedIn ? "SignedIn" : "SignedOut"
      }
    );
  };
