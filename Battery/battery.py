import serial
import time

ser = serial.Serial("/dev/ttyUSB0", 9600, timeout=5)
filename = "/home/pi/Desktop/percent.txt"
factor = 30 * 3600

def read_percent(filename):
   with open(filename, "r") as f:
       for line in f:
               return float(line)
            
def write_percent(filename, percent):
    file = open(filename,"w")
    file.write(percent) # percent is string
    file.close()

def read_uart():
    
    try:
        data = ser.readline().decode("utf-8").strip().split(", ")
    except:
        print("Error: Not able to decode")
        return None
    if(len(data) < 3):
        print("Error: Missing data")
        return None
    for idx in range(len(data)):
        if(not data[idx].isdigit()):
            print("Error: Non-integer data")
            return None
        else:
            data[idx] = int(data[idx]) / 100
    return data
            
    
        
    
prev_percent = 1 # make sure the percent.txt has 100 for initialization
prev_voltage = 13

while True:
    
    
    prev_amp_second = prev_percent * factor
    count = 0
    drain_current_sum = 0
    charge_current_sum = 0
    voltage_sum = 0
    start = time.time()
    
    
    
    while time.time()-start <=1:   
        # read drain_currnt from uart: drain_current_i = uart(read)
        # read charge_current from uart: charge_current_i = uart(read)
        # read voltage from uart: voltage = uart(read)
        data = read_uart()
        if(data != None):
            voltage_sum += data[2] / 10.23 * 20 - 0.3
            drain_current_sum += (data[0] / 10.23 * 5 - 2.5) * 10
            charge_current_sum += (data[1] / 10.23 * 5 - 2.5) * 10
            count = count + 1
            time.sleep(0.05)
        
    print("Number of data read: " + str(count))
    
    # get average
    if(count != 0):
        voltage = voltage_sum / count
        drain_current = drain_current_sum / count
        charge_current = max(charge_current_sum / count,0)
    else: # Didn't read shit
        voltage = prev_voltage
        drain_current = 0
        charge_current = 0
            
    
    
    new_amp_second = prev_amp_second - drain_current + charge_current
    
    
    if voltage >= 14.5:
        new_percent = 1
    elif voltage <= 10:
        new_percent = 0
    else:
        new_percent = new_amp_second / factor
 
    
    write_percent(filename, str(int(new_percent*100)))
    print("Voltage: " + str(voltage))
    print("Drain current: " + str(drain_current))
    print("Charge current: " + str(charge_current))
    print("-------------------------------------------------------")
    prev_percent = new_percent
    voltage_prev = voltage
    


