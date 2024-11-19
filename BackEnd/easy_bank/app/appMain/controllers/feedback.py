from flask_restx import Resource
from flask import request
from datetime import datetime
from app.appMain import db
from app.appMain.dto.feedback import FeedbackDto
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.appMain.models.user import User
from app.appMain.models.feedback import Feedback
import uuid





feedback_blueprint=FeedbackDto.feedbackapi


@feedback_blueprint.route('', methods=['POST'])
class feedback(Resource):
    @jwt_required()
    def post(self):
        try:
            data = request.json
            current_user = get_jwt_identity()
            user_id = current_user['user_id']
            user = User.query.filter_by(user_id=user_id).first()

            feedback_data = Feedback(
                feedback_id=uuid.uuid4(),
                user_id=user.user_id,
                rating=data['rating'],
                comment=data['comment'],
                feedback_created_at=datetime.now(),
                feedback_updated_at=None
            )
            db.session.add(feedback_data)
            db.session.commit()

            return "feedback added successfully", 200

        except Exception as e:
            db.session.rollback()  # Rollback any changes in case of error
            return {"message": f"An error occurred: {str(e)}"}, 500



     




