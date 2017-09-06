
import React from 'react';
import {
    Text,
    View,
    Button,
    Image,
    AsyncStorage,
    BackHandler
}   from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class SettingsScreen extends React.Component {

    currentRouteName = 'Settings';

    render(){
        return <View style={
            {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }
        }>
            <Text style={{fontSize: 30, color: 'blue'}}>
                Settings
            </Text>
        </View>

    }

}