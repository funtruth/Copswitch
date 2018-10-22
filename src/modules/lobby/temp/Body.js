import React, { Component } from 'react'
import {
    View,
}   from 'react-native'
import { connect } from 'react-redux'

import { LobbyTabs } from '../../common/config'

class Body extends Component {
    _renderBody = (item, index) => {
        if (item.key !== this.props.lobbyView) return null
        return (
            <item.Component key={index}/>
        )
    }

    render() {
        return (
            <View style={styles.body}>
                {LobbyTabs.map(this._renderBody)}
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
        lobbyView: state.view.lobbyView,
    }),
)(Body)