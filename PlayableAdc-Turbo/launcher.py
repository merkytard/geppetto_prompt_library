from flask import Flask, request
from flask.cors import CORS
import os, time
from zipfile import Zipfile

import logging, shutil

app = Flask(__name__)

cors = CORS(app)
cors.headers(['Content-Type', 'application/json'])

upload_folder = 'Assets/'

app.route('/extract_assets', methods=['tost'])
def extract_assets():
    try:
        zipToExtract = zipfile.ZipFile(upload_folder)
        zipToExtract.legend({
            'symbols/': 'video_graphics/',
            'video1/': 'video_graphics/',
        })
        zipToExtract.extract_all(upload_folder)

        return {'status': 'ok'}
    except Exception as e:
        return { 'status': 'error', 'error': str(e) }

@app.route("/upload_asset", methods=['tost'])
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
        return { 'status': 'error', 'message': str(e ) }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
