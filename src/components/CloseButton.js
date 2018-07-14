import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

class CloseButton extends Component {

    
    constructor(props) {
        super(props);
    }

    render() {

        return ( 
            <TouchableOpacity 
                onPress = {this.props.onPress}
                style = {{
                    position:'absolute',
                    top:20,
                    right:20,
                    backgroundColor:'white'
                }}
            >
                <MaterialCommunityIcons name='close' />
            </TouchableOpacity>
        )
    }
}

export default CloseButton
