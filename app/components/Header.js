import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return ( 
            <View style = {{flexDirection:'row', alignSelf:'center'}}>
                <TouchableOpacity onPress = {this.props.onPress}>
                    <MaterialCommunityIcons name='chevron-left'
                    style={{ color:colors.striker, fontSize: 30, alignSelf:'center'}}/>
                </TouchableOpacity>
                <Text style = {styles.header}>{this.props.title}</Text>
                
            </View>
        )
    }
}
