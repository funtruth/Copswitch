
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
            title={this.props.title}
            color='#b18d77'
            backgroundColor='white'
            borderRadius={12}
            fontSize={11}
            buttonStyle={{paddingTop: 5, paddingBottom: 5, paddingLeft: 8, paddingRight: 8}}
            onPress={this.props.onPress}

        />
    )
}
}