from app import conn, token_required
from flask import Flask,request, jsonify,Response
from flask.views import MethodView
import psycopg2
from psycopg2.extras import DictCursor
import pandas as pd
from app import app
from functools import wraps
from flask import make_response
from datetime import datetime, timedelta
import uuid


views = Flask(__name__)
import json
import jwt
from werkzeug.security import generate_password_hash, check_password_hash


app.config['SECRET_KEY'] = '9\xbc\xa2AC\xf7\x86\xc1{Uw\xe0'




class familyRegister(MethodView):
    def __init__(self):
        self.conn = conn()

    def get(self):
        cur = self.conn.cursor(cursor_factory=DictCursor)
        cur.execute("SELECT * FROM family")
        data = cur.fetchall()
        self.conn.commit()

        df = pd.DataFrame.from_records(list(data), columns=['family_id', 'family_name', 'email','password','public_id'])
        data = df.to_dict('records')
        print(data)
        return Response(json.dumps(data), status=200, mimetype='application/json')
                                       

        
    
    def post(self):

        data = request.get_json()
        print(data)
        family_name = data['family_name']
        email = data['email']
        password = data['password']
        public_id = str(uuid.uuid4())
        
        hashed_password = generate_password_hash(password, method='scrypt')

        with self.conn.cursor() as cur:
            cur.execute("INSERT INTO family (family_name, email, password,public_id) VALUES (%s, %s,%s,%s);",
                        (family_name, email, hashed_password, public_id))
            self.conn.commit()

        return jsonify({'message': 'User Created'})
    
    def delete(self, family_id):
        with self.conn.cursor() as cur:
            cur.execute("DELETE FROM family WHERE family_id = %s", (family_id,))
            self.conn.commit()

        return jsonify({'message': 'User Deleted'}
                          )
    
family_class_register = familyRegister.as_view('register_api')
app.add_url_rule('/user', view_func=family_class_register, methods=['GET', 'POST', 'PUT'])
app.add_url_rule('/user/<int:family_id>', view_func=family_class_register, methods=['DELETE'])




class familyLogin(MethodView):
    def __init__(self):
        self.conn = conn()


    def post(self):
        fe_data = request.get_json()
        print("fe_data",fe_data)

        family_name = fe_data['family_name']
        password = fe_data['password']
        with self.conn.cursor(cursor_factory=DictCursor) as cur:
            cur.execute("SELECT * FROM family WHERE family_name = %s ;", (family_name,))
            user = cur.fetchone()
            self.conn.commit()

        if not fe_data or not family_name or not password:
            return make_response('Could not verify!', 401, {'WWW-Authenticate': 'Basic realm="Login Required"'})
        
        if not user or not check_password_hash(user['password'], password):
            return make_response('Could not verify!', 401, {'WWW-Authenticate': 'Basic realm="Login Required"'})
        
        
        token = jwt.encode({'public_id': user['public_id'], 'exp': datetime.utcnow() + timedelta(minutes=100)}, app.config['SECRET_KEY'])
        return jsonify('token', token)
    


family_class_login = familyLogin.as_view('login_api')
app.add_url_rule('/login', view_func=family_class_login, methods=['GET', 'POST', 'PUT'])
