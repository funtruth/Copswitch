import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { View } from 'react-native';

import colors from '../misc/colors.js';

export class MenuButton extends React.Component {

constructor(props) {
    super(props);
}
      

render() {

    return (
        <View style = {{flex:this.props.viewFlex, flexDirection:'row',
        justifyContent:'center', alignItems:'center'}}>
            <Button
                backgroundColor = {colors.main}
                color = {colors.background}
                containerViewStyle = {{ flex:this.props.flex }}
                fontFamily = 'ConcertOne-Regular'
                fontSize = {this.props.fontSize}
                borderRadius = {10}
                title = {this.props.title}
                onPress = {this.props.onPress}
            />
        </View>
    )
}
}
