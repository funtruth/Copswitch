import React, { Component } from 'react';
import { 
    View, 
    Text,
    FlatList,
} from 'react-native';

import { Button } from '../../components/Button.js';
import firebaseService from '../../firebase/firebaseService.js';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class PlayerListComponent extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            message:null
        }
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
