/*
File: services_script.js
Authors:
  - Deepti Bhat 
*/ 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

//FireBase Configuration
const firebaseConfig = {
  //Enter your firebaseConfig
};

//Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

//Retrieve data from session storage
var userEmail = sessionStorage.getItem('userEmail');
var slff = sessionStorage.getItem('slff');
var slfd = sessionStorage.getItem('slfd');
var spcf = sessionStorage.getItem('spcf');
var spcd = sessionStorage.getItem('spcd');
var smmpath = sessionStorage.getItem('smmpath');
var lfservice = sessionStorage.getItem('slfservice');
var pcservice = sessionStorage.getItem('spcservice');
var mmservice = sessionStorage.getItem('smmservice');

const { exec } = require('child_process');

//Variables to check if the scripts are running
let isLoginRunning = false;
let isPassRunning = false;
let isMalwareRunning = false;

//Upon loading the page, check if the scripts are supposed to be running
document.addEventListener('DOMContentLoaded', function () {
    if (lfservice == "true") {
        //stopLoginScript();
        document.getElementById("script1").click();  
    }
    if (pcservice == "true") {
        //stopPassScript();
        document.getElementById("script1").click();
    }
    if (mmservice == "true") {
        //stopMalwareScript();
        document.getElementById("script1").click();
    }
  });

//Update attribute values in the database
async function updateData() {  
    try {
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
                    lff: slff,
                    lfd: slfd,
                    pcf: spcf,
                    pcd: spcd,
                    mmpath: smmpath,
                    lfservice: lfservice,
                    pcservice: pcservice,
                    mmservice: mmservice
                };
                update(ref(db, nodePath), newData)
                    .then(() => {
                        console.log("Attribute updated successfully!");
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
}

//Run the Login Python Script
function runLoginScript() {
    document.getElementById("script1text").style.color = "#116b70";
    if (isLoginRunning == false) {
        isLoginRunning = true;
        lfservice = "true";
        updateData();
        exec(`python3 launch_failed_login_monitor.py ${slff} ${slfd} ${userEmail}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error}`);
                return;
            }
            if (stderr) {
                console.error(`Python script stderr: ${stderr}`);
                return;
            }
            console.log(`Python script stdout: ${stdout}`)
        });
    } else {
        console.log("Script is already running.");
    }
}
//Run the Password Python Script
function runPassScript() {
    document.getElementById("script2text").style.color = "#116b70";
    if (isPassRunning == false) {
        isPassRunning = true;
        pcservice = "true";
        updateData();
        exec(`python3 launch_failed_password_monitor.py ${spcf} ${spcd} ${userEmail}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error}`);
                return;
            }
            if (stderr) {
                console.error(`Python script stderr: ${stderr}`);
                return;
            }
            console.log(`Python script stdout: ${stdout}`)
        });
    } else {
        console.log("Script is already running.");
    }
}
//Run the Malware Python Script
function runMalwareScript() {
    document.getElementById("script3text").style.color = "#116b70";
    if (isMalwareRunning == false) {
        isMalwareRunning = true;
        mmservice = "true";
        updateData();
        exec(`python3 detect_malware.py ${smmpath} ${userEmail}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error}`);
                return;
            }
            if (stderr) {
                console.error(`Python script stderr: ${stderr}`);
                return;
            }
            console.log(`Python script stdout: ${stdout}`)
        });
    } else {
        console.log("Script is already running.");
    }
}

//Stop the Login Python Script
function stopLoginScript() {
    document.getElementById("script1text").style.color = "#960000";
    isLoginRunning = false;
    lfservice = "false";
    updateData();
    exec('sudo pkill -f launch_failed_login_monitor', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error stopping Python script: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`Error stopping Python script: ${stderr}`);
            return;
        }
        console.log(`Python script stopped: ${stdout}`);
    });
}
//Stop the Password Python Script
function stopPassScript() {
    document.getElementById("script2text").style.color = "#960000";
    isPassRunning = false;
    pcservice = "false";
    updateData();
    exec('sudo pkill -f launch_failed_password_monitor', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error stopping Python script: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`Error stopping Python script: ${stderr}`);
            return;
        }
        console.log(`Python script stopped: ${stdout}`);
    });
}
//Stop the Malware Python Script
function stopMalwareScript() {
    document.getElementById("script3text").style.color = "#960000";
    isMalwareRunning = false;
    mmservice = "false";
    updateData();
    exec('sudo pkill -f detect_malware', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error stopping Python script: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`Error stopping Python script: ${stderr}`);
            return;
        }
        console.log(`Python script stopped: ${stdout}`);
    });
}

//Event listener for the service sliders
document.getElementById("script1").addEventListener("change", function() {
    if (this.checked) {
        runLoginScript();
    } else {
        stopLoginScript();
    }
});
document.getElementById("script2").addEventListener("change", function() {
    if (this.checked) {
        runPassScript();
    } else {
        stopPassScript();
    }
});
document.getElementById("script3").addEventListener("change", function() {
    if (this.checked) {
        runMalwareScript();
    } else {
        stopMalwareScript();
    }
});
document.getElementById("logout").addEventListener("click", function() {
        stopLoginScript();
        stopPassScript();
        stopMalwareScript();
});
