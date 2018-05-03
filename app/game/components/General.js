import React, { Component } from 'react';
import { 
    View, 
    Text,
    FlatList 
} from 'react-native';

import colors from '../../misc/colors.js';
import { Message } from '../../parents/Message.js';
import playerModule from '../mods/playerModule.js';
import firebaseService from '../../firebase/firebaseService';

class General extends Component {
    
    constructor(props) {
        
        super(props)

        this.logRef = null

        this.state = {
            log: []
        }

    }

    componentWillMount(){

        this.logRef = firebaseService.fetchRoomRef('log')
        
        this.logRef.on('child_added', snap=>{

            if(snap.exists()){
                this.setState(prevState => ({
                    log: [{
                        message: snap.val(),
                        key: snap.key
                    }, ...prevState.log]
                }))
            }
    
        })

    }

    componentWillUnmount(){

        if(this.logRef) this.logRef.off()

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
                    data={this.state.log}
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