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
            <Animated.View>
                    
                <Text style = {{
                    fontSize:30,
                    fontFamily:'LuckiestGuy-Regular',
                    color:colors.font
                }}>{this.props.title}</Text>

                <View style = {{
                    flexDirection:'row', justifyContent:'center', alignItems:'center'}}>

                    <Button
                        flex = {0.25}
                        backgroundColor = {colors.dead}
                        onPress = {this.props.second}
                    ><Text style = {styles.choiceButton}>{Phases[this.props.phase].btn1}</Text>
                    </Button>

                    <Text style = {styles.choiceButton}>OR</Text>

                    <Button
                        flex = {0.25}
                        backgroundColor = {colors.dead}
                        onPress = {this.props.second}
                        ><Text style = {styles.choiceButton}>{Phases[this.props.phase].btn2}</Text>
                    </Button>
                </View>

            </Animated.View>
        )
    }
}

