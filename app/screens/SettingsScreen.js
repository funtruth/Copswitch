
import React from 'react';
import {
    Text,
    View,
    Button,
    Image
}   from 'react-native';
//mport MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Settings',
        //drawerIcon: () => {
        //    return (
        //        <MaterialIcons
        //            name="card-membership"
        //            size={24}
        //            style={{color: tintColor}}
        //        >
        //        </MaterialIcons>
        //    )
        //}
    }

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