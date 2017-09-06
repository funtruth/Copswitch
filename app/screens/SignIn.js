import React from "react";
import { View } from "react-native";
import { Card, Button, FormLabel, FormInput } from "react-native-elements";
import { onSignIn } from "../auth";

import styles from "../styles/Styles";

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
} = FBSDK; 

export default ({ navigation }) => (

  <View style={{ paddingVertical: 20 }}>
    <Card>
      <FormLabel>Email</FormLabel>
      <FormInput placeholder="Email address..." />
      <FormLabel>Password</FormLabel>
      <FormInput secureTextEntry placeholder="Password..." />
      <FormLabel>Confirm Password</FormLabel>
      <FormInput secureTextEntry placeholder="Confirm Password..." />

      <Button
        buttonStyle={{ marginTop: 10 }}
        backgroundColor="#03A9F4"
        title="LOG IN"
        onPress={() => {
          onSignIn().then(() => navigation.navigate("SignedIn"));
        }}
      />
      <Button
        backgroundColor="transparent"
        textStyle={{ color: "#bcbec1" }}
        title="Sign Up"
        onPress={() => navigation.navigate("SignUp")}
      />
      <LoginButton 
        publishPermissions={["publish_actions"]}
        onLoginFinished={
            (error, result) => {
                if (error) {
                    alert("Login failed with error: " + result.error);
                } else if (result.isCancelled) {
                    alert("Login was cancelled");
                } else {
                    //AccessToken.getCurrentAccessToken().then((data) => {
                        //const { accessToken } = data
                        //this.initUser(accessToken)
                    //})
                    onSignIn().then(() => navigation.navigate("SignedIn"));
                }
            }
        }/>
    </Card>
  </View>
);