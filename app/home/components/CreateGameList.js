import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { Modes } from '../../library/games'

class CreateGameList extends Component {
    constructor(props){
        super(props)
        this.state = {
            gameModeSelected: null,
            gameModeData: [],
        }
    }

    componentDidMount() {
        let gameModes = []
        for(var i=0; i<Modes.length; i++){
            gameModes.push(Modes[i])
        }
        this.setState({
            gameModeData: gameModes
        })
    }

    _onPress = (key) => {
        if (this.state.gameModeSelected === key) {
            this.props.createRoom.bind(null,key)
        } else {
            this.setState({
                gameModeSelected: key
            })
        }
    }

    renderItem = ({item}) => {
        const { pressedContainer, unpressedContainer } = styles

        let pressed = item.key === this.state.gameModeSelected
        
        return (
            <TouchableOpacity 
                style={pressed?pressedContainer:unpressedContainer}
                onPress={this._onPress(item.key)}
            >

            </TouchableOpacity>
        )
    }

    keyExtractor = (item) => item.key

    render() {
        const { container } = styles

        return (
            <View style={container}>
                <FlatList
                    data={this.state.gameModeData}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                />
            </View>
        )
    }
}

const styles = {
    pressedContainer: {
        height: 100, width: 200, backgroundColor: 'red'
    },
    unpressedContainer: {

    }
}

export default CreateGameList