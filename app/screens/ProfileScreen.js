
import React from 'react';
import {
    View,
    Image
}   from 'react-native';
//import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Card, Button, Text } from "react-native-elements";
import { onSignOut } from "../auth";

export default ({ navigation }) => (
    <View style={{ paddingVertical: 20 }}>
      <Card title="John Doe">
        <View
          style={{
            backgroundColor: "#bcbec1",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 40,
            alignSelf: "center",
            marginBottom: 20
          }}
        >
          <Text style={{ color: "white", fontSize: 28 }}>JD</Text>
        </View>
        <Button
          backgroundColor="#03A9F4"
          title="SIGN OUT"
          onPress={() => onSignOut().then(() => navigation.navigate("SignedOut"))}
        />
        <Button
            backgroundColor="#03A9F4"
            onPress={() => navigation.navigate('DrawerOpen')}
            title="Open Drawer Navigator"
        />
      </Card>
    </View>

    
  );