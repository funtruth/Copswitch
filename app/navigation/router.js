// app/router.js
import { StackNavigator } from "react-navigation";

import Loading from '../scenes/appState/LoadingScreen';
import HomeNavigator from '../scenes/home/HomeNavigator';
import Lobby from '../scenes/lobby/LobbyView';
import Pregame from "../scenes/pregame/PregameScreen";
import Game from "../scenes/game/GameScreen";

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