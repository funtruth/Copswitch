import { createStackNavigator } from "react-navigation";

import Loading from '../loading/LoadingScreen';
import HomeNavigator from './HomeNavigator';
import Lobby from '../lobby/LobbyView';
import Pregame from "../pregame/PregameScreen";
import Game from "../game/GameScreen";

const Navigator = createStackNavigator(
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

export default Navigator