import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity, BackHandler, Keyboard } from 'react-native';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from 'react-navigation';

import { Layout } from "../../router";
import { Alert } from './Alert.js';
import { CustomButton } from './CustomButton';

import Screens from '../misc/screens.json';

const AnimatableIcon = Animatable.createAnimatableComponent(FontAwesome)
const FAST_ANIM = 100;
const MED_ANIM = 400;

export class Helper extends React.Component {
    
constructor(props) {
    super(props);

    this.screen = 'Loading'
    this.radiusScale = new Animated.Value(5)
    
    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
    this.icon = this.height/9;

    this.state = {

        disabled:true,
        alertVisible:false,

        helperY: this.width*5/6,
    }
}

componentDidMount(){
    BackHandler.addEventListener("hardwareBackPress", this._onBackPress.bind(this));
}

componentWillUnmount(){
    BackHandler.removeEventListener("hardwareBackPress");
}

_onBackPress(){
    return true
}

//Prop Functions
_receiveNav(navigation){
    this.navigation = navigation
}

_showCover(show){
    Animated.timing(
        this.radiusScale,{
            toValue:show?5:0.25,
            duration:400
        }
    ).start()
}

_navigate(screen){
    this.setState({
        disabled:true
    })
    setTimeout(()=>{
        this.setState({
            disabled:false
        })
    },2500)

    console.log('Starting Animation')
    Animated.parallel([
        Animated.timing(
            this.radiusScale,{
                toValue:5,
                duration:400
            }
        ),
    ]).start()
        

    setTimeout(()=>{
        if(screen == 'Home'){
              this.navigation.dispatch(
                NavigationActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'Home'})
                    ]
                  })
              )
        } else {
            this.navigation.navigate(screen)
        }

        this.screen = screen
        console.log("Navigating Screens");
    },400)

    setTimeout(()=>{
        Animated.timing(
            this.radiusScale,{
                toValue:0.25,
                duration:500
            }
        ).start()
        console.log('Uncovering Screen')
    },1500) 
}

_navigateP(screen,roomname){
    this.setState({
        disabled:true
    })
    setTimeout(()=>{
        this.setState({
            disabled:false
        })
    },2500)

    console.log('Starting Animation')
    Animated.parallel([
        Animated.timing(
            this.radiusScale,{
                toValue:5,
                duration:400
            }
        ),
    ]).start()

    setTimeout(()=>{

        if(screen == 'MafiaRoom'){
            this.navigation.dispatch(
              NavigationActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ 
                        routeName: 'MafiaRoom',
                        params: { roomname:roomname }
                    })
                  ]
                })
            )
        } else {
            this.navigation.navigate(screen,{ roomname:roomname })
        }

        this.screen = screen
        console.log("Navigating Screens");
    },400)

    setTimeout(()=>{
        Animated.timing(
            this.radiusScale,{
                toValue:0.25,
                duration:500
            }
        ).start()
        console.log('Uncovering Screen')
    },1500) 
}

//Needs rework
_quit(){
    setTimeout(()=>{
        this._viewAlert(true)
    },200)
        
}

_alertOkay(){
    this.setState({
        alertVisible:false
    })
    if(this.screen == 'Home'){
        BackHandler.exitApp()
    } else {
        this._navigate('Home')        
    }
}

_viewAlert(bool){

    if(bool){
        Keyboard.dismiss()
    }

    this.setState({
        alertVisible:bool
    })
        
}


render() {

    return ( 
        <View style = {{position:'absolute', left:0, right:0, bottom:0, top:0,
            justifyContent:'center', alignItems:'center', backgroundColor:'transparent'}}>

                <View style = {{position:'absolute', left:0, right:0, bottom:0, top:0,}}>
                    <Layout
                        screenProps={{
                            passNavigation:val=>{this._receiveNav(val)},
                            navigate:val=>{
                                this._navigate(val)
                            },
                            navigateP:(val,roomname)=>{
                                this._navigateP(val,roomname)
                            },
                            cover:val=>{this._showCover(val)},
                        }}
                    />
                </View>

                <Animated.View style = {{position:'absolute', elevation:0, left:this.state.helperY,
                    height:this.icon*4, width:this.icon*4, borderRadius:this.icon*2, backgroundColor: colors.helper,
                    justifyContent:'center', alignItems:'center',
                    transform: [
                        {scale:this.radiusScale}
                    ],
                }}/>

                <Alert
                    visible = {this.state.alertVisible}
                >
                    <View style = {{height:this.height*0.25, width:this.width*0.9,
                        backgroundColor:colors.background, borderRadius:20}}>
                        
                        <View style = {{flex:0.35, flexDirection:'row',
                            justifyContent:'center', alignItems:'center'}}>
                            <View style = {{flex:0.4}}><CustomButton
                                size = {0.7}
                                flex = {1}
                                backgroundColor = {colors.shadow}
                                onPress = {()=>{ this._alertOkay() }}
                            ><Text style = {styles.choiceButton}>OK</Text></CustomButton>
                            </View>
                            <View style = {{flex:0.05}}/>
                            <View style = {{flex:0.4}}><CustomButton
                                size = {0.7}
                                flex = {1}
                                backgroundColor = {colors.background}
                                onPress = {()=>this._viewAlert(false)}
                                ><Text style = {styles.choiceButton}>Cancel</Text></CustomButton>
                            </View>
                        </View>
                        
                    </View>
                </Alert>
        </View>
    )
}
}
