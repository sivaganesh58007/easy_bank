from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager





db = SQLAlchemy()
ma = Marshmallow()
jwt = JWTManager()


def mydb():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password1234@localhost/easybankdata'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'siva'
    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app) 

    return app
    