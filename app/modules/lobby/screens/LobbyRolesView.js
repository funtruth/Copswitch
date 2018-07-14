import React, { Component } from 'react'
import { View, FlatList, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import LobbyRole from '../components/LobbyRole';

const { height, width } = Dimensions.get('window')

class LobbyRolesView extends Component {
    state = {
        data: []
    }

    componentDidMount() {
        this.updateList(this.props)
    }

    componentWillReceiveProps(newProps) {
        this.updateList(newProps)
    }

    updateList(props) {
        if (!props.roleList) return
        let { roleList } = props
        let data = []

        for (var i in roleList) {
            data.push({
                key: i,
                roleid: i,
                count: roleList[i]
            })
        }

        this.setState({
            data: data
        })
    }

    renderRole = ({item}) => <LobbyRole {...item}/>

    keyExtractor = (item) => item.key

    render() {
        const { container } = styles

        return (
            <View style={container}>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderRole}
                    keyExtractor={this.keyExtractor}
                />
            </View>
        )
    }
}

const styles = {
    container: {
        height: 0.7*height,
        width
    }
}

export default connect(
    state => ({
        roleList: state.lobby.roleList,
    })
)(LobbyRolesView)