from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from schema import SADatabaseSchema

app = Flask(__name__)

# Create the SQLAlchemy db instance
db = SQLAlchemy(app)

# Initialize Marshmallow
ma = Marshmallow(app)

@app.route('/api/test', methods=['GET'])
def test_health():
  return {
    "field1": "Hello",
    "field2": "From Backend"
  }

@app.route('/api/features.geojson', methods=['GET'])
def get_sa_data():
  saData = SADatabase.query.all()
  result = SADatabaseSchema.dump(saData)
  return jsonify(result)
    

    
if __name__== '__main__':
    app.run(debug=True, host='0.0.0.0')