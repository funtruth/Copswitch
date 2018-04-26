// app/router.js

import React from "react";
import { StackNavigator } from "react-navigation";

import Lobby from '../lobby/BasicLobbyScreen.js';
import Home from '../home/BasicHomeScreen.js';
import Loading from '../home/LoadingScreen.js';
import Mafia from "../screens/MafiaScreen";

const Router = StackNavigator(
      {
        Loading: {
          screen: Loading
        },
        Home: {
          screen: Home
        },
        Lobby: {
          screen: Lobby
        },
        Mafia: {
          screen: Mafia
        },
      },
      {
        headerMode: "none",
        initialRouteName: "Loading",
        cardStyle: {backgroundColor:'transparent'}
      }
);

export default Router