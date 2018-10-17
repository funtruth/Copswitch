import React, { Component } from 'react'
import { 
    View, 
    Text,
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import {Roles} from '@library'
import LobbyModal from '../modal/LobbyModal';

class MyRole extends Component {
    _renderTitle() {
        const { myInfo } = this.props
        return (
            <View style={styles.container}>
                <Text style={styles.label}>ROLE</Text>
                <Text style={styles.role}>{Roles[myInfo.roleId].name}</Text>
            </View>
        )
    }

    _renderDetail() {
        const { myInfo } = this.props
        return (
            <View style={styles.container}>
                <Text style={styles.label}>ABILITY</Text>
                <Text style={styles.rule}>{Roles[myInfo.roleId].rules}</Text>
            </View>
        )
    }

    _renderMafia() {
        const { myInfo, lobby } = this.props
        if (Roles[myInfo.roleId].type !== 1) return null

        let mafia = _.filter(lobby, i => {
            return Roles[i.roleId].type === 1 && i.uid !== myInfo.uid
        })

        return (
            <View style={styles.container}>
                <Text style={styles.label}>TEAMMATES</Text>
                {mafia.map(this._renderTeammate)}
            </View>
        )
    }

    _renderTeammate = (item) => {
        return (
            <Text key={item.uid} style={styles.rule}>
                {`${item.name}: ${Roles[item.roleId].name}`}
            </Text>
        )
    }

    render() {
        const { myInfo } = this.props
        if (!myInfo.roleId) return null

        return (
            <LobbyModal
                type="myRole"
                title="My Role Information"
            >
                {this._renderTitle()}
                {this._renderDetail()}
                {this._renderMafia()}
            </LobbyModal>
        )
    }
}

const styles = {
    container: {
        padding: 8,
        backgroundColor: '#1e2125',
        borderRadius: 2,
        marginBottom: 8,
    },
    label: {
        fontFamily: 'Roboto-Bold',
        fontSize: 11,
        lineHeight: 12,
        color: '#a8a8a8',
        letterSpacing: 0.5,
    },
    role: {
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
        lineHeight: 19,
        color: '#fff',
    },
    rule: {
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        lineHeight: 15,
        color: '#fff',
    }
}

export default connect(
    state => ({
        myInfo: state.lobby.myInfo,
        lobby: state.lobby.lobby,
    })
)(MyRole)