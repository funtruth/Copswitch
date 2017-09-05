
import React from 'react';
import {
    Text,
    View,
    Button,
    Image
}   from 'react-native';

export default ({ navigation }) => {
        <View style={
            {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }
        }>
            <Text style={{fontSize: 30, color: 'green'}}>
                Create
            </Text>
            <Button
                onPress={() => this.props.navigation.navigate('DrawerOpen')}
                title="Open Drawer Navigator"
            />
        </View>
}