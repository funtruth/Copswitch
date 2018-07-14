import firebase from 'react-native-firebase';
import FirebaseService from "./firebaseService";

import { AccessToken, LoginManager, GraphRequest, GraphRequestManager } from "react-native-fbsdk";

class FacebookService {
  async getAccessToken() {
    const data = await AccessToken.getCurrentAccessToken()
    return data.accessToken
  }

  _responseInfoCallback(error, result) {
    if (error) {
      console.log("error processing request:", error)
    }
    else {
      console.log(result.data)
      // Do something with friends here!
      return result.data
    }
  }

  getFriends(id, accessToken) {
    const postRequestConfig = {
        httpMethod: 'GET',
        version: 'v3.0',
        accessToken: accessToken.toString()
    };
    const infoRequest = new GraphRequest(
        `/${id}/friends`,
        postRequestConfig,
        this._responseInfoCallback
    );
    const GRManager = new GraphRequestManager().addRequest(infoRequest).start()

  }

  async signInAndGetUserData() {
    const result = await LoginManager.logInWithReadPermissions(['public_profile'])
    if (result.isCancelled) return
    const data = await AccessToken.getCurrentAccessToken()
    const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken)
    const userInfo = await firebase.auth().signInAndRetrieveDataWithCredential(credential)
    return userInfo
  }
}
export default new FacebookService();