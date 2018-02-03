const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.voteRef = functions.database.ref('rooms/{roomid}/votes').onWrite(event=>{
    
    const voteRef = event.data.ref
    const numRef = voteRef.parent.child('playernum')
    const testRef = voteRef.parent.child('test')

    const children = event.data.numChildren()

    return numRef.once('value').then(snap=>{

        if(children == snap.val()){
           testRef.set('success!')
        } else {
            testRef.set(children)
        }
    })

})