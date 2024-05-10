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
import json
import jwt


views = Flask(__name__)

from werkzeug.security import generate_password_hash, check_password_hash


app.config['SECRET_KEY'] = '9\xbc\xa2AC\xf7\x86\xc1{Uw\xe0'


class cycles(MethodView):
    def __init__(self):
        self.conn = conn()

    @token_required
    def post(current_user,self,member_id):
        data = request.get_json()
        print(data['start_date'],data['end_date'])
        with self.conn.cursor(cursor_factory=DictCursor) as cur:
            cur.execute("INSERT INTO cycle (member_id, start_date, end_date) VALUES (%s, %s, %s);", (member_id, data['start_date'], data['end_date']))
            self.conn.commit()
            return jsonify({'message': 'Cycle created successfully'}), 201
        
    @token_required
    def get(current_user,self,member_id):
        cur = self.conn.cursor(cursor_factory=DictCursor)
        cur.execute("SELECT * FROM cycle WHERE member_id = %s;", (member_id,))
        data = cur.fetchall()
        self.conn.commit()

        return jsonify(data)
    
    @token_required
    def delete(cyrrent_user,self,cycle_id):
        cur = self.conn.cursor(cursor_factory=DictCursor)
        cur.execute("DELETE FROM cycle WHERE cycle_id = %s;", (cycle_id,))
        self.conn.commit()

        return jsonify({'message': 'Cycle deleted successfully'}), 200
    
    
    
cycles_list = cycles.as_view('cycles_list')
app.add_url_rule('/members/cycles/<int:member_id>', view_func=cycles_list, methods=['GET', 'POST'])
app.add_url_rule('/members/cycles/<int:cycle_id>', view_func=cycles_list, methods=['PUT', 'DELETE'])