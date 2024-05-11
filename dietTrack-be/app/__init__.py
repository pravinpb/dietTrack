from flask import Flask, request, jsonify
import jwt
from datetime import datetime, timedelta
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
import psycopg2
from psycopg2.extras import DictCursor
from functools import wraps
from flask import make_response
from flask_cors import CORS

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


app.config['SECRET_KEY'] = '9\xbc\xa2AB\xf7\x86\xc1{Uw\xe0'


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):


        token = request.headers["Accesstoken"]
        print("Authorization Header: ", token)

        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            print(data)

            conn = psycopg2.connect(
                host="localhost",
                database="postgres",
                user="postgres",
                password="pravinpb",
                port="5200")
            
            with conn.cursor(cursor_factory=DictCursor) as cur:
                cur.execute("SELECT * FROM family WHERE public_id = %s;", (data['public_id'],))
                userdata = cur.fetchone()
                print("public iD: ",data['public_id'])
            current_user = userdata
            print("Current User: ",current_user)
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorated




from app import views
from app import members
from app import cycles
