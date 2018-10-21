import React, { Component } from 'react'
import {
    View,
}   from 'react-native'
import { connect } from 'react-redux'

import { GameTabs } from '../../common/config'

class Body extends Component {
    _renderBody = (item, index) => {
        if (item.key !== this.props.mainView) return null
        return (
            <item.Component key={index}/>
        )
    }

    render() {
        return (
            <View style={styles.body}>
                {GameTabs.map(this._renderBody)}
            </View>
        )
    }
}

const styles = {
    body: {
        flex: 1,
    },
}

export default connect(
    state => ({
        mainView: state.game.mainView,
    }),
)(Body)