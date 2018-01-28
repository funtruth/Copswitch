const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

 exports.roomCreated = functions.database.ref('rooms/{roomid}/daycounter').onCreate(event => {
    return (
        event.data.ref.set(event.data.val()+1).then(()=>{
            event.data.ref.parent.child('wtf').set(2)
        })   
    )
 });

 exports.testFunction = functions.database.ref('rooms/{roomid}/wtf').onCreate(event =>{

    const testRef = event.data.ref
    const numRef = testRef.parent.child('phase');

    return numRef.once('value').then(playernum=>{
        testRef.set(playernum.val())
    })
        
 })

 exports.countPlayers = functions.database.ref('rooms/{roomid}/ready').onWrite(event=>{

    const readyRef = event.data.ref
    const children = event.data.numChildren()

    const testRef = readyRef.parent.child('test')

    return testRef.set(children)

 })

exports.updatePlayerNum = functions.database.ref('rooms/{roomid}/listofplayers').onWrite(event=>{
    //Listens to new dead players to update the player number
})