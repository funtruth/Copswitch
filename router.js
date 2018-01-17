// app/router.js

import React from "react";
import { Image, StyleSheet } from "react-native";
import { StackNavigator, TabNavigator } from "react-navigation";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Splash } from "./app/screens/LogIn";
import colors from './app/misc/colors.js';

import { Home, Loading } from "./app/screens/RoomScreen";
import Lists from "./app/screens/ListsScreen";

import MafiaRoom from "./app/screens/MafiaScreen";
import { Messages, Profile } from "./app/screens/DetailsScreen";

import { CreationPager, Creation1, Creation2, Creation3, Creation4, Creation5 } from './app/tutorials/RoomCreation.js';
import { Join1 } from './app/tutorials/RoomJoin.js';
import { LobbyPager, Lobby1, Lobby2 } from './app/tutorials/RoomJoin.js';

export const SignedOut = StackNavigator(
  {
    Splash: {
        screen: Splash,
      },
  },
    {
    headerMode: 'none',
    }
  );
  
export const SignedIn = TabNavigator(
    {
      Home: {
        screen: Home,
        navigationOptions : {
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name="home" style={styles.icon}/>
          ),
        }
      },
      Lists: {
        screen: Lists,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <MaterialCommunityIcons name="menu" style={styles.icon}/>
          ),
        }
      },
    },
    {
      tabBarOptions: {
        showIcon: true,
        showLabel: false,
        style: {
          backgroundColor: 'transparent',
          position:'absolute',
          bottom:0,
          left:0,
          right:0,
        },
        indicatorStyle: {
          backgroundColor: colors.indicatorcolor,
          height:5,
        }
      },
      initialRouteName: 'Home',
    }
);

export const CreationTutorial = StackNavigator(
  {
    CreationPager: {
      screen: CreationPager,
    }
  },
  {
    backBehavior: 'none',
    headerMode: 'none',
    initialRouteName: 'CreationPager',
  }
);

export const JoinTutorial = StackNavigator(
  {
    Join1: {
      screen: Join1,
    },
  },
  {
    backBehavior: 'none',
    headerMode: 'none',
    initialRouteName: 'Join1',
  }
);

export const LobbyTutorial = TabNavigator(
  {
    LobbyPager: {
      screen: LobbyPager,
      navigationOptions : {
        tabBarVisible: false,
      }
    },
  },
  {
    backBehavior: 'none',
    initialRouteName: 'LobbyPager',
  }
);

export const Mafia = TabNavigator(
  {
    MafiaRoom: {
      screen: MafiaRoom,
      navigationOptions : {
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="home" style={styles.darkicon}/>
        ),
      }
    },
    Messages: {
      screen: Messages,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons name="comment" style={styles.darkicon}/>
        ),
      }
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="person" style={styles.darkicon}/>
        ),
      }
    },
    Lists: {
      screen: Lists,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons name="menu" style={styles.darkicon}/>
        ),
      }
    },
  },
  {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      style: {
        backgroundColor: 'transparent',
        position:'absolute',
        bottom:0,
        left:0,
        right:0,
      },
      indicatorStyle: {
        backgroundColor: colors.tab,
        height:5,
      }
    },
    initialRouteName: 'MafiaRoom',
  }
);

export const createRootNavigator = (item,_function) => {

    return StackNavigator(
      {
        Loading: {
          screen: Loading,
          navigationOptions: {
            gesturesEnabled: false,
          }
        },
        SignedIn: {
          screen: SignedIn,
          navigationOptions: {
            gesturesEnabled: false
          }
        },
        CreationTutorial: {
          screen: CreationTutorial,
          navigationOptions: {
            gesturesEnabled: false,
          }
        },
        JoinTutorial: {
          screen: JoinTutorial,
          navigationOptions: {
            gesturesEnabled: false,
          }
        },
        LobbyTutorial: {
          screen: LobbyTutorial,
          navigationOptions: {
            gesturesEnabled: false,
          }
        },
        Mafia: {
          screen: Mafia,
          navigationOptions: {
            gesturesEnabled: false,
          }
        },
      },
      {
        headerMode: "none",
        mode: "modal",
        initialRouteName: "Loading",
        initialRouteParams: {_function:_function}
      }
    );
};


const styles = StyleSheet.create({
  icon: {
    height: 26,
    color: colors.iconcolor,
    fontSize: 20
  },
  lighticon: {
    height: 26,
    color: colors.font,
    fontSize: 20
  },
  darkicon: {
    height: 26,
    color: colors.tab,
    fontSize: 20
  },
});