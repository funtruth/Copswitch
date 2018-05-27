import React, { Component } from 'react'
import { 
    View, 
    Text,
    FlatList 
} from 'react-native'
import { connect } from 'react-redux'

import colors from '../../misc/colors.js'
import { Message } from '../../parents/Message.js'
import playerModule from '../mods/playerModule.js'
import firebaseService from '../../firebase/firebaseService'

class General extends Component {

    _renderItem(item){

        return <Message style = {styles.messageContainer}>
            <Text style = {styles.message}>{item.message}</Text>
        </Message>
        
    }

    render() {
        return (
            <View style = {{flex:0.55}}>
                <FlatList
                    data={this.props.news}
                    renderItem={({item}) => (this._renderItem(item))}
                    inverted
                    initialNumToRender={12}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.key}
                />
            </View>
        )
    }
}

const styles = {
    message: {
        fontSize: 15,
        fontFamily: 'FredokaOne-Regular',
        color: colors.font,
        marginTop:5,
        marginBottom:5,
    },
    messageContainer: {
        margin:5,
    },
}

export default connect(
    state => ({
        news: state.room.news
    })
)(General)