/* Magic Mirror
 * Node Helper: MMM-SmartTouch
 *
 * By SmartBuilds.io - Pratik and Eben
 * https://smartbuilds.io
 * MIT Licensed.
 */
 
var util = require("util");
const NodeHelper = require("node_helper")


module.exports = NodeHelper.create({
  start: function () {
    this.started = false;
    this.config = {};
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'CONFIG') {
      if (!this.started) {
        this.config = payload;
        this.started = true;
        console.log("Smart Touch module has started")
        console.log("proceed")
        this.sendSocketNotification("SHUTIT", payload);
      }
    }
    
/**
    if (notification === "SHUTDOWN") {
      console.log("Shutting down Rpi...")
      require('child_process').exec('shutdown -h now', console.log)
    }

    if (notification === "RESTART") {
      console.log("Restarting Rpi...")
      require('child_process').exec('sudo reboot', console.log)
    }
  **/
    if (notification === 'assert') {
      var fs = require('fs');
     
      fs.writeFile("/home/pi/Desktop/AuBi_State_Machine-main/input/interact_in.txt", "1", function (err) {
           if(err) {
             console.log("Error occured: write file failed")
           }else{
             console.log("Clicked!")
           }
        });
        
        //delay x millisecond and then deassert click signal
        setTimeout(function(){ 
          fs.writeFile("/home/pi/Desktop/AuBi_State_Machine-main/input/interact_in.txt", "0", function (err) {
           if(err) {
             console.log("Error occured: write file failed")
           }else{
             console.log("Not Clicked!")
           }
          });
        }, 2000);
          
    }
    
    if (notification === 'DO_YOUR_JOB') {
      var fs = require('fs');
     
      fs.readFile("/home/pi/Desktop/AuBi_State_Machine-main/output/interact_end_out.txt", function (err, data) {
           if(err) console.log("Error occured: read file failed")
           return_home = data.toString().replace(/\s+/g, '');
           console.log("Return home: " + return_home);
           
        });
        
        if(return_home === '1') {
          console.log("Return home screen");
          this.sendSocketNotification("RETURN_NOW");
        }
      
    }
   
    
  },
});
