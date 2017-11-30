import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import colors from '../misc/colors.js';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomButton } from './CustomButton';

export class Header extends React.Component {

constructor(props) {
    super(props);
}
      

render() {

    return ( 
        <View>
            <View style = {{height:50, flexDirection:'row', 
                position:'absolute',top:10,left:0,right:0}}>
                    <View style = {{flex:0.25, justifyContent:'center'}}>
                        <TouchableOpacity onPress = {this.props.onPress}>
                            <MaterialCommunityIcons name='chevron-left' 
                            style={{ color:colors.dshadow, fontSize: 30, alignSelf:'center'}}/>
                        </TouchableOpacity>
                    </View>
                <View style = {{flex:0.5, justifyContent:'center', alignItems:'center'}}>
                    <Text style = {{
                        fontFamily:'ConcertOne-Regular',
                        fontSize: 25,
                        color: colors.dshadow,
                    }}>{this.props.title}</Text>
                </View>
                <View style = {{flex:0.25}}/>

            </View>

            <View style = {{height:70}}/>
        </View>
    )
}
}