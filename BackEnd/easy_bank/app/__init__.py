from flask import Blueprint
from flask_restx import Api
from app.appMain.controllers.user import (signup_blueprint,loginapi_blueprint,checkemail_blueprint,profile_blueprint,signupotp_blueprint)
from app.appMain.controllers.admin import(getdetails_api_blueprint,adduser_api_blueprint,search_api_blueprint,view_feedback_blueprint)
from app.appMain.controllers.transaction import(withdraw_blueprint,deposite_blueprint,transfer_blueprint,transactionhistory_blueprint,
                                                accountdetails_blueprint,balance_blueprint)
from app.appMain.controllers.otp import(sendotp_blueprint,verifyotp_blueprint,reset_password_blueprint)
from app.appMain.controllers.feedback import feedback_blueprint

from app.appMain.controllers.support import(ticket_api_blueprint,user_ticket_api_blueprint,all_tickets_api_blueprint,message_api_blueprint,send_mail_blueprint)
blueprint = Blueprint('api',__name__)
api = Api(blueprint, title='siva')
api.add_namespace(loginapi_blueprint)
api.add_namespace(signup_blueprint)
api.add_namespace(getdetails_api_blueprint)
api.add_namespace(checkemail_blueprint)
api.add_namespace(adduser_api_blueprint)
api.add_namespace(deposite_blueprint)
api.add_namespace(transfer_blueprint)   
api.add_namespace(transactionhistory_blueprint)
api.add_namespace(withdraw_blueprint)
api.add_namespace(accountdetails_blueprint)
api.add_namespace(balance_blueprint)
api.add_namespace(profile_blueprint)
api.add_namespace(ticket_api_blueprint)
api.add_namespace(user_ticket_api_blueprint)
api.add_namespace(all_tickets_api_blueprint)
api.add_namespace(feedback_blueprint)
api.add_namespace(message_api_blueprint)
api.add_namespace(sendotp_blueprint)
api.add_namespace(verifyotp_blueprint)
api.add_namespace(reset_password_blueprint)
api.add_namespace(signupotp_blueprint)
api.add_namespace(send_mail_blueprint)
api.add_namespace(search_api_blueprint)
api.add_namespace(view_feedback_blueprint)




