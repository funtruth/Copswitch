'use strict';
import React, { Component } from 'react';
import firebase from './FirebaseController.js';
import {
  AppRegistry,
  Text,
  View,
  Navigator,
  AsyncStorage
} from 'react-native';
import {TabNavigator} from 'react-navigation';

import styles from './styles/Styles.js';


//import Firebase from 'firebase';
//let app = new Firebase("Huddle.firebaseio.com");


//Drawer
import ProfileScreen from './screens/ProfileScreen.js';
import SettingsScreen from './screens/SettingsScreen.js';
import CreateScreen from './screens/CreateScreen.js';
import JoinScreen from './screens/JoinScreen.js';
import DeliveryScreen from './screens/DeliveryScreen.js';

const DrawerNavigation = TabNavigator(
  {
    Profile: {
        screen: ProfileScreen,
    },
    Create: {
      screen: CreateScreen,
    },
    Join: {
      screen: JoinScreen,
    },
    Deliver: {
      screen: DeliveryScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
  {
    initialRouteName: 'Profile',
    drawerPosition: 'left'
  }
);

export default DrawerNavigation;
