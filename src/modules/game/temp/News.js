import React, { Component } from 'react'
import { 
    View, 
    Text,
    FlatList,
} from 'react-native'
import { connect } from 'react-redux'

class News extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentTime: Date.now()
        }
    }

    componentDidMount() {
        this.timer = setInterval(() => { this.setState({ currentTime: Date.now() }); }, 5000)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    _renderItem = ({item}) => {
        return (
            <View style={styles.box}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.time}>{this._getTime(item.counter)}</Text>
                    <View style={styles.separator}/>
                    <Text style={styles.timestamp}>{this._getPassedTime(item.timestamp)}</Text>
                </View>
                <Text style={styles.message}>{item.message}</Text>
            </View>
        )
    }

    _getTime(ctr) {
        let str = ''
        let dayNum = Math.floor(ctr/3) + 1
        switch(ctr%3) {
            case 0:
            case 1:
                str = `DAY ${dayNum}`
                break
            case 2:
                str = `NIGHT ${dayNum}`
                break
            default:
        }
        return str
    }

    _getPassedTime(stamp) {
        let s = Math.round((this.state.currentTime - stamp)/1000)
        let m = Math.round(s/60)
        if (s < 40) {
            return `${s}s ago`
        } else if (s < 45 * 60) {
            return `${m}min ago`
        } else {
            return 'A long time ago'
        }
    }

    render() {
        return (
            <FlatList
                data={this.props.news}
                extraData={this.state.currentTime}
                renderItem={this._renderItem}
                contentContainerStyle={styles.flatlist}
                inverted
                keyExtractor={item => item.timestamp.toString()}
            />
        )
    }
}

const styles = {
    flatlist: {
        padding: 15,
    },
    box: {
        backgroundColor: '#384959',
        padding: 10,
        marginTop: 10,
    },
    time: {
        fontFamily: 'Roboto-Medium',
        fontSize: 11,
        color: '#d6d6d6',
        letterSpacing: 0.3,
    },
    timestamp: {
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        color: '#d6d6d6',
    },
    separator: {
        height: 6,
        width: 6,
        borderRadius: 3,
        backgroundColor: '#99aab5',
        margin: 5,
    },
    message: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        color: '#fff',
    }
}

export default connect(
    state => ({
        news: state.lobby.news,
    })
)(News)