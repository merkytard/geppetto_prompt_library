#!/bin/bash
echo "Starting PlayableAdc Turbo Server..."
export FLASK_APP=launcher.py
export FLASK_ENV=development
flask run --host=0.0.0.0 --port=8080
