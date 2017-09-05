
import React from 'react';
import {
    Text,
    View,
    Button,
    Image
}   from 'react-native';
//import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class JoinScreen extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Join',
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
                Join
            </Text>
            <Button
                onPress={() => this.props.navigation.navigate('DrawerOpen')}
                title="Open Drawer Navigator"
            />
        </View>

    }

}