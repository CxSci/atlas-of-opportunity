from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

@app.route('/api', methods=['GET'])
def index():
  return {
    "field1": "Hello",
    "field2": "From Backend"
  }
    
if __name__== '__main__':
    app.run(debug=True, host='0.0.0.0')