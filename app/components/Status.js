import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import Rolesheet from '../misc/roles.json';

const FADEOUT_ANIM = 300;
const SIZE_ANIM = 500;
const FADEIN_ANIM = 600;

const MARGIN = 10;

export class Status extends React.Component {

constructor(props) {
    super(props);

    this.state = {

        role: 'A',
        rules:'',
        win:'',

        width: new Animated.Value(1),
    }

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
}

componentDidMount(){
    
}

componentWillReceiveProps(newProps){
    if(newProps.loading != this.props.loading){
        this._show(newProps.loading)
    } else if(newProps.ready != this.props.ready){
        this._blink()
    }
}

_blink(){
    Animated.sequence([
        Animated.timing(
            this.state.width, {
                duration:300,
                toValue:this.width*0.25
            }
        ),
        Animated.timing(
            this.state.width, {
                duration:300,
                delay:2000,
                toValue:1
            }
        )
    ]).start()
}
_show(show){
    Animated.timing(
        this.state.width, {
            duration:300,
            toValue:show?this.width*0.25:1
        }
    ).start()
}

render() {

    return (
        <Animated.View style = {{
            position:'absolute', left:-1, top:MARGIN*2, height:this.height*0.1,
            justifyContent:'center', alignItems:'center', 
            backgroundColor:this.props.loading?colors.shadow:this.props.ready?colors.color5:colors.color4
        }}>
            <Text style = {[styles.readyStatus,{width:this.state.width}]}>READY</Text>
            <MaterialCommunityIcons name='circle' style={{color:colors.font, fontSize:26, width:this.width*0.1}}/>
            
        </Animated.View>
    )
}
}
