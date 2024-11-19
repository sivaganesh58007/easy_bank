from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.appMain import db

class Status(db.Model):
    __tablename__ = 'status'

    status_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    status_name = db.Column(db.String(100), nullable=False)

    # Relationship to User model
    users = db.relationship('User', back_populates='status')
    # quaries=db.relationship('Queries',back_populates='status')  
    tickets = db.relationship("Ticket", back_populates="status")  # Linking to Ticket model
  
    def __init__(self, **kwargs):
        super(Status, self).__init__(**kwargs)