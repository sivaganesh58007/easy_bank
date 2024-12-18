from flask_restx import Namespace

class AdminDto:
    getdetailsapi = Namespace('getdetails', description='appi to show all the user details')
    adduserapi=Namespace('adduser', description='api to add new user')
    searchuserapi=Namespace('search',description='api to search user')
    viewfeedbackapi=Namespace('view-feedback',description='api to view feedback')


