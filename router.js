// app/router.js

import React from "react";
import { Image, StyleSheet } from "react-native";
import { StackNavigator, TabNavigator } from "react-navigation";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Splash } from "./app/screens/LogIn";
import colors from './app/misc/colors.js';

import Room from "./app/screens/RoomScreen";
import { Expired_Screen } from "./app/screens/RoomScreen";
import Lists from "./app/screens/ListsScreen";

import MafiaRoom from "./app/screens/MafiaScreen";
import { Messages, Profile } from "./app/screens/DetailsScreen";

import { Creation1, Creation2, Creation3, Creation4, Creation5 } from './app/tutorials/RoomCreation.js';
import { Join1, Join2 } from './app/tutorials/RoomJoin.js';

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
      Room: {
        screen: Room,
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
      tabBarPosition: 'bottom',
      tabBarOptions: {
        showIcon: true,
        showLabel: false,
        style: {
          backgroundColor: colors.tabbackground,
        },
        indicatorStyle: {
          backgroundColor: colors.indicatorcolor,
          height:5,
        }
      },
      initialRouteName: 'Room',
    }
);

export const CreationTutorial = TabNavigator(
  {
    Creation1: {
      screen: Creation1,
      navigationOptions : {
        tabBarVisible: false,
      }
    },
    Creation2: {
      screen: Creation2,
      navigationOptions: {
        tabBarVisible: false,
      }
    },
    Creation3: {
      screen: Creation3,
      navigationOptions: {
        tabBarVisible: false,
      }
    },
    Creation4: {
      screen: Creation4,
      navigationOptions: {
        tabBarVisible: false,
      }
    },
    Creation5: {
      screen: Creation5,
      navigationOptions: {
        tabBarVisible: false,
      }
    },
  },
  {
    backBehavior: 'none',
    initialRouteName: 'Creation1',
  }
);

export const JoinTutorial = TabNavigator(
  {
    Join1: {
      screen: Join1,
      navigationOptions : {
        tabBarVisible: false,
      }
    },
    Join2: {
      screen: Join2,
      navigationOptions: {
        tabBarVisible: false,
      }
    },
  },
  {
    backBehavior: 'none',
    initialRouteName: 'Join1',
  }
);

export const Mafia = TabNavigator(
  {
    MafiaRoom: {
      screen: MafiaRoom,
      navigationOptions : {
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="home" style={styles.icon}/>
        ),
      }
    },
    Messages: {
      screen: Messages,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons name="comment" style={styles.icon}/>
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
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="person" style={styles.icon}/>
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
        backgroundColor: colors.tabbackground,
      },
      indicatorStyle: {
        backgroundColor: colors.indicatorcolor,
        height:5,
      }
    },
    initialRouteName: 'MafiaRoom',
  }
);

export const createRootNavigator = (signedIn, inGame) => {
    
    return StackNavigator(
      {
        SignedIn: {
          screen: SignedIn,
          navigationOptions: {
            gesturesEnabled: false
          }
        },
        SignedOut: {
          screen: SignedOut,
          navigationOptions: {
            gesturesEnabled: false,
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
        Mafia: {
          screen: Mafia,
          navigationOptions: {
            gesturesEnabled: false,
          }
        },
        Expired: {
          screen: Expired_Screen,
          navigationOptions: {
            gesturesEnabled: false,
          }
        },
      },
      {
        headerMode: "none",
        mode: "modal",
        initialRouteName: signedIn ? (inGame?"Expired":"SignedIn") : "SignedOut",
      }
    );
};


const styles = StyleSheet.create({
  icon: {
    height: 26,
    color: colors.iconcolor,
    fontSize: 20
  },
});