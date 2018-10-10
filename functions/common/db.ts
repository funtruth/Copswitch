const admin = require('firebase-admin');

export function get(path) {
  return admin.database().ref(path).once('value').then(snapshot => {
    return snapshot.val();
  });
}

export function set(path, value) {
  return admin.database().ref(path).set(value)
}

export function update(path, value) {
  return admin.database().ref(path).update(value)
}

export function remove(path) {
  return admin.database().ref(path).remove();
}