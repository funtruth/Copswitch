// app/router.js

import React from "react";
import { Platform, StatusBar } from "react-native";
import { StackNavigator, DrawerNavigator } from "react-navigation";
import { FontAwesome } from "react-native-vector-icons";

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
  
  export const SignedIn = DrawerNavigator(
    {
      Profile: {
        screen: Profile,
        navigationOptions: {
            drawerLabel: "Profile",
            tabBarIcon: ({ tintColor }) =>
            <FontAwesome name="user" size={30} color={tintColor} />
        }
      },
      Join: {
        screen: Join,
        navigationOptions: {
          tabBarLabel: "Home",
          tabBarIcon: ({ tintColor }) =>
            <FontAwesome name="home" size={30} color={tintColor} />
        }
      },
      Create: {
        screen: Create,
        navigationOptions: {
          tabBarLabel: "Create",
          tabBarIcon: ({ tintColor }) =>
            <FontAwesome name="home" size={30} color={tintColor} />
        }
      },
      Deliver: {
        screen: Deliver,
        navigationOptions: {
          tabBarLabel: "Deliver",
          tabBarIcon: ({ tintColor }) =>
            <FontAwesome name="user" size={30} color={tintColor} />
        }
      },
      Settings: {
        screen: Settings,
        navigationOptions: {
            drawerLabel: "Settings",
            tabBarLabel: "Settings",
            tabBarIcon: ({ tintColor }) =>
            <FontAwesome name="user" size={30} color={tintColor} />
        }
      },
      LogOut: {
        screen: SignIn,
        navigationOptions: {
            drawerLabel: "Log Out",
            //tabBarLabel: "Log Out",
            tabBarIcon: ({ tintColor }) =>
            <FontAwesome name="user" size={30} color={tintColor} />
        }
      },
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