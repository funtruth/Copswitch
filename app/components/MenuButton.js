import React, { Component } from 'react';
import {
    Button
} from 'react-native-elements';

import colors from '../misc/colors.js';

export class MenuButton extends React.Component {

constructor(props) {
    super(props);
}
      

render() {

    return (
        <Button
            backgroundColor = {colors.main}
            color = {colors.font}
            containerViewStyle = {{ flex:this.props.flex }}
            fontFamily = 'ConcertOne-Regular'
            fontSize = {this.props.fontSize}
            borderRadius = {10}
            title = {this.props.title}
            onPress = {this.props.onPress}
        />
    )
}
}
