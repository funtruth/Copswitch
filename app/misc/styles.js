import React from 'react';
import { StyleSheet }   from 'react-native';
import colors from './colors.js';

export default styles = StyleSheet.create({

    //Lists Header
    header: {
        fontFamily:'FredokaOne-Regular',
        fontSize: 23,
        color: colors.font,
        marginRight:15,
    },
    chevron: {
        color:colors.font, 
        fontSize: 30, 
        alignSelf:'center'
    },

    charfont: {
        fontSize: 17,
        fontFamily: 'FredokaOne-Regular',
        textAlign:'center',
        color: colors.shadow,
        margin:4,
    },
    create: {
        fontSize: 19,
        fontFamily: 'FredokaOne-Regular',
        color: colors.shadow,
        margin:4
    },



    //Lists Screen
    listfont: {
        fontFamily:'FredokaOne-Regular',
        fontSize:22,
        alignSelf:'center',
        color:colors.shadow,
        margin:4,
    },
    descFont: {
        fontFamily:'FredokaOne-Regular',
        fontSize: 18,
        color: colors.font,
        alignSelf:'center',
        lineHeight: 20
    },
    flatListBtn : {
        fontFamily:'FredokaOne-Regular',
        fontSize: 25,
        color: colors.font,
        alignSelf:'center',
        marginTop:10,
        marginBottom:10
    },
    title: {
        fontFamily:'LuckiestGuy-Regular',
        fontSize: 25,
        color: colors.striker,
    },
    titleFont: {
        fontFamily:'LuckiestGuy-Regular',
        fontSize: 25,
        color: colors.main,
    },
    detail: {
        color:colors.shadow,
        fontFamily: 'FredokaOne-Regular',
        fontSize:15,
        lineHeight: 18,
        marginBottom:5,
        marginLeft:10,
        marginRight:10,
    },
    detailContainer: {
        justifyContent:'center',
        marginTop:10,
        marginLeft:10,
        marginRight:10,
    },
    comment: {
        color:colors.shadow,
        fontFamily: 'FredokaOne-Regular',
        fontSize:15,
        lineHeight: 18,
        marginBottom:5,
        marginLeft:10,
        marginRight:10,
    },
    commentContainer: {
        justifyContent:'center',
        marginTop:10,
        marginLeft:10,
        marginRight:10,
    },
    link: {
        color:colors.font,
        fontFamily: 'FredokaOne-Regular',
        fontSize:17,
        lineHeight: 25,
        alignSelf:'center',
        marginBottom:5,
        marginLeft:10,
        marginRight:10,
    },
    linkContainer: {
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        marginLeft:10,
        marginRight:10,
    },
    listButton: {
        fontFamily:'FredokaOne-Regular',
        fontSize:22,
        alignSelf:'center',
        color:colors.font,
        margin:4,
    },
    choiceButton: {
        fontFamily:'FredokaOne-Regular',
        fontSize: 17,
        alignSelf: 'center',
        color: colors.shadow,
        margin:4,
    },

    //Details Screen
    roleDesc: {
        fontSize: 15,
        fontFamily: 'FredokaOne-Regular',
        color: colors.striker,
        marginTop:5,
        marginBottom:5,
    },
    section: {
        fontSize: 17,
        fontFamily: 'FredokaOne-Regular',
        color: colors.background,
        marginTop:5,
        marginBottom:5,
        marginLeft:15
    },
    sectionContainer: {
        backgroundColor: colors.font,
        borderRadius:10,
        marginTop:5,
    },
    message: {
        fontSize: 15,
        fontFamily: 'FredokaOne-Regular',
        color: colors.font,
        marginTop:5,
        marginBottom:5,
    },
    messageContainer: {
        marginTop:5,
        alignItems:'center'
    },
    hidden: {
        fontSize: 15,
        fontFamily: 'FredokaOne-Regular',
        textAlign:'center',
        color: colors.gameback,
        marginLeft: 40,
        marginRight:40,
    },
    chat:{
        fontSize:20,
        fontFamily:'FredokaOne-Regular',
        color:colors.details,
        alignSelf: 'center',
        marginTop:15,
        marginBottom:15,
    },
    leftfont:{
        fontSize:17,
        fontFamily:'FredokaOne-Regular',
        color:colors.striker,
        marginTop:5,
    },
    roomcode: {
        fontSize: 30,
        fontFamily: 'FredokaOne-Regular',
        textAlign:'center',
        color: colors.striker
    },
    digit: {
        flex:0.3,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.font, 
        borderRadius:2,
        margin:5
    },

    //Lobby
    lobbytitle : {
        fontSize: 17,
        fontFamily: 'FredokaOne-Regular',
        color: colors.striker,
    },
    lobbycode : {
        fontSize: 25,
        fontFamily: 'FredokaOne-Regular',
        color: colors.font,
    },
    lobbytext : {
        fontSize: 19,
        fontFamily: 'FredokaOne-Regular',
        color: colors.font,
    },
    lobbylabel: {
        fontSize: 15,
        fontFamily: 'FredokaOne-Regular',
        color: colors.font,
    },
    nameInput: {
        fontFamily:'FredokaOne-Regular',
        fontSize: 18,
        color:colors.font,
        textAlign:'center',
        justifyContent:'center',
    },
    error: {
        fontSize: 15,
        fontFamily: 'FredokaOne-Regular',
        textAlign:'center',
        color: colors.striker,
    },
    textOutput: {
        flex:0.7,
        backgroundColor:colors.font,
        fontFamily:'FredokaOne-Regular',
        fontSize: 30,
        color:colors.background,
        textAlign:'center',
        borderRadius:10,
    },
    textInput: {
        backgroundColor: colors.main,
        fontFamily:'FredokaOne-Regular',
        fontSize: 25,
        color:colors.background,
        textAlign:'center',
        borderRadius:30,
    },
    playerList: {
        fontSize: 16,
        fontFamily: 'FredokaOne-Regular',
        color: colors.font,
        alignSelf:'center',
        margin:5,
        opacity:0.7,
    },

    //General
    sfont: {
        fontFamily: 'FredokaOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    font: {
        fontSize:15,
        fontFamily:'FredokaOne-Regular',
        color:colors.font,
        alignSelf: 'center',
    },
    mfont: {
        fontSize: 19,
        fontFamily: 'FredokaOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    plainfont: {
        color: colors.font,
        margin:5,
        fontFamily: 'FredokaOne-Regular',
    },

    //GAME
    roleFont: {
        fontSize:17,
        fontFamily:'LuckiestGuy-Regular',
        color:colors.font,
    },
    player: {
        fontSize: 16,
        fontFamily: 'FredokaOne-Regular',
        color: colors.shadow,
        margin:5,
    },
    cancelButton: {
        fontSize: 16,
        fontFamily: 'FredokaOne-Regular',
        color: colors.shadow,
        margin:5,
    }

})