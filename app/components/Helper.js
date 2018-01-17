import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity } from 'react-native';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AnimatableIcon = Animatable.createAnimatableComponent(FontAwesome)
const FAST_ANIM = 100;
const MED_ANIM = 400;

export class Helper extends React.Component {
    
constructor(props) {
    super(props);

    this.radiusScale = new Animated.Value(20)

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;

    this.icon = this.width/4;
    
}

componentWillReceiveProps(nextProps) {
    this._transition(nextProps.loading)
}

componentWillMount(){
    this._transition(false)
}

_transition(cover){
    Animated.timing(
        this.radiusScale,{
            toValue:cover?20:1,
            duration:1000
        }
    ).start()
}


render() {

    return ( 
        <View style = {{position:'absolute', left:0, right:0, bottom:0, top:0,
            justifyContent:'center', alignItems:'center'}}>
            <Animated.View style = {{position:'absolute',
                height:this.icon, width:this.icon, borderRadius:this.icon/2, backgroundColor: colors.shadow,
                justifyContent:'center', alignItems:'center',
                transform: [
                    {scale:this.radiusScale}
                ],
            }}/>

            <View style = {{position:'absolute',
                height:this.icon, width:this.icon, borderRadius:this.icon/2, backgroundColor: colors.shadow,
                justifyContent:'center', alignItems:'center',
            }}>
                <FontAwesome name='user-secret' style={{ color:colors.main, fontSize: this.icon/2 }}/>
            </View>
        </View>
    )
}
}
