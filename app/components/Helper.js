import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity, BackHandler } from 'react-native';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { HelperButton } from './HelperButton.js';
import List from '../screens/ListsScreen.js';
import Screens from '../misc/screens.json';

const AnimatableIcon = Animatable.createAnimatableComponent(FontAwesome)
const FAST_ANIM = 100;
const MED_ANIM = 400;

export class Helper extends React.Component {
    
constructor(props) {
    super(props);

    this.radiusScale = new Animated.Value(5)
    
    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
    this.icon = this.width/5;
    this.menuSideMargins = new Animated.Value(this.width/2 - 10);
    this.menuTopMargin = new Animated.Value(this.height/2 - 10);
    this.menuBottomMargin = new Animated.Value(this.height/2 - 10);

    this.state = {
        disabled:true,
        showOptions:false,
        showMenu:false,

        helperX: new Animated.Value((this.height - this.icon)/2),
        shadowX: new Animated.Value((this.height - 4*this.icon)/2),

        menuOpacity: new Animated.Value(0),
    }

    
}

componentDidMount(){
    setTimeout(()=>{
        this.setState({showOptions:true})
    },1000)
}

componentDidMount(){
    BackHandler.addEventListener("hardwareBackPress", this._onBackPress.bind(this));
}

componentWillUnmount(){
    BackHandler.removeEventListener("hardwareBackPress");
}

componentWillReceiveProps(nextProps) {
    console.log('Receiving Props')
    this._navTransition(nextProps)
    this._moveHelper(nextProps)
}

_onBackPress(){
    if(this.state.showMenu){
        this._menuPress(false)
    }
    return true
}

_navTransition(props){

    this.setState({
        disabled:true
    })
    setTimeout(()=>{
        this.setState({
            disabled:false
        })
    },2500)

    console.log('Starting Animation')
    Animated.timing(
        this.radiusScale,{
            toValue:5,
            duration:200
        }
    ).start()

    setTimeout(()=>{
        if(props.state.roomname){
            props.navigation.navigate(props.state.screen,{roomname:props.state.roomname})
        } else {
            props.navigation.navigate(props.state.screen)
        }
        console.log("Navigating Screens");
    },1000)

    setTimeout(()=>{
        Animated.timing(
            this.radiusScale,{
                toValue:0.25,
                duration:500
            }
        ).start()
        console.log('Uncovering Screen')
    },2000)  
}

//Needs rework
_quit(){
    this.props.navigation.navigate('Home')
}

_moveHelper(nextProps){
    Animated.parallel([
        Animated.timing(
            this.state.helperX,{
                toValue:Screens[nextProps.state.screen].position==1?
                this.height-this.icon-35
                :
                (this.height - this.icon)/2,
                duration:1500
            }
        ),
        Animated.timing(
            this.state.shadowX,{
                toValue:Screens[nextProps.state.screen].position==1?
                this.height-2.5*this.icon-35
                :
                (this.height - 4*this.icon)/2,
                duration:1500
            }
        )
    ]).start()     
}

_menuPress(show) {

    this.setState({
        showMenu:show
    })

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
            this.state.menuOpacity,{
                toValue:show?1:0,
                duration:20
            }
        ),
        Animated.timing(
            this.state.helperX,{
                toValue:show || Screens[this.props.state.screen].position==1?this.height-this.icon-35
                :(this.height-this.icon)/2,
                duration:200
            }
        )
    ]).start()
}

render() {

    return ( 
        <View style = {{position:'absolute', left:0, right:0, bottom:0, top:0,
            justifyContent:'center', alignItems:'center'}}>
                <Animated.View style = {{position:'absolute', elevation:0, bottom:this.state.shadowX,
                    height:this.icon*4, width:this.icon*4, borderRadius:this.icon*2, backgroundColor: colors.immune,
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
                    <Animated.View style = {{flex:0.86, backgroundColor:colors.font, opacity:this.state.menuOpacity}}>
                        <List 
                            screenProps = {{
                                quit: ()=>{this._quit()}
                            }}
                        />
                    </Animated.View>
                    <View style = {{flex:0.07}}/>

                </Animated.View>

                <Animated.View style = {{position:'absolute', elevation:5, bottom:this.state.helperX,
                    height:this.icon, width:this.icon, borderRadius:this.icon/2, backgroundColor: colors.helper,
                    justifyContent:'center', alignItems:'center',
                }}>
                    <TouchableOpacity
                        style = {{flex:1, justifyContent:'center',alignItems:'center'}}
                        onPress = {()=>{ this._menuPress(!this.state.showMenu) }}
                        disabled = {this.state.disabled}
                    >
                        <FontAwesome name='user-secret' style={{ color:colors.background, fontSize: this.icon/1.8 }}/>
                    </TouchableOpacity>
                </Animated.View>
        </View>
    )
}
}
