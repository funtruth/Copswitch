import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';

import colors from '../misc/colors.js';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomButton } from './CustomButton';

export class Alert extends React.Component {

    
constructor(props) {
    super(props);

    this.state = {
        opacity: new Animated.Value(1),
    }

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
}

_cancel() {
    Animated.timing(
        this.state.opacity,{
            toValue:0,
            duration:200
        }
    ).start()

    setTimeout(()=>{
        this.props.onCancel()
        Animated.timing(
            this.state.opacity,{
                toValue:1,
                duration:50
            }
        ).start()
    },250)
}

render() {

    if(!this.props.visible){
        return null
    }

    return ( 
        <Animated.View style = {{position:'absolute', top:0, bottom:0, left:0, right:0,
            backgroundColor:'rgba(0, 0, 0, 0.5)', opacity:this.state.opacity,
            justifyContent:'center', alignItems:'center'}}>
            <View style = {{height:this.height*0.4, width:this.width*0.9,
                backgroundColor:colors.shadow, borderRadius:20}}>
                <View style = {{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                    <Text style = {{
                        fontSize:25,
                        fontFamily:'ConcertOne-Regular',
                        color:colors.font
                    }}>{this.props.title}</Text>
                </View>
                <View style = {{flex:0.5, justifyContent:'center', alignItems:'center',
                    backgroundColor:colors.background}}>
                    <Text style = {{
                        fontSize:20,
                        fontFamily:'ConcertOne-Regular',
                        color:colors.shadow
                    }}>{this.props.subtitle}</Text>
                </View>
                <View style = {{flex:0.3, flexDirection:'row',
                    justifyContent:'center', alignItems:'center'}}>
                    <View style = {{flex:0.4}}><CustomButton
                        size = {0.7}
                        flex = {1}
                        depth = {3}
                        radius = {15}
                        color = {colors.menubtn}
                        onPress = {()=>{ this.props.onOkay() }}
                        component = {<Text style = {{
                            fontSize: 20,
                            fontFamily: 'ConcertOne-Regular',
                            textAlign:'center',
                            color: colors.font,
                        }}>{this.props.okay}</Text>}
                    /></View>
                    <View style = {{flex:0.05}}/>
                    <View style = {{flex:0.4}}><CustomButton
                        size = {0.7}
                        flex = {1}
                        depth = {3}
                        radius = {15}
                        color = {colors.background}
                        onPress = {()=>this._cancel()}
                        component = {<Text style = {{
                            fontSize: 20,
                            fontFamily: 'ConcertOne-Regular',
                            textAlign:'center',
                            color: colors.shadow,
                        }}>{this.props.cancel}</Text>}
                    /></View>
                </View>
            </View>
        </Animated.View>
    )
}
}
