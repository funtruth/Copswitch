import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Styler } from '@common'
import { Button } from '@components'
import { Author } from '@library'
import { pushNewScreen } from '../MenuReducer'

const { Details, DetailTypes } = Author
const { height, width } = Dimensions.get('window')

class DetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: Details[props.route].data
        }
    }

    _renderItem = ({item}) => {
        const { subtitle, subtitleText } = styles

        switch(item.type) {
            case DetailTypes.subtitle:
                return (
                    <View style={subtitle}>
                        <Text style={subtitleText}>{item.payload}</Text>
                    </View>
                )
            case DetailTypes.text:
                return (
                    <View style={subtitle}>
                        <Text style={subtitleText}>{item.payload}</Text>
                    </View>
                )
            case DetailTypes.note:
                return (
                    <View style={subtitle}>
                        <Text style={subtitleText}>{item.payload}</Text>
                    </View>
                )
            case DetailTypes.image:
                return (
                    <View style={subtitle}>
                        <Text style={subtitleText}>{item.payload}</Text>
                    </View>
                )
            case DetailTypes.button:
                return (
                    <View style={subtitle}>
                        <Text style={subtitleText}>{item.payload}</Text>
                    </View>
                )
            default:
                return null
        }
    }

    _keyExtractor = (item, index) => index.toString()

    render(){
        const { screen } = styles
        const { data } = this.state

        return (
            <FlatList
                data={data}
                renderItem={this._renderItem}
                contentContainerStyle={screen}
                overScrollMode={'never'}
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
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'red'
    },
    subtitle: {
        margin: 5
    },
    subtitleText: {
        fontFamily: Styler.fontFamily.SemiBold,
        fontSize: 15,
        textAlign: 'center'
    }
}

export default connect(
    null,
    dispatch => {
        return {
            pushNewScreen: (route) => dispatch(pushNewScreen(route)) 
        }
    }
)(DetailScreen)