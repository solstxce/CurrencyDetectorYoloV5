from flask import Flask, render_template, request, jsonify, send_file
from PIL import Image
import os, io, sys
import numpy as np
import cv2
import base64

from yolo_detection import run_model
from language_conversion import convert_lang

app = Flask(__name__)

@app.route('/detectObject', methods=['POST'])
def mask_image():
    file = request.files['image'].read()  # byte file
    npimg = np.frombuffer(file, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)[:, :, ::-1]  # OpenCV image (BGR to RGB)

    img, text = run_model(img)
    if text.lower() == "image contains":
        text = ""

    if len(text) == 0:
        text = "Reload the page and try with another better image"
    
    englishtext = text
    hinditext = convert_lang(text)

    bufferedBytes = io.BytesIO()
    img_base64 = Image.fromarray(img)
    img_base64.save(bufferedBytes, format="JPEG")
    img_base64 = base64.b64encode(bufferedBytes.getvalue())
    
    return jsonify({'status': str(img_base64), 'englishmessage': englishtext, 'hindimessage': hinditext})

@app.route('/test', methods=['GET', 'POST'])
def test():
    return jsonify({'status': 'success'}) 

@app.route('/')
def home():
    return render_template('index.html')

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=False, threaded=False)

    
