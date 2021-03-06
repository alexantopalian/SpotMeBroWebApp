(function () {

  function snapshotToArray(snapshot) {
      var returnArr = [];

      snapshot.forEach(function(childSnapshot) {
          var item = childSnapshot.val();
          item.key = childSnapshot.key;

          returnArr.push(item);
      });

      return returnArr;
  };
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAK7odv2vBxJdDMThZHkBjoNdsypVNDGDU",
    authDomain: "spotmebro-82458.firebaseapp.com",
    databaseURL: "https://spotmebro-82458.firebaseio.com",
    projectId: "spotmebro-82458",
    storageBucket: "spotmebro-82458.appspot.com",
    messagingSenderId: "737240148087"
  };
  firebase.initializeApp(config);

  // Get elements' reference. Later use .value
  // Did not work if I used .value here
  var txtName = document.getElementById("txtName");
  var txtEmail = document.getElementById("txtEmail");
  var txtPassword = document.getElementById("txtPassword");
  var txtPassword2 = document.getElementById("txtConfirmPassword");
  var gender = document.getElementById("gender");
  var secQ = document.getElementById("securityQuestion");
  var secA = document.getElementById("securityAnswer");
  var liftStyle = document.getElementById("style");
  var prefgen = document.getElementById("prefgender");
  const btnSignUp = document.getElementById("btnSignUp");


  // add sign up event
  btnSignUp.addEventListener("click", e => {
    // get email and pass
    var email = txtEmail.value;
    var pass = txtPassword.value;
    var auth = firebase.auth();

    var fbRef2 = firebase.database().ref();
    var tempname = "no name found"
    var query = firebase.database().ref("Users");
    query.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

          var childData = childSnapshot.child("Name").val();
          if (childData == txtName.value)
          {
            tempname = childSnapshot.child("Name").val();
          }
      });
      if(tempname == "no name found")
      {
    // sign in
        if( txtPassword.value == txtPassword2.value)
        {
          const promise = auth.createUserWithEmailAndPassword(email, pass);
          promise.catch(e => alert(e.message));

        }
        else
        {
          console.log('passwords don\'t match');
          alert("Passwords do not match");
        }
      }
      else
      {
        console.log('Name already used!!!!!!!');
        alert("Name already used");
      }
    });
});


          // reference to save data must be set globally
          var fbRef = firebase.database().ref().child('Users');
          // add a real time listener
          firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser)
            {
                /* using .value only works here not at var initialization */
                var uidPERM = firebaseUser.uid;

                /* added Availability as an empty string because if you don't it will be
                  read as null and causes problems later when the user inputs first avail time */
                fbRef.child(uidPERM).set({
                  Name: txtName.value,
                  Answer: secA.value,
                  Availability: "",
                  Email: txtEmail.value,
                  Gender: gender.value,
                  Security: secQ.value,
                });

                // creates the new subset of data, Preferences, for previous entry
                fbRef.child(uidPERM).child("Preferences").set({
                  // unlike mobile app, cannot have space between key's name
                  Preferred_Gender: prefgen.value,
                  Style: liftStyle.value
                });

                // passes hashed id as variable in URL
                window.location = "mainpage.html?uidPerm="+uidPERM;
            }
            else
            {
                console.log('not logged in');
            }
          });



} ());
