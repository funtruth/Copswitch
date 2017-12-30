import React from 'react';
import { StyleSheet }   from 'react-native';
import colors from './colors.js';

export default styles = StyleSheet.create({

    //SPLASH
    continue: {
        fontSize:20,
        fontFamily:'Bungee-Regular',
        color:colors.background,
        alignSelf: 'center',
        marginTop:5
    },

    //Lists Header
    header: {
        fontFamily:'Bungee-Regular',
        fontSize: 25,
        color: colors.shadow,
    },

    //Lists Screen
    normalFont: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 18,
        color: colors.font,
    },
    descFont: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 18,
        color: colors.font,
        alignSelf:'center',
        lineHeight: 20
    },
    centeredBtn: {
        fontFamily:'LuckiestGuy-Regular',
        fontSize: 18,
        color: colors.font,
        alignSelf:'center',
    },
    centeredBtnPressed: {
        fontFamily:'LuckiestGuy-Regular',
        fontSize: 18,
        color: colors.font,
        alignSelf:'center',
    },
    flatListBtn : {
        fontFamily:'ConcertOne-Regular',
        fontSize: 25,
        color: colors.font,
        alignSelf:'center',
        marginTop:10,
        marginBottom:10
    },
    titleFont: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 25,
        color: colors.main,
    },
    detail: {
        color:colors.shadow,
        fontFamily: 'ConcertOne-Regular',
        fontSize:17,
        lineHeight: 25,
        alignSelf:'center',
        marginBottom:5,
        marginLeft:10,
        marginRight:10,
    },
    detailContainer: {
        borderRadius:2,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        marginLeft:10,
        marginRight:10,
    },
    comment: {
        color:colors.shadow,
        fontFamily: 'ConcertOne-Regular',
        fontSize:17,
        lineHeight: 25,
        alignSelf:'center',
        marginBottom:5,
        marginLeft:10,
        marginRight:10,
    },
    commentContainer: {
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        marginLeft:10,
        marginRight:10,
    },
    link: {
        color:colors.font,
        fontFamily: 'ConcertOne-Regular',
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

    //Details Screen
    roleDesc: {
        fontSize: 18,
        fontFamily: 'LuckiestGuy-Regular',
        textAlign:'center',
        color: colors.shadow,
        marginLeft: 40,
        marginRight:40,
    },
    hidden: {
        fontSize: 15,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.gameback,
        marginLeft: 40,
        marginRight:40,
    },
    chat:{
        fontSize:20,
        fontFamily:'LuckiestGuy-Regular',
        color:colors.details,
        alignSelf: 'center',
        marginTop:15,
        marginBottom:15,
    },
    leftfont:{
        fontSize:17,
        fontFamily:'LuckiestGuy-Regular',
        color:colors.shadow,
        marginTop:5,
    },

    //Join Tutorial
    roomcode: {
        fontSize: 40,
        fontFamily: 'LuckiestGuy-Regular',
        textAlign:'center',
        color: colors.shadow,
    },
    subtitle : {
        fontSize: 20,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.shadow,
    },
    digit: {
        flex:0.3,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.font, 
        borderRadius:2,
        margin:5
    },
    nameInput: {
        backgroundColor: colors.main,
        fontFamily:'LuckiestGuy-Regular',
        fontSize: 20,
        color:colors.shadow,
        textAlign:'center',
        borderTopLeftRadius:25,
        borderBottomLeftRadius:25,
    },
    textInput: {
        backgroundColor: colors.main,
        fontFamily:'LuckiestGuy-Regular',
        fontSize: 40,
        color:colors.menubtn,
        textAlign:'center',
        borderRadius:30,
    },
    playerList: {
        fontSize: 25,
        fontFamily: 'LuckiestGuy-Regular',
        textAlign:'center',
        color: colors.lightshadow,
        margin:5,
    },

    //Create Tutorial
    options: {
        fontSize: 20,
        fontFamily: 'ConcertOne-Regular',
        marginLeft:20,
        color: colors.font,
    },
    title : {
        fontSize: 30,
        fontFamily: 'LuckiestGuy-Regular',
        textAlign:'center',
        color: colors.shadow,
    },
    subtitle : {
        fontSize: 20,
        fontFamily: 'LuckiestGuy-Regular',
        textAlign:'center',
        color: colors.shadow,
    },
    menuBtn : {
        fontFamily:'LuckiestGuy-Regular',
        fontSize: 25,
        color: colors.font,
        alignSelf:'center'
    },
    error: {
        fontSize: 15,
        fontFamily: 'LuckiestGuy-Regular',
        textAlign:'center',
        color: colors.shadow,
    },
    textOutput: {
        flex:0.4,
        fontFamily:'LuckiestGuy-Regular',
        fontSize: 40,
        color:colors.menubtn,
        textAlign:'center',
    },

    //General
    dfont: {
        fontSize:17,
        fontFamily:'ConcertOne-Regular',
        color:colors.background,
        alignSelf: 'center',
    },
    lfont: {
        fontSize:17,
        fontFamily:'LuckiestGuy-Regular',
        color:colors.font,
        alignSelf: 'center',
    },
    lsfont: {
        fontSize:12,
        fontFamily:'LuckiestGuy-Regular',
        color:colors.font,
        alignSelf: 'center',
    },
    sfont: {
        fontSize: 15,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.shadow,
    },
    font: {
        fontSize:17,
        fontFamily:'LuckiestGuy-Regular',
        color:colors.shadow,
        alignSelf: 'center',
    },
    subfont: {
        fontSize:17,
        fontFamily:'LuckiestGuy-Regular',
        color:colors.shadow,
        alignSelf: 'center',
    },
    mfont: {
        fontSize: 30,
        fontFamily: 'LuckiestGuy-Regular',
        textAlign:'center',
        color: colors.shadow,
    },
    mlfont: {
        fontSize: 30,
        fontFamily: 'LuckiestGuy-Regular',
        textAlign:'center',
        color: colors.font,
    },

})