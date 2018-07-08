import React, { Component } from 'react';

import {
    View
} from 'react-native';

import { RoleView } from '@components/RoleView'; 

class RoleScreen extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        return <View style = {{flex:1}}>
            <RoleView/>
        </View>
    }
}

export default RoleScreen