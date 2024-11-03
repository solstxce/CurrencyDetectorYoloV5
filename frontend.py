import streamlit as st
import requests
import numpy as np
import cv2
from PIL import Image
import io

st.title("YOLO-Currency Notes Detection")

# Option to use webcam
if st.button("Use Webcam"):
    st.write("Please allow access to your webcam.")
    # Streamlit's built-in webcam functionality
    image = st.camera_input("Capture Image")
    
    if image is not None:
        # Process the image
        img = Image.open(image)
        img = np.array(img)
        _, img_encoded = cv2.imencode('.jpg', img)
        response = requests.post("http://localhost:8080/detectObject", files={"image": img_encoded.tobytes()})
        data = response.json()
        st.image(data['status'], caption='Processed Image')
        st.write("English Message:", data['englishmessage'])
        st.write("Hindi Message:", data['hindimessage'])

# Option to upload a file
uploaded_file = st.file_uploader("Upload an Image", type=["jpg", "jpeg", "png"])
if uploaded_file is not None:
    img = Image.open(uploaded_file)
    img = np.array(img)
    _, img_encoded = cv2.imencode('.jpg', img)
    response = requests.post("http://localhost:8080/detectObject", files={"image": img_encoded.tobytes()})
    data = response.json()
    st.image(data['status'], caption='Processed Image')
    st.write("English Message:", data['englishmessage'])
    st.write("Hindi Message:", data['hindimessage'])