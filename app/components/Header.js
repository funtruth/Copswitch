import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomButton } from './CustomButton';

export class Header extends React.Component {

constructor(props) {
    super(props);

    this.height = Dimensions.get('window').height;
}
      

render() {

    return ( 
        <View style = {{flexDirection:'row', alignItems:'center'}}>
            <TouchableOpacity onPress = {this.props.onPress}>
                <MaterialCommunityIcons name='chevron-left'
                style={{ color:colors.font, fontSize: 30, alignSelf:'center'}}/>
            </TouchableOpacity>
            <Text style = {styles.header}>{this.props.title}</Text>
            
        </View>
    )
}
}
