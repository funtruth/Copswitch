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
            <View style = {{height:60, flexDirection:'row', 
                position:'absolute',top:10,left:0,right:0}}>
                    <View style = {{flex:0.25, justifyContent:'center'}}><View style = {{flex:0.7}}>
                        <CustomButton
                            size = {1}
                            flex = {0.7}
                            depth = {6}
                            color = {colors.menubtn}
                            radius = {15}
                            onPress = {this.props.onPress}
                            component = {
                                <MaterialCommunityIcons name='keyboard-backspace' 
                                    style={{ color:colors.main, fontSize: 30, alignSelf:'center' 
                                }}/>
                            }
                        />
                    </View></View>
                <View style = {{flex:0.5, justifyContent:'center', alignItems:'center', 
                    backgroundColor:colors.menubtn, borderRadius: 30}}>
                    <Text style = {{
                        fontFamily:'ConcertOne-Regular',
                        fontSize: 25,
                        color: colors.main,
                    }}>{this.props.title}</Text>
                </View>
                <View style = {{flex:0.25}}/>

            </View>

            <View style = {{height:80}}/>
        </View>
    )
}
}
