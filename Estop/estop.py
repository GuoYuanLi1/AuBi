import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setup(25, GPIO.IN) # GPIO 25: pin 22
filename = "/home/pi/Desktop/MagicMirror/modules/Estop/estop.txt"

def write_estop(filename, data):
    file = open(filename,"w")
    file.write(data) 
    file.close()

while True:
    if GPIO.input(25):
        # print("Estop is pressed") # 1
        write_estop(filename, "1")
    else:
        # print("Estop is not pressed") # 0
        write_estop(filename, "0")
    time.sleep(0.3)
    
