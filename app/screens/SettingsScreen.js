
import React from 'react';
import {
    Text,
    View,
    Button,
    Image,
    AsyncStorage,
    BackHandler
}   from 'react-native';

export default class SettingsScreen extends React.Component {

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