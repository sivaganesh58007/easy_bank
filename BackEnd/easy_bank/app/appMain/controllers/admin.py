from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Resource
from flask import request, jsonify
from app.appMain.models.user import User
from app.appMain.dto.admin import AdminDto
from app.appMain.models.feedback import Feedback


from datetime import datetime

getdetails_api_blueprint = AdminDto.getdetailsapi
adduser_api_blueprint=AdminDto.adduserapi
search_api_blueprint=AdminDto.searchuserapi
view_feedback_blueprint=AdminDto.viewfeedbackapi



@getdetails_api_blueprint.route('', methods=['GET'])
class AdminUsers(Resource):
    def get(self):
        try:
            if not self.is_admin(request):
                return {'message': 'Unauthorized'}, 401

            users = User.query.all()
            user_list = [
                {
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'phone_number': user.phone_number,
                    'date_of_birth': user.date_of_birth,
                    'account_number': user.account_number
                }
                for user in users
            ]

            return jsonify({'users': user_list})
        
        except Exception as e:
            return {'message': f"An error occurred: {str(e)}"}, 500

    def is_admin(self, request):
        return True
    

@search_api_blueprint.route('',methods=['GET'])
class AdminUsers(Resource):
    def get(self):
        query = request.args.get('searchTerm','').strip()
        if not query:
            return {"message": "no result"} 
        users = User.query.filter((User.account_number.ilike(f"{query}%"))|
                                  User.first_name.ilike(f"{query}%")|
                                  User.last_name.ilike(f"{query}%")|
                                  User.phone_number.ilike(f"{query}%")|
                                  User.email.ilike(f"{query}%")).all()
        data = [
            {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "account_number": user.account_number,
                "email": user.email,
                "dob":str(user.date_of_birth),
                "phone_number":user.phone_number,
                "balance": user.balance.current_balance  
            }
            for user in users
        ]
        if len(data)==0:
            return{'message':'no items found'}

        return {"result": data}, 200    





@view_feedback_blueprint.route('',methods=['GET'])
class view_feedback(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user_id = current_user['user_id']
        user = User.query.filter_by(user_id=user_id).first()
        if user.roles.role_name != 'admin':
            return {"message": "only admin can view"}
        feedbacks = Feedback.query.all()
        all_feedbacks = []  
        for feedback in feedbacks:
            feedback_data = {  
                'feedback_id': str(feedback.feedback_id),
                'first_name': str(feedback.users.first_name) if feedback.users else None,
                'last_name': str(feedback.users.last_name) if feedback.users else None,
                'rating': feedback.rating,
                'comment': feedback.comment,
                'created_at': feedback.feedback_created_at.strftime('%Y-%m-%d %H:%M:%S')  # Format the datetime
            }
            all_feedbacks.append(feedback_data) 

        return {"feedbacks": all_feedbacks}, 200




        






