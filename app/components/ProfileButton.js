
import React, { Component } from 'react';
import {
    Button,
} from 'react-native-elements';

export default class ProfileButton extends React.Component {

constructor(props) {
    super(props);
}
      

render() {
    return (
        <Button
            backgroundColor="black"
            color='white'
            title={this.props.title}
            borderRadius={10}
            fontSize={12}
            icon={this.props.icon}
            onPress={this.props.onPress}
        />
    )
}
}