
import React from 'react';
import {
    Text,
    View,
    Button,
    Image
}   from 'react-native';

export default ({ navigation }) => (
        <View style={
            {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }
        }>
            <Text style={{fontSize: 30, color: 'red'}}>
                Create
            </Text>
            <Button
                onPress={() => navigation.navigate('DrawerOpen')}
                title="Open Drawer Navigator"
            />
        </View>
);