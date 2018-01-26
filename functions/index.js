const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

 exports.roomCreated = functions.database.ref('rooms/{roomid}/daycounter').onCreate(event => {
    return (
        event.data.ref.set(event.data.val()+1),
        event.data.ref.parent.child('wtf').set(2)
    )
 });
