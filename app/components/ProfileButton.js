
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
            backgroundColor={this.props.backgroundColor}
            color={this.props.color}
            title={this.props.title}
            borderRadius={10}
            fontSize={12}
            icon={this.props.icon}
            disabled={this.props.disabled}
            onPress={this.props.onPress}
        />
    )
}
}