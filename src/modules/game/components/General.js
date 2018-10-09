import React, { Component } from 'react'
import { 
    View, Text
} from 'react-native'
import { GameInfo } from '@library';
import { statusType } from '../../common/types';
const { Phases } = GameInfo

class General extends Component {
    //TODO VERY inefficient rendering
    _renderList() {
        const { news } = this.props
        
        let itemArr = []
        for (var i in news) {
            itemArr.push(
                <Pretext key={i}>
                    {news[i].message}
                </Pretext>
            )
        }
        return itemArr
    }

    render() {
        const { config, gameState } = this.props
        if (config.status !== statusType.game) return null

        return (
            <View style = {styles.container}>
                <Text style={styles.subtext}>Phase</Text>
                <Text style={styles.bigtext}>{Phases[gameState.phase].name}</Text>
                <Text style={styles.subtext}>Prompt</Text>
                <Text style={styles.medtext}>{Phases[gameState.phase].message}</Text>
            </View>
        )
    }
}

const styles = {
    container: {
        position: 'absolute',
        top: 15,
        left: 10,
        right: 10,
        backgroundColor: '#fff',
        padding: 5,
    },
    subtext: {
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        color: '#6f6f6f',
    },
    medtext: {
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
        color: '#000',
    },
    bigtext: {
        fontFamily: 'Roboto-Medium',
        fontSize: 22,
        lineHeight: 25,
        color: '#000',
    }
}

export default General