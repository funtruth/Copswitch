"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require('firebase-admin');
function get(path) {
    return admin.database().ref(path).once('value').then(snapshot => {
        return snapshot.val();
    });
}
exports.get = get;
function set(path, value) {
    return admin.database().ref(path).set(value);
}
exports.set = set;
function update(path, value) {
    return admin.database().ref(path).update(value);
}
exports.update = update;
function remove(path) {
    return admin.database().ref(path).remove();
}
exports.remove = remove;
//# sourceMappingURL=db.js.map