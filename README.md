Lhedge Services for Parrot OS
Lhedge is a Forensic Analysis Tool that can be used on Parrot OS to avail the following security servies:

Detection of Failed Logins into the System
Detection of Password Changes
Detection of Malwares in Directories
Any suspicious activity that is detected is emailed with the forensic details to the registered user.

Signin Page

Please ensure you download the following dependencies before using Lhedge Services for Parrot OS:
Install Rsyslog

sudo apt update
sudo apt install rsyslog
sudo systemctl enable rsyslog
sudo systemctl start rsyslog
sudo systemctl status rsyslog
Install Python3-Docx

sudo apt install python3-docx
Install Watchdog

sudo apt install python3-watchdog
Install ClamAV

sudo apt update
sudo apt install clamav clamav-daemon
sudo freshclam
sudo systemctl enable clamav-daemon
sudo systemctl start clamav-daemon
sudo systemctl status clamav-daemon
Install GeoIPLookup

sudo apt install geoip-bin
Set Up Download Directory
Create a folder and install NW.js inside it

cd /path/to/directory
npm init -y
npm install nw --save-dev
Copy and paste all the files of Lhedge-Version1 into directory.

Create a desktop launcher into the directory.

cd /path/to/directory
sudo python3 run.py
Cut and paste Lhedge.desktop into your Desktop for easy access to the app.

Alternative: Access the app through the terminal
Give a command in your directory through the terminal to access the app.
cd /path/to/directory
sudo npx nw .
