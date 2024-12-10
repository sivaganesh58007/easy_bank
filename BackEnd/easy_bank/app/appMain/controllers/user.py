from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from flask_restx import Resource
from flask import request
from datetime import datetime
from app.appMain import db
from app.appMain.models.role import Role
from app.appMain.models.balance import Balance
from app.appMain.models.status import Status
from app.appMain.models.user import User
from app.appMain.models.otp import OTP
import re
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import uuid
from app.appMain.dto.user import UserDto
from werkzeug.security import generate_password_hash,check_password_hash
import os
from werkzeug.utils import secure_filename




signup_blueprint = UserDto.signupapi
loginapi_blueprint = UserDto.loginapi
checkemail_blueprint =UserDto.checkemailapi
profile_blueprint=UserDto.profileapi
signupotp_blueprint=UserDto.signupotpapi

email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'




UPLOAD_FOLDER = '/home/sivaganesh/Downloads/EasyBank/FrontEnd/src/assets/images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg' ,'webp','avif'}





def validate_phone_number(phone_number: str):
    if len(phone_number) != 10 or not phone_number.isdigit():
        return{"message":"phone number should be 10 digits"},400

def validate_phone_number(phone_number: str):
    if len(phone_number) != 10 or not phone_number.isdigit():
        return {"message": "phone number should be 10 digits"}, 400


@signup_blueprint.route('', methods=['POST'])
class Signup(Resource): 
    def post(self):
        try:
            data = request.get_json()
            otprecord = OTP.query.filter_by(email=data['email']).first()
            otp_entry = otprecord.otp            
            entered_otp = data.get('otp')
            if otprecord.expires_at < datetime.now():
                db.session.delete(otp_entry)
                db.session.commit()
                return {"message": "OTP has expired"}, 400

            if entered_otp == otp_entry:
                user = User.query.filter_by(email=data['email']).first()
            
                if user:
                    return {'message': 'Email already exists'}, 400
                
                exist_phone = User.query.filter_by(phone_number=data['phone_number']).first()
                if exist_phone:
                    return {"message": "phone number already exists"}, 400

                role = Role.query.filter_by(role_name='user').first()
                status = Status.query.filter_by(status_name='active').first()

                required_fields = ['first_name', 'last_name', 'email', 'phone_number', 'password']
                if not all(field in data for field in required_fields):
                    return {'message': 'Missing required fields'}, 400

                phone_number = data['phone_number']

                if len(phone_number) != 10 or not phone_number.isdigit():
                    return {"message": "Phone number must be exactly 10 digits."}, 400

                current_date = datetime.now().date()

                if data['date_of_birth'] >= str(current_date):
                    return {"message": "Invalid date of birth"}, 400

                new_user = User(
                    user_id=uuid.uuid4(),  
                    first_name=data['first_name'],
                    last_name=data['last_name'],
                    email=data['email'],
                    phone_number=data['phone_number'],
                    password=generate_password_hash(data['password']), 
                    date_of_birth=data['date_of_birth'],
                    account_number=str(uuid.uuid4().int)[:15],  
                    account_create_at=datetime.now(), 
                    role_id=role.role_id,
                    status_id=status.status_id,
                    address=None  
                )

                db.session.add(new_user)
                db.session.commit()

                new_balance = Balance(
                    user_id=new_user.user_id,
                    current_balance=0.0,  
                    balance_created_at=datetime.now(),  
                    balance_updated_at=None 
                )
                
                db.session.add(new_balance)
                db.session.commit()     

                return {'message': 'User created successfully'}, 201
            else:
                return {"message": "Invalid OTP"}, 400

        except Exception as e:
            return {'message': 'An error occurred during signup', 'error': str(e)}, 500


@loginapi_blueprint.route('', methods=["POST"])
class Login(Resource):
    def post(self):
        try:
            data = request.get_json()

            if not data.get('email') or not data.get('password'):
                return {'message': 'Please enter credentials'}, 400
            
            if not re.match(email_regex, data['email']):
                return {"message": "Invalid email"}, 400  

            user = User.query.filter_by(email=data['email']).first()
            if not user:
                return {'message': 'Email not registered'}, 404

            if not check_password_hash(user.password, data['password']):
                return {'message': 'Invalid password'}, 401

            role = Role.query.filter_by(role_id=user.role_id).first()
            if not role:
                return {'message': 'Role not found'}, 404

            role_name = role.role_name
            access_token = create_access_token(identity={'user_id': str(user.user_id)}, expires_delta=timedelta(days=1))

            if role_name == 'admin':
                return {
                    'message': 'Login successful', 
                    'role': 'admin', 
                    'access_token': access_token,
                    'user_id': str(user.user_id)
                }, 200
            elif role_name == 'user':
                return {
                    'message': 'Login successful', 
                    'role': 'user', 
                    'access_token': access_token,
                    'user_id': str(user.user_id)
                }, 200
            else:
                return {'message': 'Role not recognized'}, 401
        except Exception as e:
            return {'message': 'An error occurred during login', 'error': str(e)}, 500


email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

@checkemail_blueprint.route('')
class CheckEmail(Resource):
    def post(self):
        try:
            data = request.get_json()
            email = data.get('email')
            if not email:
                return {'message': 'Email is required'}, 400
            if not email_pattern.match(email):
                return {'message': 'Invalid email format'}, 400
            user_exists = User.query.filter_by(email=email).first() is not None
            return {'exists': user_exists}, 200
        except Exception as e:
            return {'message': 'An error occurred while checking the email', 'error': str(e)}, 500
        
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@profile_blueprint.route('', methods=['GET', 'PUT'])
class Profile(Resource):
    @jwt_required()
    def get(self):
        try:
            current_user = get_jwt_identity()
            user = User.query.filter_by(user_id=current_user['user_id']).first()

            if not user:
                return {'message': 'User not found'}, 404
            
            profile_data = {
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'phone_number': user.phone_number,
                'account_number': user.account_number,
                'date_of_birth': user.date_of_birth.strftime('%Y-%m-%d') if user.date_of_birth else None, 
                'address': user.address,
                'user_id': str(user.user_id),
                # 'profile_pic': user.profile_pic  # Include profile picture path
            }

            return profile_data, 200

        except Exception as e:
            return {'message': 'An error occurred while retrieving profile', 'error': str(e)}, 500

    @jwt_required()
    def put(self):
        try:
            current_user = get_jwt_identity()
            user_id = current_user['user_id']

            user = User.query.get(user_id)

        
            if not user:
                return {'message': 'User not found'}, 404
            # if 'profile_pic' in request.files:
            #     file = request.files['profile_pic']
            #     if file and allowed_file(file.filename):
            #         filename = secure_filename(file.filename)
            #         filepath = os.path.join(UPLOAD_FOLDER, filename)
            #         file.save(filepath)

            #         # Update the profile_pic field in the database
            #         user.profile_pic = f"{filename}"
            #     else:
            #         return {'message': 'Invalid file type. Allowed types: png, jpg, jpeg, webp, avif'}, 400


            data = request.form
            current_date = datetime.now().date()    

            if data['date_of_birth'] >= str(current_date):
                return {"message": "Invalid date of birth"}, 400

            user.first_name = data.get('first_name', user.first_name)
            user.last_name = data.get('last_name') if data.get('last_name') != '' else user.last_name
            user.phone_number = data.get('phone_number') if data.get('phone_number') != '' else user.phone_number
            user.date_of_birth = data.get('date_of_birth') if data.get('date_of_birth') != '' else user.date_of_birth
            user.address = data.get('address') if data.get('address') != '' else user.address
            user.account_updated_at = datetime.now()

            db.session.commit()

            return {
            'message': 'Profile updated successfully',
            'profile_pic': user.profile_pic  # Return the updated profile picture URL
        }, 200
        except Exception as e:
            return {'message': 'An error occurred while updating profile', 'error': str(e)}, 500



def generate_otp():
    return str(uuid.uuid4().int)[:6]

@signupotp_blueprint.route('', methods=['POST'])
class SignupOtp(Resource):
    def post(self):
        try:
            data = request.json
            email = data.get('email')  

            if not email:
                return {"message": "Please enter the email before submitting"}, 400

            if not re.match(email_regex, email):
                return {"message": "Invalid email"}, 400  

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
        except Exception as e:
            return {'message': 'An error occurred while generating OTP', 'error': str(e)}, 500
    def send_email(self, email, otp_code):
        try:
            sender_email = "lsoneproject@gmail.com"
            app_password = "kqcp nwfl dwsc whte" 
            subject = "Welcome to Our Easy Bank! Here’s Your OTP Code"
            body = f"""
            Hello,
        
            Thank you for signing up with us! To complete your registration, please use the OTP code provided below:

            OTP Code: {otp_code}

            This code is valid for 5 minutes. Please enter it on the registration page to verify your email and activate your account.

            If you did not initiate this signup, please disregard this email or contact our support team for assistance.

            We’re excited to have you on board!

            Best regards,
            Easy Bank Team
            """
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))

            with smtplib.SMTP('smtp.gmail.com', 587) as server:
                server.starttls()
                server.login(sender_email, app_password)
                server.send_message(msg)
            return True
        except Exception as e:
            return False
