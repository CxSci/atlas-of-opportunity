from flask import Flask, request, jsonify
import psycopg2

app = Flask(__name__)

conn = psycopg2.connect(database="SADatabase",
        user="user",
        password="password",
        host="db",
        port="5432")
cur = conn.cursor()


@app.route('/api/test', methods=['GET'])
def test_health():
  return {
    "field1": "Hello",
    "field2": "From Backend"
  }

@app.route('/api/features.geojson', methods=['GET'])    
def get_sa_data():
  cur.execute('SELECT * FROM sadata')
  rows = cur.fetchall()
  return jsonify(rows)

if __name__== '__main__':
    app.run(debug=True, host='0.0.0.0')

    
