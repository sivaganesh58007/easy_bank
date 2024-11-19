from flask_restx import Namespace

class UserDto:
    signupapi = Namespace('signup', description='api for user signup')
    loginapi = Namespace('signin', description='user api login')
    checkemailapi=Namespace('check-email', description='check email' )
    profileapi=Namespace('profile',description='to view the profile')
    signupotpapi=Namespace('signup-otp',description='end point to send otp while signup')

