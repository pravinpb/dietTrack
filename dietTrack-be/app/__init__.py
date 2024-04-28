
from flask import Flask,request, jsonify,Response
from functools import wraps
import psycopg2
from flask_cors import CORS, cross_origin
from psycopg2.extras import DictCursor
import jwt

app = Flask(__name__)
CORS(app)

def conn():
    conn = psycopg2.connect(
        host="localhost",
        database="postgres",
        user="postgres",
        password="pravinpb",
        port="5200")
    return conn

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        conn = psycopg2.connect(
            host="localhost",
            database="postgres",
            user="postgres",
            password="pravinpb",
            port="5200")
        
        token = request.headers['x-access-token']

        print(token)
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
    
            with conn.cursor(cursor_factory=DictCursor) as cur:
                cur.execute("SELECT * FROM family WHERE public_id = %s;", (data['public_id'],))
                userdata = cur.fetchone()
                print(userdata)
            current_user = userdata
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

from app import views
from app import members
from app import cycles
