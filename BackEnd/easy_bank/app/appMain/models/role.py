from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.appMain import db

class Role(db.Model):
    __tablename__ = 'roles'

    role_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role_name = db.Column(db.String(50), nullable=False)

    # Relationship to User model
    # users = db.relationship('User', backref='role')
    users = db.relationship('User', back_populates='roles')  # Fixed relationship


    def __init__(self, **kwargs):
        super(Role, self).__init__(**kwargs)
