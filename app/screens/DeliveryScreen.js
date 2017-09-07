
import React from 'react';
import {
    Text,
    View,
    Button,
    Image
}   from 'react-native';
//import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default ({ navigation }) => (
        <View style={
            {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }
        }>
            <Text style={{fontSize: 30, color: 'red'}}>
                Deliver
            </Text>
        </View>
);