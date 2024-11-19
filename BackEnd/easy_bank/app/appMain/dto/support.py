from flask_restx import Namespace


class SupportDto:
        ticketapi=Namespace('ticket',description="api for raising the query")
        userticketapi=Namespace('user-tickets',description="api to view tickets")
        allticketsapi=Namespace('all-users-tickets',description='api to view')
        messageapi = Namespace('messages', description="API for message operations")
        sendmailapi=Namespace('send-mail',description='api to send mail to user while sending a message from admin')


