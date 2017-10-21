
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    Text,
    ListView,
    FlatList,
    TouchableOpacity
}   from 'react-native';

import { Button, List, ListItem, Avatar } from "react-native-elements";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//Firebase
import firebase from '../firebase/FirebaseController.js';

export default class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    
    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {

      role: '',
      description: '',

      roomname:'',
      messages: dataSource,

    }

  }

componentWillMount() {
}

componentWillUnmount() {

}

  render(){
    return <View style={{
              flex: 1,
              backgroundColor: 'white',
              justifyContent:'center',
              alignItems:'center',
          }}>

              <Text>Coming Soon</Text>
    </View>
}};
