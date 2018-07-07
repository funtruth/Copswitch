import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { toggleMenu } from '../MenuReducer'

class MenuButton extends Component {
    render() {
        const { container, padding, iconStyle, fontStyle } = styles
        const { toggleMenu } = this.props

        return(
            <TouchableOpacity 
                style={container}
                onPress={toggleMenu}>
                <View style={padding}>
                    <FontAwesome name='book' style={iconStyle}/>
                    <Text style={fontStyle}>Menu</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = {
    container:{
        position:'absolute',
        top:20,
        left:20,
        borderRadius:5
    },
    padding:{
        margin: 5,
        alignItems:'center',
        flexDirection: 'row'
    },
    iconStyle:{
        fontSize:25,
        marginLeft:10
    },
    fontStyle:{
        marginLeft:15,
        marginRight:15,
        fontFamily:'FredokaOne-Regular',
        fontSize: 18
    }
}

export default connect(
    null,
    dispatch => {
        return {
            toggleMenu: () => dispatch(toggleMenu())
        }
    }
)(MenuButton)
