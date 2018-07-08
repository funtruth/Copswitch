import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient'

import { toggleMenu } from '../MenuReducer'

import { Styler } from '@common'

class MenuHeader extends Component {
    render() {
        const { buttonStyle, gradientStyle, padding, iconStyle, fontStyle } = styles
        const { toggleMenu } = this.props

        return(
            <TouchableOpacity 
                style={buttonStyle}
                onPress={toggleMenu}
            >
                <LinearGradient 
                    colors={Styler.color.buttonGradient}
                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                    style={gradientStyle}
                >
                    <View style={padding}>
                        <FontAwesome name='book' style={iconStyle}/>
                        <Text style={fontStyle}>Menu</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        )
    }
}

const styles = {
    buttonStyle:{
        position:'absolute',
        top:20,
        left:20,
    },
    gradientStyle: {
        flex: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
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
        marginLeft:10,
        marginRight:15,
        fontFamily: Styler.fontFamily.Regular,
        color: Styler.color.dark,
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
)(MenuHeader)
