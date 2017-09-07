import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },

    //First Change
    transparent_button: {
      marginTop: 10,
      padding: 15
    },
    
    transparent_button_text: {
      color: '#0485A9',
      fontSize: 16
    },

    primary_button: {
      margin: 10,
      padding: 15,
      backgroundColor: '#529ecc'
    },

    primary_button_text: {
      color: '#FFF',
      fontSize: 18
    },

    body: {
      flex: 9,
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },

    textinput: {
      height: 40, 
      width: 120,
      borderColor: 'red', 
      borderWidth: 1
    },

    //Drawer
    icon: {
      width: 26,
      height: 26,
    },
    
    });