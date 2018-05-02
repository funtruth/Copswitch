import React, { Component } from 'react';
import { 
    View, 
    Text,
    FlatList,
} from 'react-native';

import PlayerButton from './PlayerButton';
import { Roles } from '../../misc/roles.js';

import playerModule from '../mods/playerModule.js';
import ownerModule from '../mods/ownerModule.js';

class PlayerList extends Component {
    
    constructor(props) {
        super(props);

        this.state = {

            playerList: [],
            mafiaList: [],

        }

        this.listRef = null
    }

    componentWillMount(){

        this.listRef = playerModule.fetchGameRef('list')

        this.listRef.on('value',snap=>{

            var mafialist = []
            var playerlist = snap.val()

            for(i=0;i<snap.val().length;i++){

                playerlist[i].key = i;
    
                //Mafialist
                if(Roles[playerlist[i].roleid].type == 1 && playerlist[i].uid != this.user){
                    mafialist.push({
                        name:       playerlist[i].name,
                        rolename:   Roles[playerlist[i].roleid].name,
                        dead:       playerlist[i].dead,
                        key:        i,
                    })
                }
    
            }
    
            playerModule.passPlayerList(playerlist)
            ownerModule.passPlayerList(playerlist)
    
            this.setState({
                playerList: playerlist,
                mafialist: mafialist,
            })

        })

    }
    
    render() {
    
        return <FlatList
            data={this.state.playerList}
            contentContainerStyle={{alignSelf:'center', width:this.width*0.8}}
            renderItem={({item}) => <PlayerButton item={item}/>}
            numColumns={2}
            keyExtractor={item => item.uid}
        />
    }
}

const styles = {
    player: {
        fontSize: 16,
        fontFamily: 'FredokaOne-Regular',
        color: colors.shadow,
        margin:5,
    },
}

export default PlayerList
