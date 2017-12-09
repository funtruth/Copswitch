import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import colors from '../misc/colors.js';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomButton } from './CustomButton';

export class Pager extends React.Component {

constructor(props) {
    super(props);
}

render() {

    return ( 
        <View style = {{height:this.props.height, flexDirection:'row', justifyContent:'center'}}>
            <View style = {{flex:0.25, justifyContent:'center'}}>
                <CustomButton
                    size = {1}
                    flex = {0.8}
                    depth = {6}
                    color = {colors.lightbutton}
                    shadow = {colors.lightshadow}
                    radius = {15}
                    onPress = {this.props.goBack}
                    component = {
                        <MaterialCommunityIcons name='page-first' 
                            style={{ color:colors.main, fontSize: 30, alignSelf:'center'}}/>
                    }
                />
            </View>
            <View style = {{flex:0.25, justifyContent:'center',
                borderRadius:15, backgroundColor:colors.menubtn}}>
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',
                    fontSize: 25,
                    color: colors.font,
                    alignSelf:'center'
                }}>{this.props.page + '/' + this.props.lastpage}</Text>
            </View>
            <View style = {{flex:0.25, justifyContent:'center'}}>
                <CustomButton
                    size = {1}
                    flex = {0.8}
                    depth = {6}
                    color = {colors.lightbutton}
                    shadow = {colors.lightshadow}
                    radius = {15}
                    onPress = {this.props.goForward}
                    component = {
                        <MaterialCommunityIcons name='page-last' 
                            style={{ color:colors.main, fontSize: 30, alignSelf:'center' 
                        }}/>
                    }
                />
            </View>
        </View>
    )
}
}
