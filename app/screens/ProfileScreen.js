
import React from 'react';
import {
    Text,
    View,
    Button,
    Image
}   from 'react-native';
//import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class ProfileScreen extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Profile',
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
            <Text style={{fontSize: 30, color: 'green'}}>
                Profile
            </Text>
            <Button
                onPress={() => this.props.navigation.navigate('DrawerOpen')}
                title="Open Drawer Navigator"
            />
        </View>

    }

}