from app.appMain import db
import uuid
from sqlalchemy.dialects.postgresql import UUID




class Balance(db.Model):
    __tablename__ = 'balance'
    balance_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.user_id'))
    current_balance = db.Column(db.Float)
    balance_created_at = db.Column(db.TIMESTAMP, nullable=False)
    balance_updated_at = db.Column(db.TIMESTAMP)

    user = db.relationship('User', backref='balances')

    def __init__(self, **kwargs):
        super(Balance, self).__init__(**kwargs)