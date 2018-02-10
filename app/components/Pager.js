import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import { CustomButton } from './CustomButton';

export class Pager extends React.Component {

constructor(props) {
    super(props);

    this.height = Dimensions.get('window').height;
    this.width = Dimensions.get('window').width;
}

/*
props.page refers to the page the user is allowed to navigate to
    This is ONLY RELEVANT for LISTSCREEN
props.currentpage refers to the page the user is CURRENTLY on
props.lastpage refers to the number of pages a certain section has
*/

render() {

    this.firstpage = this.props.currentpage==1;
    this.lastpage = this.props.currentpage == this.props.lastpage;
    this.forwardDisabled = this.props.page<=this.props.currentpage;

    return ( 
        <View>
            <View style = {{bottom:0, left:0, width:this.width*0.25, justifyContent:'center'}}>
                {this.firstpage?null:<CustomButton
                    size = {1}
                    flex = {0.8}
                    backgroundColor = {colors.shadow}
                    onPress = {this.props.goBack}
                ><Text style = {styles.pagerButton}>Prev Page</Text>
                </CustomButton>}
            </View>

            <View style = {{bottom:0, right:0, width:this.width*0.25, justifyContent:'center'}}>
                {this.lastpage?null:<CustomButton
                    size = {1}
                    flex = {0.8}
                    backgroundColor = {colors.shadow}
                    onPress = {this.props.goForward}
                    disabled = {this.forwardDisabled}
                ><Text style = {styles.pagerButton}>Next Page</Text>
                </CustomButton>}
            </View>
        </View>
    )
}
}
