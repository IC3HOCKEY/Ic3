from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)

@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        data = request.json
        
        # Email configuration
        sender_email = 'ic3.kontakt@outlook.com'
        receiver_email = 'ic3.kontakt@outlook.com'
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = receiver_email
        msg['Subject'] = 'Fråga från IC3 webbplats'
        
        # Format email body
        body = f"Namn: {data['name']}\n\n"
        body += f"E-post: {data['email']}\n\n"
        body += f"Meddelande:\n{data['message']}"
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        with smtplib.SMTP('smtp.office365.com', 587) as server:
            server.starttls()
            server.login(sender_email, 'YOUR_PASSWORD')  # You'll need to set this in an environment variable
            server.send_message(msg)
        
        return jsonify({
            'success': True,
            'message': 'E-posten har skickats!'
        })
        
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Fel vid skickandet av e-post.'
        }), 500

if __name__ == '__main__':
    app.run(port=3000, debug=True)
