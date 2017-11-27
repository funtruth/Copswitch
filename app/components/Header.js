import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { View, TouchableOpacity, Text } from 'react-native';

import colors from '../misc/colors.js';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export class Header extends React.Component {

constructor(props) {
    super(props);
}
      

render() {

    return (
        <View style = {{height:60, flexDirection:'row', 
            position:'absolute',top:0,left:0,right:0}}>
            <TouchableOpacity style = {{flex:0.25, justifyContent:'center', alignItems:'center'}}
                onPress = {this.props.onPress}>
                <MaterialCommunityIcons name='keyboard-backspace' 
                    style={{ color:colors.main, fontSize: 30 }}/>
            </TouchableOpacity>
            <View style = {{flex:0.5, justifyContent:'center', alignItems:'center'}}>
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',
                    fontSize: 25,
                    color: colors.main,
                }}>{this.props.title}</Text>
            </View>
            <View style = {{flex:0.25}}/>

        </View>
    )
}
}
