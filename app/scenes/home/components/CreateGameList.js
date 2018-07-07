import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import { GameInfo } from '@library'

const { Modes } = GameInfo
const { height, width } = Dimensions.get('window')

class CreateGameList extends Component {
    constructor(props){
        super(props)
        this.state = {
            pressedKey: null
        }
    }

    _onPress(key) {
        if (this.state.pressedKey === key) {
            this.props.createRoom(key)
        } else {
            this.setState({
                pressedKey: key
            })
        }
    }

    renderItem = ({item}) => {
        const { sharedStyle, pressedStyle, unpressedStyle, title, desc } = styles
        const pressed = (item.key === this.state.pressedKey)
        
        return (
            <TouchableOpacity 
                style={[sharedStyle, {
                    opacity: pressed?1:0.65
                }]}
                onPress={this._onPress.bind(this, item.key)}
            >
                <Text style={title}>{item.display}</Text>
                {pressed && <Text style={desc}>{item.desc}</Text>}
            </TouchableOpacity>
        )
    }

    keyExtractor = (item) => item.key

    render() {
        const { container } = styles

        return (
            <View style={container}>
                <FlatList
                    data={Modes}
                    extraData={this.state.pressedKey}
                    renderItem={this.renderItem}
                    ItemSeparatorComponent={() => <View style={{height: 4}}/>}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this.keyExtractor}
                />
            </View>
        )
    }
}

const styles = {
    container: {
        flex: 0.6,
        alignItems: 'center'
    },
    sharedStyle: {
        borderWidth: 3,
        borderColor: '#A6895D',
        height: 0.25*width,
        width: 0.7*width,
        justifyContent: 'center'
    },
    pressedStyle: {
        opacity: 1
    },
    unpressedStyle: {
        opacity: 0.65
    },
    title: {
        fontFamily: 'BarlowCondensed-Medium',
        fontSize: 25,
        color: '#A6895D',
        alignSelf: 'center'
    },
    desc: {
        fontFamily: 'BarlowCondensed-Regular',
        fontSize: 14,
        color: '#A6895D',
        textAlign: 'center'
    }
}

export default CreateGameList