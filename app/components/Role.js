import React, { Component } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';

import colors from '../misc/colors.js';
import { CustomButton } from './CustomButton';

export class Role extends React.Component {

    
constructor(props) {
    super(props);

    this.state = {
        myrole:'',
        rules:'',
        win:'',
    }

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
    this.opacity = new Animated.Value(0);
    this.size = new Animated.Value(0.01);
    
}

_cancel() {
    Animated.sequence([
        Animated.timing(
            this.size,{
                toValue:0,
                duration:200
            }
        ),
        Animated.timing(
            this.opacity,{
                toValue:0,
                duration:200
            }
        )
    ]).start()
}

_show() {
    Animated.sequence([
        Animated.timing(
            this.size,{
                toValue:this.height*0.55,
                duration:200
            }
        ),
        Animated.timing(
            this.opacity,{
                toValue:1,
                duration:200
            }
        )
    ]).start()
}

componentWillMount(){

}

componentWillReceiveProps(newProps){
    if(newProps.visible){
        this._show()
    }
}

render() {

    return ( 
        <Animated.View style = {{height:this.size, opacity:this.opacity,
            justifyContent: 'center', alignItems: 'center' }}>
            <Text style = {styles.lfont}>you are a:</Text>
            <Text style = {styles.mfont}>{item.myrole}</Text>
            <Text style = {styles.lfont}>At night you:</Text>
            <Text style = {styles.roleDesc}>{item.rolerules}</Text>
            {this.state.amimafia?<View>
                <Text style = {styles.lfont}>Your teammates:</Text>
                <FlatList
                    data={this.state.mafialist}
                    renderItem={({item}) => (
                        <Text style={[styles.roleDesc,{textDecorationLine:item.alive?'none':'line-through'}]}>
                            {'[ ' + item.name + ' ] ' + item.rolename}</Text>
                    )}
                    keyExtractor={item => item.key}
                /></View>:<View><Text style = {styles.lfont}>you win when:</Text>
                <Text style = {styles.roleDesc}>{item.win}</Text></View>}
        </Animated.View>
    )
}
}
