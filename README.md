# Lhedge Services for Parrot OS

Lhedge is a Forensic Analysis Tool that can be used on Parrot OS to avail the following security servies:
<ul>
    <li>Detection of Failed Logins into the System</li>
    <li>Detection of Password Changes</li>
    <li>Detection of Malwares in Directories</li>
</ul>
Any suspicious activity that is detected is emailed with the forensic details to the registered user.
<br><br>
<img src="lhedge_signin.png" alt="Signin Page" width="600px" height="450px"/>
<hr>
Please ensure you download the following dependencies before using Lhedge Services for Parrot OS:

1. **Install Rsyslog**
    ```sh
    sudo apt update
    sudo apt install rsyslog
    sudo systemctl enable rsyslog
    sudo systemctl start rsyslog
    sudo systemctl status rsyslog
    ```

2. **Install Python3-Docx**
    ```sh
    sudo apt install python3-docx
    ```

3. **Install Watchdog**
    ```sh
    sudo apt install python3-watchdog
    ```

4. **Install ClamAV**
    ```sh
    sudo apt update
    sudo apt install clamav clamav-daemon
    sudo freshclam
    sudo systemctl enable clamav-daemon
    sudo systemctl start clamav-daemon
    sudo systemctl status clamav-daemon
    ```

5. **Install GeoIPLookup**
    ```sh
    sudo apt install geoip-bin
    ```

## Set Up Download Directory

1. **Create a folder and install NW.js inside it**
    ```sh
    cd /path/to/directory
    npm init -y
    npm install nw --save-dev
    ```

2. **Copy and paste all the files of Lhedge-Version1 into directory.**

3. **Create a desktop launcher into the directory.**
    ```sh
    cd /path/to/directory
    sudo python3 run.py
    ```

4. **Cut and paste `Lhedge.desktop` into your Desktop for easy access to the app.**

### Alternative: Access the app through the terminal

1. **Give a command in your directory through the terminal to access the app.**
    ```sh
    cd /path/to/directory
    sudo npx nw .
    ```
