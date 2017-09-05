// app/router.js

import React from "react";
import { Platform, StatusBar } from "react-native";
import { StackNavigator, DrawerNavigator } from "react-navigation";
import { FontAwesome } from "react-native-vector-icons";

import SignUp from "./app/screens/SignUp";
import SignIn from "./app/screens/SignIn";
//import Create from "./app/screens/CreateScreen";
//import Deliver from "./app/screens/DeliveryScreen";
import Join from "./app/screens/JoinScreen";
import Profile from "./app/screens/ProfileScreen";

const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

export const SignedOut = StackNavigator({
    SignUp: {
      screen: SignUp,
      navigationOptions: {
        title: "Sign Up",
        headerStyle
      }
    },
    SignIn: {
      screen: SignIn,
      navigationOptions: {
        title: "Sign In",
        headerStyle
      }
    }
  });
  
  export const SignedIn = DrawerNavigator(
    {
      Join: {
        screen: Join,
        navigationOptions: {
          tabBarLabel: "Home",
          tabBarIcon: ({ tintColor }) =>
            <FontAwesome name="home" size={30} color={tintColor} />
        }
      },
      Profile: {
        screen: Profile,
        navigationOptions: {
          tabBarLabel: "Profile",
          tabBarIcon: ({ tintColor }) =>
            <FontAwesome name="user" size={30} color={tintColor} />
        }
      }
    },
    {
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