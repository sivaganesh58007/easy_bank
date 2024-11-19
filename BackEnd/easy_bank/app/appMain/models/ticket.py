from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.appMain import db


class Ticket(db.Model):
    __tablename__ = 'tickets'
    
    ticket_id = db.Column(UUID, primary_key=True, nullable=False)
    user_id = db.Column(UUID, db.ForeignKey('users.user_id'), nullable=False)
    ticket = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status_id = db.Column(UUID, db.ForeignKey('status.status_id'), nullable=False)
    created_at = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())
    updated_at = db.Column(db.TIMESTAMP, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    # has_unread_messages = db.Column(db.Boolean, default=False)


    # users = db.relationship("User", back_populates="tickets")  # Assuming User model has a relationship to tickets
    status = db.relationship("Status", back_populates="tickets")  # Assuming Status model has a relationship to tickets
    users = db.relationship("User", backref="tickets")


    def __init__(self, **kwargs):
        super(Ticket, self).__init__(**kwargs)

