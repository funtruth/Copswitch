import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';

import colors from '../misc/colors.js';
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
        <View style = {{height:this.height*0.1, flexDirection:'row', marginTop:10}}>
            <View style = {{flex:0.15, justifyContent:'center'}}>
                <TouchableOpacity onPress = {this.props.onPress}>
                    <MaterialCommunityIcons name='chevron-left' 
                    style={{ color:colors.shadow, fontSize: 30, alignSelf:'center'}}/>
                </TouchableOpacity>
            </View>
            <View style = {{flex:0.7, justifyContent:'center', alignItems:'center'}}>
                <Text style = {{
                    fontFamily:'Bungee-Regular',
                    fontSize: 25,
                    color: colors.shadow,
                }}>{this.props.title}</Text>
            </View>
            <View style = {{flex:0.15}}/>

        </View>
    )
}
}
