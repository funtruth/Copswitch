
import React from 'react';
import {
    Text,
    View,
    Button,
    Image,
    BackHandler
}   from 'react-native';
//import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class JoinScreen extends React.Component {

    constructor(props) {
        super(props);
        this.backButtonListener = null;
        this.currentRouteName = 'Join';
      }

      componentWillMount() {
        this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', () => {
          if (this.currentRouteName !== 'Join') {
              return false;
          }
            this.props.navigation.navigate('Join');
            return true;
      });
    }
    
      componentWillUnmount() {
        this.backButtonListener.remove();
      }

    render(){
        return <View style={
            {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }
        }>
            <Text style={{fontSize: 30, color: 'green'}}>
                Join
            </Text>
            <Button
                onPress={() => navigation.navigate('DrawerOpen')}
                title="Open Drawer Navigator"
            />
        </View>}
    };