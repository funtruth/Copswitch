import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../misc/colors.js';

export class HelperButton extends React.Component {

/*
This button is specifically designed for more customization

USED IN:
HOME SCREEN wifi button
*/

constructor(props) {
    super(props);

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;

    this.radius = this.width/3.5;

    this.icon = this.width/5 - 5;
    
    this.x = new Animated.Value((this.width - this.icon)/2);
    this.y = new Animated.Value((this.height - this.icon)/1.9-15);
    this.textOpacity = new Animated.Value(0);
}

componentWillReceiveProps(nextProps) {
    this._viewChange(nextProps.showOptions)
}

_viewChange(show){
    Animated.parallel([
        Animated.timing(
            this.x,{
                toValue:show?(this.width - this.icon)/2 + this.radius*Math.cos(this.props.degrees*2*Math.PI/360)
                :(this.width - this.icon)/2,
                duration:500
            }
        ),
        Animated.timing(
            this.y,{
                toValue:show?(this.height - this.icon)/1.9 + this.radius*Math.sin(this.props.degrees*2*Math.PI/360) - 15
                :(this.height - this.icon)/1.9 - 15,
                duration:500
            }
        )
    ]).start()

    Animated.timing(
        this.textOpacity,{
            toValue:1,
            duration:200,
            delay:1000
        }
    ).start()
}

render() {

    return (
        <Animated.View style = {{ position:'absolute', elevation:0, 
            left:this.x,
            bottom:this.y,
            alignItems:'center', justifyContent:'center',
            height:this.icon + 15, width:this.icon, borderRadius:this.icon/2,alignItems:'center'
        }}>
            <TouchableOpacity
                style = {{flex:1, justifyContent:'center',alignItems:'center',
                    height:this.icon, width:this.icon, borderRadius:this.icon/2, backgroundColor: this.props.color}}
                onPress = {this.props.onPress}
            >
                <MaterialCommunityIcons name={this.props.icon} style={{ 
                    color:colors.font, fontSize: this.icon/1.8
                }}/>
            </TouchableOpacity>

            <Animated.Text style = {{height:15, fontSize:13, opacity:this.textOpacity,
                textAlign:'center', color:colors.font}}>{this.props.title}</Animated.Text>
        </Animated.View>
    )
}
}
