from flask_restx import Namespace


class FeedbackDto:
    feedbackapi=Namespace('feedback',description='api for giving feedback')
    