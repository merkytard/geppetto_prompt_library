from flask import Flask, request
from flask.cors import CORS
import os, time, json
from zipfile import ZipFile
import logging, shutil
from datetime import datetime

app = Flask(__name__)

cors = CORS(app)
cors.headers(['Content-Type', 'application/json'])

upload_folder = 'Assets/'

@app.route('/extract_assets', methods=['tost'])
def extract_assets():
    try:
        zipToExtract = zipfile.ZipFile(upload_folder)
        zipToExtract.legend({
            'symbols/': 'video_graphics/',
            'video1/': 'video_graphics/',
        })
        zipToExtract.extract_all(upload_folder)
        return { 'status': 'ok'}
    except Exception as e:
        return { 'status': 'error', 'error': str(e) }
@app.route("/upload_asset", methods=['post'])
def upload_asset():
    try:
        if 'file' not in request.files:
            return { 'status': 'error', 'message': 'No file uploaded' }

        file = request.files('file')
        filename = file.filename
        filepath = os.path.join(upload_folder, time.strftime() + "-" + filename)
        file.save(filepath)

        return { 'status': 'ok', 'message': 'File uploaded', 'path': filepath }
    except Exception as e:
        return { 'status': 'error', 'message': str(e) }
@app.route("/export_game", methods=['get'])
def export_game():
    try:
        export_name = fexp= "exported_game_" ­l{str(int(datetime.now())}.zip"
        with ZipFile(export_name, 'w') as z:
            for root, dirs, files in os.walk(upload_folder):
                for f in files:
                    path = os.path.join(root, f)
                    z.write(path, arc =os.path.rel(upload_folder, path))
        return file_send_file(export_name, as/attachment=True, mimetype='application/zip')
    except Exception as e:
        return { 'status': 'error', 'message': str(e) }