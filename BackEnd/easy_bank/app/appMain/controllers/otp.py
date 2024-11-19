from flask import request, jsonify
from flask_restx import Resource
from app.appMain import db
from app.appMain.models.otp import OTP
from app.appMain.models.user import User
import re
import string
from datetime import datetime,timedelta
from app.appMain.dto.otp import OtpDto
from werkzeug.security import generate_password_hash,check_password_hash




import uuid
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart



sendotp_blueprint=OtpDto.otp_api
verifyotp_blueprint=OtpDto.verify_otp_api
reset_password_blueprint=OtpDto.reset_password_api



email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'


def generate_otp():
    return str(uuid.uuid4().int)[:6] 


@sendotp_blueprint.route('', methods=['POST'])
class SendOtp(Resource):
    def post(self):
        try:
            data = request.json
            email = data.get('email')  

            if not email:
                return {"message": "Please enter the email before submitting"}, 400

            if not re.match(email_regex, email):
                return {"message": "Invalid email"}, 400  

            user = User.query.filter_by(email=email).first()
            if not user:
                return {"message": "Email not registered"}, 404

            otp_code = generate_otp()
            expires_at = datetime.now() + timedelta(minutes=5)

            otp_entry = OTP.query.filter_by(email=email).first()
            if otp_entry:
                db.session.delete(otp_entry)
                db.session.commit()

            new_otp = OTP(email=email, otp=otp_code, expires_at=expires_at)
            db.session.add(new_otp)
            db.session.commit()

            if self.send_email(email, otp_code):
                return {"message": "OTP sent successfully"}, 200
            else:
                return {"message": "Failed to send OTP email"}, 500
        except Exception as e:
            return {"message": f"An error occurred: {str(e)}"}, 500

    def send_email(self, email, otp_code):
        try:
            sender_email = "lsoneproject@gmail.com"
            app_password = "kpme ktaz mdhk nhyi"

            subject = "Your OTP Code for Password Reset"
            body = f"""
            Hello,

            We received a request to reset the password for your account. To proceed, please use the OTP code below:

            OTP Code: {otp_code}

            This code is valid for 5 minutes. Enter it on the password reset page to confirm your identity and create a new password.

            If you did not request a password reset, please ignore this email or contact our support team immediately to secure your account.

            Best regards,
            Easy Bank Team
            """

            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))

            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(sender_email, app_password)
                server.send_message(msg)
            return True
        except Exception as e:
            return {"message": f"An error occurred: {str(e)}"}, 500

@verifyotp_blueprint.route('', methods=['POST'])
class VerifyOtp(Resource):
    def post(self):
        try:
            data = request.json
            email = data.get('email')
            otp_code = data.get('otp')

            if not email or not otp_code:
                return {"message": "Email and OTP are required"}, 400

            otp_entry = OTP.query.filter_by(email=email, otp=otp_code).first()
            if not otp_entry:
                return {"message": "Invalid OTP"}, 400

            if otp_entry.expires_at < datetime.now():
                db.session.delete(otp_entry)
                db.session.commit()
                return {"message": "OTP has expired"}, 400

            db.session.delete(otp_entry)
            db.session.commit()

            return {"message": "OTP verified successfully"}, 200
        except Exception as e:
            return {"message": f"An error occurred: {str(e)}"}, 500


@reset_password_blueprint.route('', methods=['POST'])
class ResetPassword(Resource):
    def post(self):
        try:
            data = request.json
            email = data.get('email')
            new_password = data.get('new_password')

            if not new_password:
                return {"message": "Enter the password before submitting"}, 400

            user = User.query.filter_by(email=email).first()
            if user is None:
                return {"message": "User not found"}, 404

            if check_password_hash(user.password, new_password):
                return {"message": "Your new password must be different from the old password"}, 400

            user.password = generate_password_hash(new_password)
            db.session.commit()

            return {"message": "Password reset successfully"}, 200
        except Exception as e:
            return {"message": f"An error occurred: {str(e)}"}, 500
