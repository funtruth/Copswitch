// app/router.js

import React from "react";
import { StackNavigator } from "react-navigation";

import Loading from '../home/LoadingScreen';
import Home from '../home/BasicHomeScreen';
import Lobby from '../lobby/BasicLobbyScreen';
import Mafia from "../game/MafiaScreen";

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