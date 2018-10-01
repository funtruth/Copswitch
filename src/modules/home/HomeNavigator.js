import { createStackNavigator } from "react-navigation";

import HomeScreen from './screens/HomeScreen'
import JoinSlide from './screens/JoinSlide'
import CreateSlide from './screens/CreateSlide'

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