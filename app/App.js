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
import {DrawerNavigator} from 'react-navigation';

//import Firebase from 'firebase';

//let app = new Firebase("Huddle.firebaseio.com");

import styles from './styles/Styles.js';


//Drawer
import FirstScreen from './screens/FirstScreen.js';
import SecondScreen from './screens/SecondScreen.js';

const DrawerExample = DrawerNavigator(
  {
    First: {
        screen: FirstScreen,
    },
    Second: {
        screen: SecondScreen,
    },
  },
  {
    initialRouteName: 'First',
    drawerPosition: 'left'
  }
);

export default DrawerExample;
