import React, { Component } from 'react'
import { 
    View, 
    Text,
    TouchableOpacity,
    FlatList,
    Dimensions
} from 'react-native'
import { connect } from 'react-redux'

import { Printer, Styler } from '@common'
import { Message } from '../../parents/Message.js'
import firebaseService from '../../firebase/firebaseService'

const { height, width } = Dimensions.get('window')

class General extends Component {
    state = {
        visible: false
    }

    _renderList() {
        const { messageContainer, message } = styles
        const { news } = this.props
        let itemArr = []
        for (var i in news) {
            itemArr.push(
                <Message style={messageContainer}>
                    <Text style={message}>
                        {Printer.processString(news[i])}
                    </Text>
                </Message>
            )
        }
        return itemArr
    }

    _showNews = () => {
        this.setState({
            visible: !this.state.visible
        })
    }

    render() {
        const { visible } = this.state
        const { news } = this.props
        console.log('news', news)
        const { headerStyle, newsContainerStyle } = styles

        if (!visible) {
            return (
                <TouchableOpacity
                    style={styles.headerStyle}
                    onPress={this._showNews}
                >
                    
                </TouchableOpacity>
            )
        }

        return (
            <View style = {newsContainerStyle}>
                {this._renderList()}
            </View>
        )
    }
}

const styles = {
    headerStyle: {
        position: 'absolute',
        top: 15,
        left: 10,
        right: 10,
        height: 0.1*height,
        backgroundColor: Styler.colors.light,
        borderRadius: 15
    },
    newsContainerStyle: {
        position: 'absolute',
        top: 15,
        left: 10,
        right: 10,
        height: 0.5*height,
        backgroundColor: Styler.colors.light,
        borderRadius: 15
    },
    message: {
        fontSize: 15,
        fontFamily: Styler.fontFamily.Regular,
        color: Styler.colors.font,
        marginTop:5,
        marginBottom:5,
    },
    messageContainer: {
        margin:5,
    },
}

export default connect(
    state => ({
        news: state.game.news
    })
)(General)