from flask_restx import Namespace

class AdminDto:
    admin_api = Namespace('adminsignup', description='Admin operations')
    getdetailsapi = Namespace('getdetails', description='appi to show details of user')
    adduserapi=Namespace('adduser', description='api to add new user')
    # admin_profile_api=Namespace('admin-profile'),description='api to get admin profile'
    deleteuserapi=Namespace('delteuser',description='api to delete user')
    searchuserapi=Namespace('search',description='api to search user')
    viewfeedbackapi=Namespace('view-feedback',description='api to view feedback')


