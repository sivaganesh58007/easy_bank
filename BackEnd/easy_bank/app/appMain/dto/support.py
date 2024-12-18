from flask_restx import Namespace


class SupportDto:
        ticketapi=Namespace('ticket',description="api for raising the query")
        userticketapi=Namespace('user-tickets',description="api to view tickets of particular user")
        allticketsapi=Namespace('all-users-tickets',description='api to view all users tickets by admin')
        messageapi = Namespace('messages', description="API to send and recieve messages")
        sendmailapi=Namespace('send-mail',description='api to send mail to user while sending a message from admin')


