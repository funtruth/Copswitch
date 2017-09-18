
import React, { Component } from 'react';
import {
    ListItem
} from 'react-native-elements';
import {
    TextInput
} from 'react-native'
;


import ModalPicker from 'react-native-modal-picker';

import firebase from '../firebase/FirebaseController.js';

export default class ToggleListItem extends React.Component {

constructor(props) {
    super(props);
}
      

render() {

    return (
        <ListItem
            title={this.props.title}
            titleStyle={{
                fontWeight: 'normal',
                fontSize: 15,
                color: '#b18d77',
            }}
            subtitle= {this.props.subtitle}
            subtitleStyle={{
                marginLeft: 25,
                fontWeight: 'bold',
                fontSize: 17,
                color: "#b18d77",
            }}
            backgroundColor='#e6ddd1'
            containerStyle={{
                borderBottomWidth: 0,
            }}
            hideChevron={true}
            switchButton={true}
            switchTintColor='#decfc6'
            switchOnTintColor='#b18d77'
            switchThumbTintColor='#c9b0a1'
            switched={this.props.switched}
            onSwitch={this.props.onSwitch}
            onPress={this.props.onPress}
      />
    )
}
}