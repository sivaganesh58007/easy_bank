from sqlalchemy.dialects.postgresql import UUID
import uuid
from werkzeug.security import generate_password_hash,check_password_hash


from app.appMain import db

class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    password = db.Column( db.String(255), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    account_number = db.Column(db.String(50), unique=True, nullable=False, default=lambda: str(uuid.uuid4().int)[:15])
    account_create_at = db.Column(db.TIMESTAMP, nullable=False, default=db.func.current_timestamp())
    account_updated_at = db.Column(db.TIMESTAMP, nullable=True)
    address = db.Column(db.Text, nullable=True)
    status_id = db.Column(UUID(as_uuid=True), db.ForeignKey('status.status_id'), nullable=False)
    role_id = db.Column(UUID(as_uuid=True), db.ForeignKey('roles.role_id'), nullable=False)
    profile_pic = db.Column(db.String(255), nullable=True)  # New column for profile picture

    
    status = db.relationship('Status', back_populates='users')
    roles = db.relationship('Role', back_populates='users')  # Singular 'role' on the user side

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)


    def set_password(self, password):
        self.password = generate_password_hash(password)
    def verify_password(self, password):
        return check_password_hash(self.password, password)