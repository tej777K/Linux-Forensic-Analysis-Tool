/*
File: script.js
Authors:
  - Deepti Bhat 
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase, ref, push, set, get, update } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

//FireBase Configuration
const firebaseConfig = {
  //Enter your firebaseConfig
};

//Intialize FireBase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

//index.html sign-in elements
const signin = document.getElementById("signin");
const signup = document.getElementById("signup");
const submitButton = document.getElementById("submit");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

//index.html sign-up elements
const signupEmailIn = document.getElementById("email-signup");
const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
const createacctbtn = document.getElementById("create-acct-btn");

//sign-up variables
var email, password, signupEmail, signupPassword, confirmSignupEmail, confirmSignUpPassword;

//If on sign-in page, switch to sign-up page
if(signup){
    signup.addEventListener("click", function() {
        document.getElementById("signin-container").style.display = "none";
        document.getElementById("signup-container").style.display = "block";
    });
}
//If on sign-up page, switch to sign-in page
if(signin){
    signin.addEventListener("click", function() {
        document.getElementById("signup-container").style.display = "none";
        document.getElementById("signin-container").style.display = "block";
    });
}

//Fetch user details from FireBase
async function fetch() {
  try{
  const userEmail = sessionStorage.getItem('userEmail');
  const usersRef = ref(db, 'lhedge-signin'); //Branch 'lhedge-sigin' in Realtime Database
  const usersSnapshot = await get(usersRef);

  if (usersSnapshot.exists()) {
      usersSnapshot.forEach((userSnapshot) => {
          const userID = userSnapshot.key; // Get the user ID
          const userData = userSnapshot.val(); // Get the user data

          if (userData && userData.email == userEmail) {
              console.log(`User ID: ${userID}, Email: ${userData.email}`);
              const curlff = userData.lff; //Get user's current login fail frequency
              const curlfd = userData.lfd; //Get user's current login fail duration
              const curpcf = userData.pcf; //Get user's current password change frequency
              const curpcd = userData.pcd; //Get user's current password change duration
              const curmmpath = userData.mmpath; //Get user's current malware monitoring path
              const lfservice = userData.lfservice; //Get user's current login fail service status
              const pcservice = userData.pcservice; //Get user's current password change service status
              const mmservice = userData.mmservice; //Get user's current malware monitoring service status
              //Store user details in session storage
              sessionStorage.setItem("slff", curlff);
              sessionStorage.setItem("slfd", curlfd);
              sessionStorage.setItem("spcf", curpcf);
              sessionStorage.setItem("spcd", curpcd);
              sessionStorage.setItem("smmpath", curmmpath);
              sessionStorage.setItem("slfservice", lfservice);
              sessionStorage.setItem("spcservice", pcservice);
              sessionStorage.setItem("smmservice", mmservice);
              //Display user details on account.html
              document.getElementById('curlff').innerHTML = `${curlff}`;
              document.getElementById('curlfd').innerHTML = `${curlfd}`;
              document.getElementById('curpcf').innerHTML = `${curpcf}`;
              document.getElementById('curpcd').innerHTML = `${curpcd}`;
              document.getElementById('curmmpath').innerHTML = `${curmmpath}`;
              document.getElementById('curmmpath').style.color = "black";
              document.getElementById('curmmpath').style.fontSize = "1.3em";
              document.getElementById('curmmpath').style.backgroundColor = "white";
              document.getElementById('curmmpath').style.marginLeft = "-40%";
              document.getElementById('curmmpath').style.fontWeight = "100";
          }
      });
  } else {
      console.log("No users found in the database.");
  }
} catch (error) {
  console.error("Error retrieving user data:", error);
}
}

//Submits username and password for sign-in
if(submitButton){
submitButton.addEventListener("click", function(e) {
  e.preventDefault();
  email = emailInput.value;
  password = passwordInput.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      sessionStorage.setItem("user", user);
      sessionStorage.setItem("userEmail", user.email);
      //Display loader after successful sign-in
      const loaderContainer = document.querySelector('.loader-container');
      loaderContainer.classList.add('show');
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(); 
        }, 1000);
      });
      timeoutPromise.then(() => {
        window.location.href = 'account.html';
      });
      document.getElementById("login-form").reset();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error occurred. Try again.");
      window.alert(errorMessage);
    });
});
}

//Submits username and password for sign-up
if(createacctbtn) {
createacctbtn.addEventListener("click", function(e) {
  e.preventDefault();
  var isVerified = true;
  signupEmail = signupEmailIn.value;
  confirmSignupEmail = confirmSignupEmailIn.value;
  if(signupEmail != confirmSignupEmail) {
      window.alert("Email fields do not match. Try again.")
      isVerified = false;
  }
  signupPassword = signupPasswordIn.value;
  confirmSignUpPassword = confirmSignUpPasswordIn.value;
  if(signupPassword != confirmSignUpPassword) {
      window.alert("Password fields do not match. Try again.")
      isVerified = false;
  }
  if(signupEmail == null || confirmSignupEmail == null || signupPassword == null || confirmSignUpPassword == null) {
    window.alert("Please fill out all required fields.");
    isVerified = false;
  }
  if(isVerified) {
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then((userCredential) => {
      const user = userCredential.user;
      const parentRef = ref(db, 'lhedge-signin');
      //Add default values to the new user
      const dataToAdd = {
        email: signupEmail,
        lff: 1,
        lfd: 1,
        pcf: 1,
        pcd: 1,
        mmpath: "null",
        lfservice: "false",
        pcservice: "false",
        mmservice: "false"
      };
      const newEntryRef = push(parentRef);
      set(newEntryRef, dataToAdd)
      .then(() => {
        window.alert("Account created successfully!");
        console.log("Data added successfully!");
      })
      .catch((error) => {
        console.error("Error adding data: ", error);
      });
        document.getElementById("reg-form").reset();
    })
    .catch((error) => {
      const errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters. Please try again.";
      }
      if(errorCode == "auth/invalid-email"){
          errorMessage = "Invalid Email ID";
      }
      if(errorCode == "auth/email-already-in-use"){
          errorMessage = "Email already in use. Try Logging In.";
      }
    });
  }
});
}

//account.html profile update
const form = document.getElementById('profile');
const profileSubmitButton = document.getElementById('profile-submit');
if(form){
  //Opened account.html, fetch user details
  fetch();
  //Submit new updates to user details
  profileSubmitButton.addEventListener('click', async function(event) {
  event.preventDefault(); 
  const formData = new FormData(form);
  const lff = formData.get('lff');
  const lfd = formData.get('lfd');
  const pcf = formData.get('pcf');
  const pcd = formData.get('pcd');
  const mmpath = formData.get('mmpath');
  try {
    const userEmail = sessionStorage.getItem('userEmail');
    const usersRef = ref(db, 'lhedge-signin'); 
    const usersSnapshot = await get(usersRef);
    if (usersSnapshot.exists()) {
        usersSnapshot.forEach((userSnapshot) => {
            const userID = userSnapshot.key; 
            const userData = userSnapshot.val(); 
  
            if (userData && userData.email == userEmail) {
              const nodePath = `lhedge-signin/${userID}`;
              const newData = {
                email: userEmail,
                lff: lff,
                lfd: lfd,
                pcf: pcf,
                pcd: pcd,
                mmpath: mmpath 
            };
            update(ref(db, nodePath), newData)
                .then(() => {
                    console.log("Attribute updated successfully!");
                    fetch();
                })
                .catch((error) => {
                    console.error("Error updating attribute:", error);
                });
            }
        });
    } else {
        console.log("No users found in the database.");
    }
  } catch (error) {
    console.error("Error retrieving user data:", error);
  }
  form.reset('profile');
  });
}
