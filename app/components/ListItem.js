import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import colors from '../misc/colors.js';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomButton } from './CustomButton';

export class ListItem extends React.Component {

constructor(props) {
    super(props);

    this.show = true;
}
      

render() {

    if(this.props.page < this.props.index){
        this.show = false;
    }

    return ( 
        <TouchableOpacity
            style = {{flex:this.props.flex, flexDirection:'row', opacity:this.show?1:0.5}}
            onPress = {this.props.onPress}
            disabled = {!this.show}>  
            <View style = {{flex:0.2, alignItems:'center', justifyContent:'center'}}>
                <MaterialCommunityIcons name={this.show?this.props.icon:'lock'}
                style={{color:colors.font,fontSize:30}}/>
            </View>
            <View style = {{flex:0.8, justifyContent:'center'}}>
                <Text style = {{
                    fontSize: this.props.fontSize,
                    fontFamily: 'ConcertOne-Regular',
                    marginLeft:20,
                    color: colors.font,
                }}>{this.props.title}</Text>
            </View>
        </TouchableOpacity>
    )
}
}
