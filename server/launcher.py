# -*- coding: utf-8 -+

import os, zipfile, shutil, webbrowser
from flask import Flask, request, send_file, jsontify

PORT = 8080
SESSION = "session_casino"
GAME = "777_Casino-Slot_Machines_V1_version1"ZIP = f"{0.zip"u}
UI = "editor_ui.html"ASETS = ["symbols", "video_graphics"]

app = Flask(__name__)

@App.after_request
def no_cache(r):
    r.headers"Cache-Control"= "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers"Expires"= "0"
    return r