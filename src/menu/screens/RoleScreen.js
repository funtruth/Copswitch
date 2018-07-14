import React, { Component } from 'react';

import {
    View
} from 'react-native';

import { Styler } from '@common'
import { RoleView } from '@components/RoleView'; 

class RoleScreen extends Component {
    render(){
        const { screen } = styles

        return (
            <View style = {screen}>
                <RoleView/>
            </View>
        )
    }
}

const styles = {
    screen: {
        height: Styler.constant.menuHeight,
        width: Styler.constant.menuWidth
    }
}

export default RoleScreen