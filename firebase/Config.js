import firebase from 'firebase';
import { Permissions, Notifications } from 'expo';

var userUidKey= []
var newData = []
var count = 0

var config = {
    apiKey: "AIzaSyD3ASjgZK1FLYg87Z_bfmfgmKXAMsQZr24",
    authDomain: "joomok-8c371.firebaseapp.com",
    databaseURL: "https://joomok-8c371.firebaseio.com",
    projectId: "joomok-8c371",
    storageBucket: "",
    messagingSenderId: "930536734258"
};

firebase.initializeApp(config);

const database = firebase.database();
const fireDataBase = firebase.database().ref();

var finalData; 

firebase.auth().onAuthStateChanged(function (user) {
    if(user){
        firebase.database().ref('users/' + user.uid ).set({
            email: user.email,
            uid : user.uid
        });
    }
    
});

var pushMessageAdded = firebase.database().ref('contacts/pushKey');

fireDataBase.on("value",snap => {

    finalData = snap.val()
    //userUidKey 에 회원가입한 목록의 userUid값을 배열 형태로 푸쉬.

    for(const v in finalData.users){
        userUidKey.push(v)
    }

    var starCountRef = firebase.database().ref('contacts/');

    starCountRef.once('value', function(snapshot) {
        firebase.database().ref('/contacts').on('child_added', function (data) {
            newData.push(data)
        })

        var jsonSnap = JSON.parse(JSON.stringify(snapshot));
        var objLen =  Object.keys(jsonSnap).length;
        var messageData = JSON.parse(JSON.stringify(newData[newData.length-2])) 

        //2. 메시지 함에 uid값이 everyone이면 배열로 users 안에 있는 모든 uid값을 긁어와 
        // 모두에게 뿌려주고 아니면 uid 값에 저장된 특정인에게 메시지를 보냄.
        // 또한 지금은 새로고침시 토큰값이 사라지지만 (set인해) 이미 users안에 uid 값이 있다면 다시 덮어쓰지 못하게 막아야함.
        if( objLen > jsonSnap.pushKey ){
            //현재의 배열 숫자가 기존 배열 숫자보다 커지면 (메시지가 추가되면) userUidKey << 로 구분하여 메시지를 보냄.
            firebase.database().ref('users/'+messageData.uid+'/expoToken').once('value').then(function(uid) {
               
                fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "to": uid,
                        "title": messageData.title,
                        "sound": "default",
                        "body": messageData.message
                    })
                }).then(
                    (resolve) => console.log(resolve)
                )

            });
        }
        firebase.database().ref('contacts/').child('pushKey').set(objLen)
    });


})

export default finalData;