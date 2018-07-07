import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux'

import { Author } from '@library'
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
        const { buttonStyle, buttonTextStyle } = styles
        return (
            <TouchableOpacity
                style={buttonStyle}
                onPress={this._onPress.bind(this, item.key)}
            >
                <Text style = {buttonTextStyle}>{item.label}</Text>
            </TouchableOpacity>
        )
    }

    _keyExtractor = (item) => item.key

    render(){
        const { menu } = this.state
        const { screen } = styles

        return (
            <View style={screen}>
                <FlatList
                    data={menu}
                    renderItem={this._renderItem}
                    horizontal
                    contentContainerStyle={{alignSelf:'center', borderWidth: 1}}
                    keyExtractor={this._keyExtractor}
                />
            </View>
        )
    }
}

const styles = {
    screen: {
        height,
        width
    },
    headerStyle: {
        //Might be included in MenuHeader
    },
    buttonStyle: {

    },
    buttonTextStyle: {

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