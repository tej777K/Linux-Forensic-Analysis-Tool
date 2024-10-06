"""
File: send_mail.py
Authors:
    - Deepti Bhat
    - Harshitha S M
"""
import smtplib
import ssl
import sys
from email.message import EmailMessage

email_sender = ''
email_password = ''
email_receiver = sys.argv[2]

#Email Content
subject = 'Latest Linux Forensic Report'
body = """
Hello,

   We have attached the latest Linux forensic report for your review due to the detection of suspicious activities on the system.
   
Regards,
Team Lhedge
"""

em = EmailMessage()
em['From'] = email_sender
em['To'] = email_receiver
em['Subject'] = subject
em.set_content(body)

#Report Attachment
if len(sys.argv) > 1 and sys.argv[1] == "pass":
    with open('passreport_styled.docx', 'rb') as f:  
        file_data = f.read()
        file_name = 'PasswordChange-LhedgeReport.docx'
elif len(sys.argv) > 1 and sys.argv[1] == "login":
    with open('loginreport_styled.docx', 'rb') as f:  
        file_data = f.read()  
        file_name = 'LoginFail-LhedgeReport.docx'  
elif len(sys.argv) > 1 and sys.argv[1] == "malware":
    with open('malware_report_styled.docx', 'rb') as f:  
        file_data = f.read()
        file_name = 'MalwareDetection-LhedgeReport.docx'
                
em.add_attachment(file_data, maintype='application', subtype='vnd.openxmlformats-officedocument.wordprocessingml.document', filename=file_name)

#Send Email
context = ssl.create_default_context()
with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
    smtp.login(email_sender, email_password)
    smtp.send_message(em)
