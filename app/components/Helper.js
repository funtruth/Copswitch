import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity } from 'react-native';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { HelperButton } from './HelperButton.js';
import List from '../screens/ListsScreen.js';

const AnimatableIcon = Animatable.createAnimatableComponent(FontAwesome)
const FAST_ANIM = 100;
const MED_ANIM = 400;

export class Helper extends React.Component {
    
constructor(props) {
    super(props);

    this.state = {
        showOptions:false,
        showMenu:false,
    }

    this.radiusScale = new Animated.Value(5)

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
    this.icon = this.width/5;
    this.menuSideMargins = new Animated.Value(this.width/2 - 10);
    this.menuTopMargin = new Animated.Value(this.height/2 - 10);
    this.menuBottomMargin = new Animated.Value(this.height/2 - 10);

    this.helperX = new Animated.Value((this.height - this.icon)/2);
    
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
            toValue:cover?5:0.25,
            duration:1000
        }
    ).start()
}

_menuPress(show) {

    this.props.navigation.navigate('JoinTutorial')

    if(show){
        this.setState({showMenu:true})
    } else {
        setTimeout(()=>{
            this.setState({showMenu:false})
        },200)
    }

    Animated.parallel([
        Animated.timing(
            this.menuSideMargins,{
                toValue:show?15:this.width/2 - 10,
                duration:200
            }
        ),
        Animated.timing(
            this.menuTopMargin,{
                toValue:show?30:this.height/2 - 10,
                duration:200
            }
        ),
        Animated.timing(
            this.menuBottomMargin,{
                toValue:show?15:this.height/2 - 10,
                duration:200
            }
        ),
        Animated.timing(
            this.helperX,{
                toValue:show?this.height-this.icon-35:(this.height-this.icon)/2,
                duration:200
            }
        )
    ]).start()
}

render() {

    return ( 
        <View style = {{position:'absolute', left:0, right:0, bottom:0, top:0,
            justifyContent:'center', alignItems:'center'}}>
                <Animated.View style = {{position:'absolute', elevation:0,
                    height:this.icon*4, width:this.icon*4, borderRadius:this.icon*2, backgroundColor: colors.helper,
                    justifyContent:'center', alignItems:'center',
                    transform: [
                        {scale:this.radiusScale}
                    ],
                }}/>

                <Animated.View style = {{position:'absolute', elevation:0, 
                    left:this.menuSideMargins, right:this.menuSideMargins, 
                    top:this.menuTopMargin, bottom:this.menuBottomMargin,
                    borderRadius:30, backgroundColor:colors.immune}}>

                    <View style = {{flex:0.07}}/>
                    <View style = {{flex:0.86, backgroundColor:colors.font}}>
                        <List />
                    </View>
                    <View style = {{flex:0.07}}/>

                </Animated.View>

                <Animated.View style = {{position:'absolute', elevation:0, bottom:this.state.showMenu?this.helperX:null,
                    height:this.icon, width:this.icon, borderRadius:this.icon/2, backgroundColor: colors.helper,
                    justifyContent:'center', alignItems:'center',
                }}>
                    <TouchableOpacity
                        style = {{flex:1, justifyContent:'center',alignItems:'center'}}
                        onPress = {()=>{
                            this._menuPress(!this.state.showMenu)
                        }}
                    >
                        <FontAwesome name='user-secret' style={{ color:colors.background, fontSize: this.icon/1.8 }}/>
                    </TouchableOpacity>
                </Animated.View>
        </View>
    )
}
}
