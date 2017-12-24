import React, { Component } from 'react';
import { View, Text } from 'react-native';

import colors from '../misc/colors.js';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomButton } from './CustomButton';

export class Pager extends React.Component {

constructor(props) {
    super(props);
}

/*
props.page refers to the page the user is allowed to navigate to
    This is ONLY RELEVANT for LISTSCREEN
props.currentpage refers to the page the user is CURRENTLY on
props.lastpage refers to the number of pages a certain section has
*/

render() {

    this.firstpage = this.props.currentpage==1;
    this.lastpage = this.props.currentpage == this.props.lastpage;
    this.forwardDisabled = this.props.page<=this.props.currentpage;

    return ( 
        <View style = {{height:this.props.height, flexDirection:'row', justifyContent:'center'}}>
            <View style = {{flex:0.25, justifyContent:'center'}}>
                {this.firstpage?null:<CustomButton
                    size = {1}
                    flex = {0.8}
                    depth = {6}
                    color = {colors.lightbutton}
                    shadow = {colors.lightshadow}
                    radius = {15} fontSize = {20}
                    onPress = {this.props.goBack}
                    title = 'I<'
                />}
            </View>
            <View style = {{flex:0.25, justifyContent:'center',
                borderRadius:15, backgroundColor:colors.shadow}}>
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',
                    fontSize: 25,
                    color: colors.font,
                    alignSelf:'center'
                }}>{this.props.currentpage + '/' + this.props.lastpage}</Text>
            </View>
            <View style = {{flex:0.25, justifyContent:'center'}}>
                {this.lastpage?null:<CustomButton
                    size = {1}
                    flex = {0.8}
                    depth = {6}
                    color = {colors.lightbutton}
                    shadow = {colors.lightshadow}
                    radius = {15} fontSize = {20}
                    onPress = {this.props.goForward}
                    disabled = {this.forwardDisabled}
                    opacity = {this.forwardDisabled?0.5:1}
                    title = '>I'
                />}
            </View>
        </View>
    )
}
}
