from app.appMain import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Transaction(db.Model):
    __tablename__ = 'transactions'
    transaction_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.user_id'))
    amount = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String(50), nullable=False)
    status_id = db.Column(UUID(as_uuid=True), db.ForeignKey('status.status_id'))
    other_user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.user_id'))
    transaction_at = db.Column(db.TIMESTAMP, nullable=False)

    user = db.relationship('User', foreign_keys=[user_id], backref='transactions')
    other_user = db.relationship('User', foreign_keys=[other_user_id], backref='related_transactions')


    
    status = db.relationship('Status', backref='transactions')


    def __init__(self, **kwargs):
        super(Transaction, self).__init__(**kwargs)