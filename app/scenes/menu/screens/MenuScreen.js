import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'

import { Author } from '@library'
import { Styler } from '@common'
import { pushNewScreen } from '../MenuReducer'

const { Menus } = Author
const { height, width } = Dimensions.get('window')

class MenuScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menu: Menus[props.route].data,
        }
    }

    _onPress = (route) => {
        this.props.pushNewScreen(route)
    }

    _renderItem = ({item}) => {
        const { buttonStyle, gradientStyle, buttonTextStyle } = styles
        return (
            <TouchableOpacity
                style={buttonStyle}
                onPress={this._onPress.bind(this, item.key)}
            >
                <LinearGradient 
                    colors={Styler.color.buttonGradient}
                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                    style={gradientStyle}
                >
                    <Text style = {buttonTextStyle}>{item.label}</Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    _keyExtractor = (item) => item.key

    render(){
        const { menu } = this.state
        const { screen } = styles

        return (
            <FlatList
                data={menu}
                renderItem={this._renderItem}
                contentContainerStyle={screen}
                showsVerticalScrollIndicator={false}
                keyExtractor={this._keyExtractor}
            />
        )
    }
}

const styles = {
    screen: {
        height: Styler.constant.menuHeight,
        width: Styler.constant.menuWidth,
        backgroundColor: 'white',
        padding: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'red'
    },
    headerStyle: {
        //Might be included in MenuHeader
    },
    buttonStyle: {
        width: 0.6*width,
        height: 0.15*width
    },
    gradientStyle: {
        flex: 1,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonTextStyle: {
        fontFamily: Styler.fontFamily.Medium,
        fontSize: 18
    }
}

export default connect(
    null,
    dispatch => {
        return {
            pushNewScreen: (route) => dispatch(pushNewScreen(route))
        }
    }
)(MenuScreen)