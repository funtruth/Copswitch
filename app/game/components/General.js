import React, { Component } from 'react';
import { 
    View, 
    Text,
    FlatList 
} from 'react-native';

import colors from '../../misc/colors.js';
import { Message } from '../../parents/Message.js';
import playerModule from '../mods/playerModule.js';

class General extends Component {
    
    constructor(props) {
        
        super(props)

        this.newsRef = null

        this.state = {
            newsList: []
        }

    }

    componentWillMount(){

        this.newsRef = playerModule.fetchGameRef('news')
        
        this.newsRef.on('child_added', snap=>{

            if(snap.exists()){
                this.setState(prevState => ({
                    newsList: [{
                        message: snap.val(),
                        key: snap.key
                    }, ...prevState.newsList]
                }))
            }
    
        })

    }

    componentWillUnmount(){

        if(this.newsRef) this.newsRef.off()

    }

    _renderItem(item){

        return <Message style = {styles.messageContainer}>
            <Text style = {styles.message}>{item.message}</Text>
        </Message>
        
    }

    render() {
    
        return (
            <View style = {{flex:0.55}}>
                <FlatList
                    data={this.state.newsList}
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

export default General