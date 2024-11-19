from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.appMain import db
from sqlalchemy import func

class Message(db.Model):
    __tablename__ = 'message'

    message_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tickets.ticket_id'), nullable=False)
    sender_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.user_id'), nullable=False)  # ID of the sender (user or admin)
    receiver_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.user_id'), nullable=False)  # ID of the receiver (user or admin)
    message = db.Column(db.Text, nullable=False)
    sent_at = db.Column(db.TIMESTAMP, default=func.current_timestamp())
    is_read = db.Column(db.Boolean, default=False)



    # Relationships
    tickets = db.relationship("Ticket", backref="messages")
    sender = db.relationship("User", foreign_keys=[sender_id])  # Sender's User object
    receiver = db.relationship("User", foreign_keys=[receiver_id])  # Receiver's User object

    def __init__(self, **kwargs):
        super(Message, self).__init__(**kwargs)
