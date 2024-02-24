const firebaseConfig = {
    apiKey: "AIzaSyCDbWcjDOg7L4_TgA7B3m7IfpSgfxdZeCU",
    authDomain: "anonchatbox.firebaseapp.com",
    projectId: "anonchatbox",
    storageBucket: "anonchatbox.appspot.com",
    messagingSenderId: "824201855497",
    appId: "1:824201855497:web:6eaa5ed827353a0ff02ed8",
    measurementId: "G-4X61XV634T"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();
  
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

var email = "";
var password = "";
var username = "";

function register() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var username = document.getElementById("username").value;

  // Ensure Firebase Authentication and Realtime Database are properly initialized
  if (!firebase.auth() || !firebase.database()) {
      console.error("Firebase Authentication or Realtime Database is not properly initialized.");
      return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function() {
     var user = firebase.auth().currentUser;
     console.log(user + " created!");

     // Ensure user.uid is generated correctly
     if (!user || !user.uid) {
         console.error("Error: user.uid not generated correctly.");
         return;
     }

     var user_data = {
         email: email,
         username: username,
         last_login: Date.now()
     };

     var data_ref = firebase.database().ref('users/' + user.uid);

     // Set user data in the database
     data_ref.set(user_data)
     .then(function() {
         console.log("User data saved successfully!");
         window.location.href = "index.html";
     })
     .catch(function(error) {
         console.error("Error saving user data:", error);
         // You might want to handle the error and display it to the user
     });
  })
  .catch(function(error) {
      alert(error.message);
  });
}


function logout(){
  auth.signOut()
  .then(function() {
    window.location.href = "index.html";
    alert("Logout Successfully!!!");
  }).catch(function(error) {
    // An error happened.
    console.error(error);
  });
}

function login(){
  email = document.getElementById("email").value;
  password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(function()
    {
        var user = auth.currentUser;
        alert("Welcome! "+user);

        var log_data_ref = database.ref();

        var user_data = {
            last_login : Date.now()
        }
        isLogged = true;
        log_data_ref.child('users/'+user.uid).update(user_data);
        window.location.href = "dashboard.html";
        
    })
    .catch(function(error) {
        alert(error.message);
    })
  }

  function send_msg()
  {
    check_auth();

    var mdata_ref = database.ref();

    var usersRef = database.ref('users');
    var usern = "";
    var msg = document.getElementById("message").value
    var msg_data = "";
    
    usersRef.orderByChild('email').equalTo(auth.currentUser.email).once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        // Get the username associated with the email
        usern = childSnapshot.val().username;

        msg_data = {
          uid : auth.currentUser.uid,
          username: usern,
          message : msg,
          time_sent : Date.now()
        }
        
        mdata_ref.child('messages/').push(msg_data);
      });
    });

    document.getElementById("message").value = "";
  }

  function check_auth()
{
  auth.onAuthStateChanged(function(user) {
  if (user) {
    var gdata_ref = database.ref("messages");

    gdata_ref.once('value', function(snapshot) {
      // Handle the data
      var data = snapshot.val();
    }, function(error) {
      // Handle any errors
      console.error("Error fetching data:", error);
    });
  } else {
    alert("login first!!!");
    window.location.href = "index.html";
  }
});
}

function showMsg()
{
  try{
  var kdata_ref = database.ref("messages");

    kdata_ref.orderByChild('time_sent').once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      // Access each message
      var message = childSnapshot.val();
      var cls = "theirMessage";
      if(message.uid == auth.currentUser.uid){
        cls = "myMessage";
      }
      // Do something with the message
      document.getElementById("msg-boxes").innerHTML+=`<div class="col ${cls}"><h1 class="fs-6 fw-semibold">${message.username}</h1><p class="fw-light">${message.message}</p><p class="fw-light" style="font-size: 12px;">${timeAgo(message.time_sent)}</p></div>`;
    });
  }).catch(function(error) {
    console.error('Error retrieving messages:', error);
  });
}catch{
  //none
}
}

function timeAgo(timestamp) {
  // Get the current time in milliseconds
  var now = Date.now();

  // Calculate the difference in milliseconds
  var difference = now - timestamp;

  // Convert the difference to minutes
  var minutes = Math.floor(difference / 60000); // 1 minute = 60000 milliseconds

  // Return the formatted string
  return `sent ${minutes} minutes ago`;
}

function time_con(args)
{
  var date = new Date(args);

  // Extract the date and time components
  
// Extract the date and time components
  var year = date.getFullYear();
  var month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
  var day = ('0' + date.getDate()).slice(-2);
  var hours = ('0' + date.getHours()).slice(-2);
  var minutes = ('0' + date.getMinutes()).slice(-2);
  var seconds = ('0' + date.getSeconds()).slice(-2);

  // Construct the formatted date and time string
  var formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
}

