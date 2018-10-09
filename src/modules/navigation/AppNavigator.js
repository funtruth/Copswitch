import { createStackNavigator } from "react-navigation";

import Loading from '../loading/LoadingScreen';
import HomeNavigator from './HomeNavigator';
import Lobby from '../lobby/LobbyView';
import Game from "../game/GameScreen";

import { fadeIn } from './navAnim'

const config = () => {
  return {
      // Define scene interpolation, eq. custom transition
      screenInterpolator: (sceneProps) => {
          const {position, scene} = sceneProps;
          const {index} = scene;

          return fadeIn(index, position);
      },
      transitionSpec: {
          duration: 300
      }
  }
};

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
        Game: {
          screen: Game
        }
      },
      {
        headerMode: "none",
        initialRouteName: "Loading",
        transitionConfig: config,
        cardStyle: {
          backgroundColor:'transparent'
        }
      }
);

export default Navigator