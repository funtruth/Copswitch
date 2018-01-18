import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity } from 'react-native';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { HelperButton } from './HelperButton.js';

const AnimatableIcon = Animatable.createAnimatableComponent(FontAwesome)
const FAST_ANIM = 100;
const MED_ANIM = 400;

export class Helper extends React.Component {
    
constructor(props) {
    super(props);

    this.state = {
        showOptions:false
    }

    this.radiusScale = new Animated.Value(20)

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;

    this.icon = this.width/5;
    
}

componentDidMount(){
    setTimeout(()=>{
        this.setState({showOptions:true})
    },1000)
}

componentWillReceiveProps(nextProps) {
    this._transition(nextProps.loading)
}

_transition(cover){
    Animated.timing(
        this.radiusScale,{
            toValue:cover?20:1,
            duration:1000
        }
    ).start()
}

_menuPress() {

}

render() {

    return ( 
        <View style = {{position:'absolute', left:0, right:0, bottom:0, top:0,
            justifyContent:'center', alignItems:'center'}}>
                <Animated.View style = {{position:'absolute', elevation:0, left:(this.width-this.icon)/2, bottom:(this.height-this.icon)/1.9,
                    height:this.icon, width:this.icon, borderRadius:this.icon/2, backgroundColor: colors.helper,
                    justifyContent:'center', alignItems:'center',
                    transform: [
                        {scale:this.radiusScale}
                    ],
                }}/>

                <Animated.View style = {{position:'absolute', elevation:0, left:(this.width-this.icon)/2, bottom:(this.height-this.icon)/1.9,
                    height:this.icon, width:this.icon, borderRadius:this.icon/2, backgroundColor: colors.helper,
                    justifyContent:'center', alignItems:'center',
                }}>
                    <TouchableOpacity
                        style = {{flex:1, justifyContent:'center',alignItems:'center'}}
                        onPress = {()=>{
                            this._menuPress()
                        }}
                    >
                        <FontAwesome name='user-secret' style={{ color:colors.background, fontSize: this.icon/1.8 }}/>
                    </TouchableOpacity>
                </Animated.View>
        </View>
    )
}
}
