import React, { Component } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';

import colors from '../misc/colors.js';
import { CustomButton } from './CustomButton';

export class Console extends React.Component {

    
constructor(props) {
    super(props);

    this.opacity = new Animated.Value(0);

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
}

_cancel() {
    Animated.timing(
        this.opacity,{
            toValue:0,
            duration:200
        }
    ).start()

    this.props.onCancel()
}

_show() {
    Animated.timing(
        this.opacity,{
            toValue:1,
            duration:300
        }
    ).start()
}

componentWillReceiveProps(newProps){
    if(newProps.visible){
        this._show()
    }
}

render() {

    if(!this.props.visible){
        return null
    }

    return ( 
        <Animated.View style = {{position:'absolute', top:0, bottom:0, left:0, right:0,
            backgroundColor:'rgba(0, 0, 0, 0.3)', opacity:this.opacity,
            justifyContent:'center', alignItems:'center'}}>
            <View style = {{height:this.height*0.25, width:this.width*0.9,
                backgroundColor:colors.background, borderRadius:20}}>

                <View style = {{flex:0.3, justifyContent:'center', alignItems:'center'}}>
                    <Text style = {{
                        fontSize:20,
                        fontFamily:'LuckiestGuy-Regular',
                        color:colors.font
                    }}>{this.props.title}</Text>
                </View>
                
                <View style = {{flex:0.35, justifyContent:'center', alignItems:'center'}}>
                    <Text style = {{
                        fontSize:20,
                        fontFamily:'LuckiestGuy-Regular',
                        color:colors.font
                    }}>{this.props.subtitle}</Text>
                </View>
                <View style = {{flex:0.35, flexDirection:'row',
                    justifyContent:'center', alignItems:'center'}}>
                    <View style = {{flex:0.4}}><CustomButton
                        size = {0.7}
                        flex = {1}
                        depth = {3}
                        radius = {15}
                        fontSize = {20}
                        color = {colors.shadow}
                        onPress = {()=>{ this.props.onOkay() }}
                        title = {this.props.okay}
                    /></View>
                    <View style = {{flex:0.05}}/>
                    <View style = {{flex:0.4}}><CustomButton
                        size = {0.7}
                        flex = {1}
                        depth = {3}
                        radius = {15}
                        fontSize = {20}
                        color = {colors.background}
                        shadow = {colors.background}
                        onPress = {()=>this._cancel()}
                        title = {this.props.cancel}
                    /></View>
                </View>
            </View>
        </Animated.View>
    )
}
}
