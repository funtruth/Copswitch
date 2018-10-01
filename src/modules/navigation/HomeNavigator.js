import { createStackNavigator } from "react-navigation";

import HomeScreen from '../home/screens/HomeScreen'
import JoinSlide from '../home/screens/JoinSlide'
import CreateSlide from '../home/screens/CreateSlide'

const HomeNavigator = createStackNavigator(
    {
      Home: {
        screen: HomeScreen
      },
      Join: {
        screen: JoinSlide
      },
      Create:{
        screen: CreateSlide
      }
    },
    {
      headerMode: "none",
      initialRouteName: "Home",
      cardStyle: {backgroundColor:'transparent'}
    }
);

export default HomeNavigator