// app/router.js

import React from "react";
import { StackNavigator } from "react-navigation";

import { Home, Loading } from "./app/screens/RoomScreen";

import { Lobby } from './app/screens/LobbyScreen.js';
import Mafia from "./app/screens/MafiaScreen";

export const Layout = StackNavigator(
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
