#Servo Control

import RPi.GPIO as GPIO
import time

servoPIN = 17
GPIO.setmode(GPIO.BCM)
GPIO.setup(servoPIN, GPIO.OUT)

p = GPIO.PWM(servoPIN, 50) #GPIO 17 for PWM with 50 HZ
#p.start(2.5)
prevInput = '0'


def openLock():
    p = GPIO.PWM(servoPIN, 50)
    p.start(1)
    time.sleep(1)
    # p.start(1)
    # p.ChangeDutyCycle(1)

def closeLock():
    p = GPIO.PWM(servoPIN, 50)
    p.start(7)
    time.sleep(1)
    # p.ChangeDutyCycle(7)

while True:
    f = open("/home/pi/Desktop/MagicMirror/modules/Cargo/lock.txt","r")
    servoInput = f.read(1)
    if servoInput != prevInput:
        prevInput = servoInput
        if servoInput == '1':
            print("Open lock")  # prevInput
            openLock()
        elif servoInput == '0':
            print("Close lock") # prevInput
            closeLock()
    else:
        p.stop()
    f.close()
    time.sleep(1)
