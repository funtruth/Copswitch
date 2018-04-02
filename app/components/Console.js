import React, { Component } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';

import colors from '../misc/colors.js';
import Phases from '../misc/phases.json';
import { Button } from './Button';

const FADEOUT_ANIM = 200;
const BLINK_ANIM = 50;
const FADEIN_ANIM = 600;

const MARGIN = 10;


export class Console extends React.Component {
        
    constructor(props) {
        super(props);
    }

    render() {

        return ( 
            <Animated.View style = {{flex:0.3, margin:5, borderRadius:5, 
                backgroundColor:colors.card, justifyContent:'center'}}>
                    
                <Text style = {{ fontSize:30, fontFamily:'FredokaOne-Regular', marginBottom:5, 
                    color:colors.shadow, alignSelf:'center' }}>{this.props.title}</Text>

                    <Button
                        horizontal = {0.4}
                        margin = {10}
                        backgroundColor = {colors.dead}
                        onPress = {this.props.first}
                    ><Text style = {styles.choiceButton}>{this.props.btn1}</Text>
                    </Button>

                    <Button
                        horizontal = {0.4}
                        backgroundColor = {colors.dead}
                        onPress = {this.props.second}
                        ><Text style = {styles.choiceButton}>{this.props.btn2}</Text>
                    </Button>

            </Animated.View>
        )
    }
}

