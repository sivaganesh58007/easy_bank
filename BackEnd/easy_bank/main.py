from app.appMain import mydb
from flask_cors import CORS
from app import blueprint


backend = mydb()
backend.register_blueprint(blueprint)
CORS(backend)
backend.app_context().push()



if __name__ == "__main__":
    backend.run(debug=True)