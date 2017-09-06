import { AsyncStorage } from "react-native";

export const USER_KEY = "auth-demo-key";

export const onSignIn = () => AsyncStorage.setItem(USER_KEY, "true");

export const onSignOut = () => AsyncStorage.removeItem(USER_KEY);

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USER_KEY)
      .then(res => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};

export const initUser = (token) => {
        fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + token)
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            User.name = json.name
            User.id = json.id
            //user.user_friends = json.friends
            User.email = json.email
            User.username = json.username
            //user.loading = false
            //user.loggedIn = true
            //user.avatar = setAvatar(json.id)
            console.log(User.name);
            console.log(User.id);
            console.log(User.email);
            console.log(User.username);
            this.saveUser()
        })
        .catch(() => {
            reject('Error getting data from Facebook')
        })
}

export const saveUser = () => {
    firebase.database()
    .ref('users/' + User.name)
    .set({
        name: User.name,
        id: User.id,
        email: User.email,
        username: User.username
    });
}