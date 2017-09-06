
import React from 'react';
import {
    Text,
    View,
    Button,
    Image
}   from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
            <Button
                onPress={() => this.props.navigation.navigate('DrawerOpen')}
                title="Open Drawer Navigator"
            />
        </View>

    }

}