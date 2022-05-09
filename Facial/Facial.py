# Facial V1.01 - Face Recognition Module

# Modified by: Pratik & Eben
# This is a modified script from the open source face recognition repo:
#https://github.com/ageitgey/face_recognition
# Patch update to fix bugs

import face_recognition
import picamera
import numpy as np
import sys
import os
import time

# Get a reference to the Raspberry Pi camera.
# If this fails, make sure you have a camera connected to the RPi and that you
# enabled your camera in raspi-config and rebooted first.
camera = picamera.PiCamera()
camera.resolution = (320, 240)
output = np.empty((240, 320, 3), dtype=np.uint8)

# Load a sample picture and learn how to recognize it.
print("Loading known face image(s)")
f= open("/home/pi/Desktop/MagicMirror/modules/Facial/public/userData.txt", "r")
users = f.readlines()
image = locals()
face_encoding = locals()
known_face_names = []
known_face_encodings=[]
for line in users:
    fingerCode = line.split(',')
    Nameid = fingerCode[0]
    known_face_names.append(Nameid)
    image[str(Nameid)+'_image']=face_recognition.load_image_file("/home/pi/Desktop/MagicMirror/modules/Facial/public/%s" % fingerCode[1])
    face_encoding[str(Nameid)+'_face_encoding']=face_recognition.face_encodings(image.get(str(Nameid)+'_image'))[0]
    known_face_encodings.append(face_encoding.get(str(Nameid)+'_face_encoding'))
"""
Tony_image = face_recognition.load_image_file("/home/pi/Desktop/MagicMirror/modules/Facial/public/Tony.jpeg")
Tony_face_encoding = face_recognition.face_encodings(Tony_image)[0]

Obama_image = face_recognition.load_image_file("/home/pi/Desktop/MagicMirror/modules/Facial/public/Obama.jpeg")
Obama_face_encoding = face_recognition.face_encodings(Obama_image)[0]

Jordan_image = face_recognition.load_image_file("/home/pi/Desktop/MagicMirror/modules/Facial/public/Jordan.jpeg")
Jordan_face_encoding = face_recognition.face_encodings(Jordan_image)[0]

GuoYuan_image = face_recognition.load_image_file("/home/pi/Desktop/MagicMirror/modules/Facial/public/GuoYuan.jpeg")
GuoYuan_face_encoding = face_recognition.face_encodings(GuoYuan_image)[0]

ShenLu_image = face_recognition.load_image_file("/home/pi/Desktop/MagicMirror/modules/Facial/public/ShenLu.jpeg")
ShenLu_face_encoding = face_recognition.face_encodings(ShenLu_image)[0]


# create arrays of known face encodings
known_face_encodings = [
    Obama_face_encoding,
    Tony_face_encoding,
    Jordan_face_encoding,
    GuoYuan_face_encoding,
    ShenLu_face_encoding
    ]

known_face_names = [
    "Obama",
    "Tony",
    "Jordan",
    "GuoYuan",
    "ShenLu"
    ]
"""

# Initialize some variables
face_locations = []
face_encodings = []

id_check = 0

while True:
    print("Capturing image.")
    # Grab a single frame of video from the RPi camera as a numpy array
    camera.capture(output, format="rgb")

    # Find all the faces and face encodings in the current frame of video
    face_locations = face_recognition.face_locations(output)
    print("Found {} faces in image.".format(len(face_locations)))
    face_encodings = face_recognition.face_encodings(output, face_locations)
    
    face_id = "Guest"
    

    # Loop over each face found in the frame to see if it's someone we know.
    for face_encoding in face_encodings:
        # See if the face is a match for the known face(s)
        match = face_recognition.compare_faces(known_face_encodings, face_encoding)
        name = "<Unknown Person>"
        if True in match:
            first_match_index = match.index(True)
            face_id = known_face_names[first_match_index]
   
       
            #print(face_id) -- print the name you saved as the MM picture


        
        name = face_id
        
            

        print("Person Detected: {}!".format(face_id))
        f = open("/home/pi/Desktop/MagicMirror/modules/Facial/face_name.txt", "w")
        f.write(name)
        f.close()
        #time taken before the user is logged off from the mirror
        time.sleep(15)
        
    f = open("/home/pi/Desktop/MagicMirror/modules/Facial/face_name.txt", "w")
    f.write(face_id)
    f.close()
