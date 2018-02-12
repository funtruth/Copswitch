// app/router.js

import React from "react";
import { StackNavigator } from "react-navigation";

import { Home, Loading } from "./app/screens/RoomScreen";

import { CreationPager } from './app/tutorials/RoomCreation.js';
import { Join1 } from './app/tutorials/RoomJoin.js';
import { LobbyPager } from './app/tutorials/RoomJoin.js';
import MafiaRoom from "./app/screens/MafiaScreen";

export const Layout = StackNavigator(
      {
        Loading: {
          screen: Loading
        },
        Home: {
          screen: Home
        },
        CreationTutorial: {
          screen: CreationPager
        },
        JoinTutorial: {
          screen: Join1
        },
        LobbyTutorial: {
          screen: LobbyPager
        },
        MafiaRoom: {
          screen: MafiaRoom
        },
      },
      {
        headerMode: "none",
        initialRouteName: "Loading",
        cardStyle: {backgroundColor:'transparent'}
      }
);
