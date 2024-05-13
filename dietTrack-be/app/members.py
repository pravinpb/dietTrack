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


app.config['SECRET_KEY'] = '9\xbc\xa2AB\xf7\x86\xc1{Uw\xe0'

 

class members(MethodView):

    @token_required
    def __init__(current_user,self):
        self.conn = conn()
    print("token_required")
    @token_required
    def get(current_user,self):
        cur = self.conn.cursor(cursor_factory=DictCursor)
        cur.execute("SELECT * FROM members WHERE family_id = %s;", (current_user[0],))
        data = cur.fetchall()
        self.conn.commit()
        return data
    
    @token_required
    def post(current_user,self):
        data = request.get_json()
        print(data)
        member_name = data['member_name']
        date_of_birth = data['date_of_birth']
        gender = data['gender']
        height = data['height']
        weight = data['weight']
        puberty = data['puberty']
        age_of_puberty = data['age_of_puberty']
        menopause = data['menupause']
        country = data['country']

        cur = self.conn.cursor(cursor_factory=DictCursor)
        cur.execute("INSERT INTO members (family_id, member_name, date_of_birth, gender, height, weight, puberty, age_of_puberty, menopause, country) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",(current_user[0],member_name, date_of_birth, gender, height, weight, puberty, age_of_puberty, menopause, country))
        self.conn.commit()

        return jsonify({'message': 'User Created'})
    
    @token_required
    def delete(self, member_id):
        with self.conn.cursor() as cur:
            cur.execute("DELETE FROM members WHERE member_id = %s", (member_id,))
            self.conn.commit()

        return jsonify({'message': 'User Deleted'}
                          )


members_list = members.as_view('members_api')
app.add_url_rule('/members', view_func=members_list, methods=['GET', 'POST', 'PUT'])
app.add_url_rule('/add-member', view_func=members_list, methods=['GET', 'POST', 'PUT'])
app.add_url_rule('/members/<int:member_id>', view_func=members_list, methods=['DELETE'])



class memberDetails(MethodView):
    def __init__(self):
        self.conn = conn()

    @token_required
    def get(current_user,self, member_id):
        cur = self.conn.cursor(cursor_factory=DictCursor)
        cur.execute("SELECT * FROM members WHERE member_id = %s;", (member_id,))
        data = cur.fetchone()
        self.conn.commit()
 
        return jsonify(data)
    

    @token_required
    def post(current_user,self, member_id):
        data = request.get_json()
        dietary_restrictions = data['dietary_restrictions']
        occupation = data['occupation']

        cur = self.conn.cursor(cursor_factory=DictCursor)
        cur.execute("INSERT INTO memberDetails (member_id, dietary_restrictions, occupation) VALUES (%s,%s,%s)", (member_id, dietary_restrictions, occupation))
        self.conn.commit()

        return jsonify({'message': 'Details Added'})
    

    
member_details = memberDetails.as_view('member_details_api')
app.add_url_rule('/members/details/<int:member_id>', view_func=member_details, methods=['GET', 'POST'])
app.add_url_rule('/members/details/<int:member_id>', view_func=member_details, methods=['PUT', 'DELETE'])