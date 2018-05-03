// app/router.js

import React from "react";
import { StackNavigator } from "react-navigation";

import Loading from '../home/LoadingScreen';
import Home from '../home/BasicHomeScreen';
import Lobby from '../lobby/BasicLobbyScreen';
import Pregame from "../game/PregameScreen";
import Game from "../game/GameScreen";

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
        Pregame:{
          screen: Pregame
        },
        Game: {
          screen: Game
        },
      },
      {
        headerMode: "none",
        initialRouteName: "Loading",
        cardStyle: {backgroundColor:'transparent'}
      }
);

export default Router