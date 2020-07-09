import os
from flask import Flask, render_template, request, jsonify
import requests
import pandas as pd
import json

app = Flask(__name__)

key = 'b0a8fd7d97074363a193b7446178cfd9'

@app.route("/", methods=["GET", "POST"])
def index():
    return render_template('index.html')

@app.route("/api_call/<float(signed=True):lat>/<float(signed=True):lon>", methods=["GET", "POST"])
def get_data(lat, lon):
    hours = 120

    reqh = 'https://api.weatherbit.io/v2.0/history/airquality?lat={lat}&lon={lon}&key={key}'
    reqf = 'https://api.weatherbit.io/v2.0/forecast/airquality?lat={lat}&lon={lon}&key={key}&hours={hours}'
    
    try:
        reqh = requests.get(reqh.format(lat=lat,lon=lon,key=key,hours=hours)).json()
    except:
        print('No data')
        return jsonify({'data':None}), 400
    
    try:
        reqf = requests.get(reqf.format(lat=lat,lon=lon,key=key,hours=hours)).json()
    except:
        print('No data')
        return jsonify({'data':None}), 400
    
    city = reqh['city_name']
    country = reqh['country_code']
    
    data = reqh['data'] + reqf['data']
    dataj = {k:[] for k in data[0].keys()}

    for l in range(len(data)):
        for k in data[0].keys():
            dataj[k].append(data[l][k])
        
    df = pd.DataFrame(data=dataj).sort_values('timestamp_local')
    df['date'] = df['timestamp_local']
    df = df.drop(['timestamp_local', 'timestamp_utc', 'datetime', 'ts'], axis=1)
    chart_data = df.to_dict(orient='records')
    chart_data = json.dumps(chart_data, indent=2)
    data = {'chart_data': chart_data, 'city':city, 'country':country}

    return jsonify(data)