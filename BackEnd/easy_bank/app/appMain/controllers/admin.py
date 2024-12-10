from flask_restx import Resource
from flask import request, jsonify
from app.appMain.models.user import User
from app.appMain.dto.admin import AdminDto


from datetime import datetime

adimn_signup_blueprint = AdminDto.admin_api
getdetails_api_blueprint = AdminDto.getdetailsapi
adduser_api_blueprint=AdminDto.adduserapi
delete_user_blueprint=AdminDto.deleteuserapi
search_api_blueprint=AdminDto.searchuserapi



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
        query = request.args.get('searchTerm    ','').strip()
        if not query:
            return {"message": "no result"} 
        users = User.query.filter((User.account_number.ilike(f"{query}%"))|
                                  User.first_name.ilike(f"{query}%")|
                                  User.last_name.ilike(f"{query}%")).all()
        data = [
            {
                "id":str( user.user_id),
                "first_name": user.first_name,
                "last_name": user.last_name,
                "account_number": user.account_number,
                "email": user.email,
                "dob":str(user.date_of_birth),
                
                "balance": user.balance.current_balance  
            }
            for user in users
        ]
        if len(data)==0:
            return{'message':'no items found'}

        return {"result": data}, 200    





