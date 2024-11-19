from flask_restx import Namespace, fields



class OtpDto:
        otp_api = Namespace('send-otp', description="OTP-related operations")
        verify_otp_api=Namespace('verify-otp',description="end point to verify the otp")
        reset_password_api=Namespace('reset-password',description="end point to reset the password")


        
