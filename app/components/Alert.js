import React, { Component } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';

import colors from '../misc/colors.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomButton } from './CustomButton';

export class Alert extends React.Component {

    
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
                
                <View style = {{flex:0.3, justifyContent:'center', alignItems:'center'}}/>
                
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
                        backgroundColor = {colors.shadow}
                        onPress = {()=>{ this.props.onOkay() }}
                        title = {this.props.okay}
                    ><Text style = {styles.choiceButton}>{this.props.okay}</Text></CustomButton>
                    </View>
                    <View style = {{flex:0.05}}/>
                    <View style = {{flex:0.4}}><CustomButton
                        size = {0.7}
                        flex = {1}
                        backgroundColor = {colors.background}
                        onPress = {()=>this._cancel()}
                        ><Text style = {styles.choiceButton}>{this.props.cancel}</Text></CustomButton>
                    </View>
                </View>
            </View>
        </Animated.View>
    )
}
}
