from app.appMain import db
import uuid
from sqlalchemy.dialects.postgresql import UUID


class Feedback(db.Model):
    __tablename__ = 'feedback'
    feedback_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.user_id'))
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    feedback_created_at = db.Column(db.TIMESTAMP)
    feedback_updated_at = db.Column(db.TIMESTAMP)

    user = db.relationship('User', backref='feedbacks')

    def __init__(self, **kwargs):
        super(Feedback, self).__init__(**kwargs)