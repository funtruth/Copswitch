import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Animated, 
    Dimensions, 
    TouchableOpacity, 
    FlatList 
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../misc/colors.js';
import { Message } from '../../parents/Message.js';
import playerModule from '../mods/playerModule.js';

const FADEOUT_ANIM = 300;
const SIZE_ANIM = 500;
const FADEIN_ANIM = 600;

const MARGIN = 10;

class General extends Component {
    
    constructor(props) {
        
        super(props)

        this.newsRef = null

        this.newsList = []

    }

    componentWillMount(){

        this.newsRef = playerModule.fetchGameRef('news')

        this.newsRef.on('child_added',snap=>{

            this.newslist.push({
                message:snap.val(),
                key:snap.key,
            })
    
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
                    data={this.newsList}
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