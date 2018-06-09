// app/router.js

import React from "react";
import { StackNavigator } from "react-navigation";

import Loading from '../appState/LoadingScreen';
import HomeNavigator from '../home/HomeNavigator';
import Lobby from '../lobby/LobbyView';
import Pregame from "../pregame/PregameScreen";
import Game from "../game/GameScreen";

const Router = StackNavigator(
      {
        Loading: {
          screen: Loading
        },
        HomeNav: {
          screen: HomeNavigator
        },
        Lobby: {
          screen: Lobby
        },
        Pregame:{
          screen: Pregame
        },
        Game: {
          screen: Game
        }
      },
      {
        headerMode: "none",
        initialRouteName: "Loading",
        cardStyle: {backgroundColor:'transparent'}
      }
);

export default Router