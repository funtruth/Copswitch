import React, { Component } from 'react';
import { 
    View, 
    Text,
    FlatList,
} from 'react-native';

import { Button } from '../../components/Button.js';
import firebaseService from '../../firebase/firebaseService.js';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import playerModule from '../mods/playerModule.js';

class PlayerListComponent extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            message:null
        }

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
    
                    //player number and trigger number + gamestate
                    if(!this.namelist[i].dead){
    
                        playernum++;
    
                        if(Rolesheet[this.namelist[i].roleid].type == 1){
                            balance--;
                        } else {
                            balance++;
                        }
                    }
                }
    
                
    
                /*this.setState({
                    playernum:      playernum,
                    triggernum:     ((playernum - playernum%2)/2)+1,
                    gameover:       balance == playernum || balance <= 0,
    
                    mafialist:      mafialist,
                })*/
            }
        })

    }

    componentWillUnmount(){

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

        this.setState({message:'You have selected ' + item.name + '.'})

        //Set your choice to your child reference
        //this.choiceRef.child(this.state.place).set(item.key).then(()=>{this.myReadyRef.set(true)})
            
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
