import React, { Component } from 'react';
import { 
    View, 
    Text,
    FlatList,
} from 'react-native';

import { Button } from '../../components/Button.js';
import Rolesheet from '../../misc/roles.json';
import firebaseService from '../../firebase/firebaseService.js';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import playerModule from '../mods/playerModule.js';
import ownerModule from '../mods/ownerModule.js';

class PlayerListComponent extends Component {
    
    constructor(props) {
        super(props);

        this.listRef = null
    }

    componentWillMount(){

        this.listRef = playerModule.fetchGameRef('list')

        this.listRef.on('value',snap=>{

            if(snap.exists()){
    
                this.namelist = snap.val();

                var playernum = 0;
                var balance = 0;
                var mafialist = [];
    
                for(i=0;i<this.namelist.length;i++){
    
                    this.namelist[i].key = i;
    
                    //Mafialist
                    if(Rolesheet[this.namelist[i].roleid].type == 1 && this.namelist[i].uid != this.user){
                        mafialist.push({
                            name:       this.namelist[i].name,
                            rolename:   Rolesheet[this.namelist[i].roleid].name,
                            dead:       this.namelist[i].dead,
                            key:        i,
                        })
                    }

                    if(!this.namelist[i].dead){
                        playernum++;
                    }

                }
    
                ownerModule.updatePlayerNum(playernum)

                this.setState({
                    mafialist:      mafialist,
                })

            }
        })

    }

    componentWillUnmount(){

        if(this.listRef) this.listRef.off()

    }
    
    renderItem(item){
        return <Button
            flex = {0.5}
            horizontal = {0.9}
            opacity = {item.dead?0.6:1}
            onPress = {() => { this._nameBtnPress(item) }}
        >
            <View style = {{flexDirection:'row'}}>
                <View style = {{flex:0.3,justifyContent:'center',alignItems:'center'}}>
                <MaterialCommunityIcons name={item.dead?'skull':item.readyvalue?
                    'check-circle':(item.immune?'needle':(item.status?item.statusname:null))}
                    style={{color:colors.shadow, fontSize:15, alignSelf:'center'}}/>
                </View>
                <View style = {{flex:0.7, justifyContent:'center'}}>
                    <Text style = {styles.player}>{false?item.name + ' (' + Rolesheet[item.roleid].name + ') ':
                        item.name}</Text>
                </View>
            </View>
        
        </Button>
    
    }

    //Pressing any name button
    _nameBtnPress(item){

        playerModule.notification('You have selected ' + item.name + '.')
        playerModule.selectChoice(item.key)
            
    }
    
    render() {
    
        return <FlatList
            data={this.namelist}
            contentContainerStyle={{alignSelf:'center', width:this.width*0.8}}
            renderItem={({item}) => (this.renderItem(item))}
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

export default PlayerListComponent
