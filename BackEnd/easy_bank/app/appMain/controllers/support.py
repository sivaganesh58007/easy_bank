from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from flask_restx import Resource
from flask import request
from datetime import datetime
from app.appMain import db
from app.appMain.models.status import Status
from app.appMain.models.user import User
from app.appMain.models.role import Role
from flask_jwt_extended import  jwt_required, get_jwt_identity
from app.appMain.dto.support import SupportDto
from app.appMain.models.ticket import Ticket
import uuid
from app.appMain.models.message import Message




ticket_api_blueprint= SupportDto.ticketapi
user_ticket_api_blueprint=SupportDto.userticketapi
all_tickets_api_blueprint=SupportDto.allticketsapi
message_api_blueprint = SupportDto.messageapi
send_mail_blueprint=SupportDto.sendmailapi


@ticket_api_blueprint.route('', methods=['POST'])
class UserTicket(Resource):
    @jwt_required()
    def post(self):
        try:
            current_user = get_jwt_identity()
            data = request.get_json()
            user_id = current_user['user_id']
            user = User.query.filter_by(user_id=user_id).first()
            if not user:
                return {"message": "user not found"}, 404
            Open_status = Status.query.filter_by(status_name='Open').first()
            if not Open_status:
                return {"message": "status not found"}, 404
            new_ticket = Ticket(
                ticket_id=uuid.uuid4(),
                user_id=user_id,
                ticket=data['ticket'],
                description=data['description'],
                status_id=Open_status.status_id,
                created_at=datetime.now(),
                updated_at=datetime.now(),
            )
            db.session.add(new_ticket)
            db.session.commit()
            return {"message": "ticket raised successfully"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"An error occurred: {str(e)}"}, 500


@user_ticket_api_blueprint.route('', methods=['GET'])
class UserTicket(Resource):
    @jwt_required()
    def get(self):
        try:
            current_user = get_jwt_identity()
            user_id = current_user['user_id']
            tickets_list = []

            status = Status.query.filter_by(status_name="Open").first()
            status_name = status.status_name
            tickets = Ticket.query.filter_by(user_id=user_id).all()
            for ticket in tickets:
                ticket_data = {
                    'ticket_id': str(ticket.ticket_id),
                    'ticket': ticket.ticket,
                    'description': ticket.description,
                    'status': str(status_name),
                    'created_at': str(ticket.created_at),
                    'updated_at': str(ticket.updated_at),
                }
                messagecount = Message.query.filter_by(ticket_id=ticket.ticket_id, receiver_id=user_id, is_read=False).count()
                ticket_data['messagesCount'] = messagecount
                tickets_list.append(ticket_data)

            tickets_list.sort(key=lambda x: (x['messagesCount'] == 0, x['updated_at']))
            return tickets_list, 200

        except Exception as e:
            return {"message": f"An error occurred: {str(e)}"}, 500


@all_tickets_api_blueprint.route('', methods=['GET'])
class AllTickets(Resource):
    @jwt_required()
    def get(self):
        try:
            current_user = get_jwt_identity()
            user_id = current_user['user_id']

            user = User.query.filter_by(user_id=user_id).first()
            if user.roles.role_name != 'admin':
                return {"message": "only admin can view"}

            tickets = Ticket.query.all()

            tickets_list = []
            for ticket in tickets:
                ticket_data = {
                    'ticket_id': str(ticket.ticket_id),
                    'ticket': str(ticket.ticket),
                    'description': str(ticket.description),
                    'status_id': str(ticket.status_id),
                    'user_id': str(user.user_id),
                    'first_name': str(ticket.users.first_name),
                    'last_name': str(ticket.users.last_name),
                    'created_at': str(ticket.created_at),
                    'updated_at': str(ticket.updated_at)
                }

                messageCount = Message.query.filter_by(ticket_id=ticket.ticket_id, receiver_id=user_id, is_read=False).count()
                ticket_data['messageCount'] = messageCount
                tickets_list.append(ticket_data)

            tickets_list.sort(key=lambda x: (x['messageCount'] == 0, x['updated_at']))
            return tickets_list, 200

        except Exception as e:
            return {"message": f"An error occurred: {str(e)}"}, 500


def get_admin_id():
    try:
        admin_role = Role.query.filter_by(role_name='admin').first()
        if admin_role:
            admin_user = User.query.filter_by(role_id=admin_role.role_id).first()
            if admin_user:
                return admin_user.user_id
        return None
    except Exception as e:
        print(f"Error retrieving admin ID: {e}")
        return None


@message_api_blueprint.route('/<ticket_id>', methods=['POST', 'GET'])
class MessageResource(Resource):
    @jwt_required()
    def post(self, ticket_id):
        try:
            current_user = get_jwt_identity()
            current_user_id = current_user['user_id']
            data = request.get_json()
            ticket = Ticket.query.filter_by(ticket_id=ticket_id).first()

            if not ticket:
                return {'message': 'Ticket not found'}, 404
            admin_id = get_admin_id()
            if not admin_id:
                return {'message': 'Admin not found'}, 404
            if str(current_user_id) == str(ticket.user_id):
                receiver_id = admin_id
            elif str(current_user_id) == str(admin_id):
                receiver_id = ticket.user_id
                description = ticket.description
                main_ticket = ticket.ticket
                reciever = User.query.filter_by(user_id=ticket.user_id).first()
                send_email_notification(reciever.email, main_ticket, description)      
            else:
                return {'message': 'Invalid user for this ticket'}, 403

            new_message = Message(
                message_id=uuid.uuid4(),
                sender_id=current_user_id,
                receiver_id=receiver_id,
                message=data['message'],
                sent_at=datetime.now(),
                ticket_id=ticket_id,
                is_read=False
            )

            db.session.add(new_message)
            db.session.commit()

            return {'message': 'Message sent successfully'}, 201

        except Exception as e:
            db.session.rollback()
            return {'message': f'An error occurred: {str(e)}'}, 500

    @jwt_required()
    def get(self, ticket_id):
        try:
            current_user = get_jwt_identity()

            ticket = Ticket.query.filter_by(ticket_id=ticket_id).first()
            if not ticket:
                return {'message': 'Ticket not found'}, 404
            messages = Message.query.filter_by(ticket_id=ticket_id).order_by(Message.sent_at).all()
            for message in messages:
                message.is_read = True
            db.session.commit()
            messages_list = [{
                'message_id': str(message.message_id),
                'sender_id': str(message.sender_id),
                'receiver_id': str(message.receiver_id),
                'message': message.message,
                'sent_at': message.sent_at.isoformat(),
                'is_read': message.is_read
            } for message in messages]
            return {'message_data': messages_list,
                    'ticket_user_id': str(ticket.user_id)}, 200

        except Exception as e:
            return {'message': f'An error occurred: {str(e)}'}, 500


def send_email_notification(email, main_ticket, description):
    try:
        sender_email = "lsoneproject@gmail.com"
        app_password = "kqcp nwfl dwsc whte"
        subject = f"New Message on {main_ticket}"
        body = f"""
        Hello,

        You have received a new message regarding your ticket "{main_ticket}."

        Ticket Description:
        "{description}"

        Please log in to your account to view the full message and respond if needed. Our team is here to support you and address any concerns you may have.

        If you have any questions or need further assistance, feel free to reach out.

        Best regards,
        Easy Bank Team
        """
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, app_password)
            server.send_message(msg)
    except Exception as e:
        print(f"Error sending email: {e}")
