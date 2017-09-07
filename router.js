// app/router.js

import React from "react";
import { Platform, StatusBar } from "react-native";
import { StackNavigator, TabNavigator } from "react-navigation";

import { FontAwesome } from "react-native-vector-icons";
//import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import styles from "./app/styles/Styles";

import SignUp from "./app/screens/SignUp";
import SignIn from "./app/screens/SignIn";

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
  });
  
  export const SignedIn = TabNavigator(
    {
      Profile: {
        screen: Profile,
        navigationOptions: {
          tabBarLabel: "Profile",
          tabBarIcon: ({ tintColor }) => <FontAwesome>{Icons.times}</FontAwesome>
        }
      },
      Join: {
        screen: Join,
        navigationOptions: {
          tabBarLabel: "Join",
          tabBarIcon: ({tintColor}) => (<MaterialIcons size={24} color="white" name="person" />)
        }
      },
      Create: {
        screen: Create,
        navigationOptions: {
          tabBarLabel: "Create",
          tabBarIcon: () => (<MaterialIcons size={24} color="white" name="person" />)
        }
      },
      Deliver: {
        screen: Deliver,
        navigationOptions: {
          tabBarLabel: "Deliver",
          tabBarIcon: () => (<MaterialIcons size={24} color="white" name="person" />)
        }
      },
      //Settings: {
      //  screen: Settings,
      //  navigationOptions: {
      //      tabBarLabel: "Settings",
      //      tabBarIcon: () => (<MaterialIcons size={24} color="white" name="person" />)
      //  }
      //},
    },
    {
      tabBarPosition: 'bottom',
      tabBarOptions: {
        style: {
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
        }
      }
    }
  );
  
  export const createRootNavigator = (signedIn = false) => {
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
