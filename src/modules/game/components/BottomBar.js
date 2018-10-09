import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import BottomIcon from './BottomIcon';

import { toggleBottomView } from '../GameReducer'

const REST_HEIGHT = 45

class BottomView extends Component {
    _onIconPress = () => {
        this.props.toggleBottomView()
    }

    render() {
        return (
            <View style={styles.bottomBar}>
                <BottomIcon
                    name="md-apps"
                    size={20}
                    color="#fff"
                    onPress={this._onIconPress}
                />
                <View style={{ flex: 1 }}/>
                <BottomIcon
                    name="md-create"
                    size={20}
                    color="#fff"
                    onPress={this._onIconPress}
                />
                <BottomIcon
                    name="md-calendar"
                    size={20}
                    color="#fff"
                    onPress={this._onIconPress}
                />
            </View>
        )
    }
}

const styles = {
    bottomBar: {
        height: REST_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    }
}

export default connect(
    null,
    {
        toggleBottomView,
    }
)(BottomView)