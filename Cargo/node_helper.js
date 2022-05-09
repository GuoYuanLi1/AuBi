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
    this.urlUpdated = false;
    this.inputCargo = false;
    this.readFinger = false;
    this.receiveCargo = false;
    this.lock_file = "/home/pi/Desktop/MagicMirror/modules/Cargo/lock.txt";
    this.interact_file = "/home/pi/Desktop/MagicMirror/modules/Cargo/interact_in.txt";
    this.interact_end_file = "/home/pi/Desktop/MagicMirror/modules/Cargo/interact_end_out.txt";
    this.url_file = "/home/pi/Desktop/MagicMirror/modules/Cargo/url.txt";
    this.delivery_file = "/home/pi/Desktop/MagicMirror/modules/Cargo/delivery.txt";
    this.confirm_file = "/home/pi/Desktop/MagicMirror/modules/Cargo/confirm.txt";
    this.name_file = "/home/pi/Desktop/MagicMirror/modules/Cargo/name.txt";
    this.finger_file = "/home/pi/Desktop/MagicMirror/modules/Cargo/fingerprint.txt";
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'CARGO_CONFIG') {
      if (!this.started) {
        this.config = payload;
        this.started = true;
        console.log("cargo module has started");
        
        var fs = require('fs');
        // Close the unclosed lock
        fs.writeFileSync(this.lock_file, "0");
        console.log("Close the initially opened lock!");
        
        // Clear interact end
        fs.writeFileSync(this.interact_end_file, "0");
        console.log("Clear interact end");
        
        // Clear Confirm
        fs.writeFileSync(this.confirm_file, "0");
        console.log("Clear interact end");
        
        // Clear name
        fs.writeFileSync(this.name_file, "xxx");
        console.log("Clear name from website");
        
        // Clear fingerprint
        fs.writeFileSync(this.finger_file, "yyy");
        console.log("Clear fingerprint");
      }
      
    }
    

    else if (notification === 'assert') {
        var fs = require('fs');
        // Assert the interact
        fs.writeFileSync(this.interact_file, "1");
        console.log("Clicked!");
      
        
        //delay x millisecond and then deassert click signal
        setTimeout(function(){ 
          fs.writeFile(this.interact_file, "0", function (err) {
           if(err) {
             console.log("Error occured: write file failed")
           }else{
             console.log("Not Clicked!")
           }
          });
        }, 1000 * 120);
          
    }
    
    
     else if (notification === 'CARGO_START') {
        var fs = require('fs');
        
        // Update URL
        if(!this.urlUpdated) {
            var url = fs.readFileSync(this.url_file).toString().replace(/\s+/g, '');
          
            if(url !== "") {
              this.urlUpdated = true;
              this.sendSocketNotification("URL_UP", "http://" + url + ":8081/"); // "http://" + url + ":8081/"
              console.log("URL updated!!!!");
              fs.writeFileSync(this.url_file, "");
              console.log("URL text removed!!!");

            }
        }
      
      
        // User presses Retrieval button and enters retrieval page
        if (this.getFinger) {
            var name_web = fs.readFileSync(this.name_file).toString().replace(/\s+/g, '');
      
            var name_finger = fs.readFileSync(this.finger_file).toString().replace(/\s+/g, '');
  
            if(name_web === name_finger) {
                  // Open lock
                  fs.writeFileSync(this.lock_file, "1");
                  console.log("Fingerprint matched! Open lock!");
                  this.getFinger = false;
            }
          }
            
        // User presses Cargo button and enters Cargo page
        if (this.inputCargo) {
            var delivery = fs.readFileSync(this.delivery_file).toString().replace(/\s+/g, '').charAt(0);
           
            var confirm = fs.readFileSync(this.confirm_file).toString().replace(/\s+/g, '');
            
            if(confirm === '1' && delivery === '1') {
              // Open lock
              fs.writeFileSync(this.lock_file, "1");
              console.log("Cargo delivery registered! Open lock!");
              this.inputCargo = false;
            }
        }
            
          
        // Check if need to return home screen
        var return_home = fs.readFileSync(this.interact_end_file).toString().replace(/\s+/g, '');
        
        if(return_home === '1') {
          console.log("Return home screen");
          this.sendSocketNotification("RETURN_NOW");
        }
        
        
    }
    
    else if (notification === "GET_CARGO") {
      console.log("Fetching Cargo");
      this.getFinger = true;
    }
    
    else if (notification === "INPUT_TASK") {
      console.log("Inputting Task");
      this.inputCargo = true;
    }
    
    
    else if (notification === "CLOSE_LOCK") {
        var fs = require('fs');
      
        // User presses 'CONFIRM' and leave Cargo Delivery page
        if (payload) {
            // Deassert confirm
            fs.writeFileSync(this.confirm_file, "0");
            console.log("User leaves Cargo page! Deassert confirm");
             
            // Close Lock
            fs.writeFileSync(this.lock_file, "0");
            console.log("User leaves Cargo page! Close Lock!");
            
      // User presses 'RECEIVED' and leave Retrieval page 
      }else{
            // Close Lock
            fs.writeFileSync(this.lock_file, "0");
            console.log("User received cargo! Close Lock!");
              
            // Erase name on web
            fs.writeFileSync(this.name_file, "xxx");
            console.log("Erase web name");
            
            // Erase fingerprint
            fs.writeFileSync(this.finger_file, "yyy");
            console.log("Erase fingerprint name");
      }
    }
    
    
    
  },
});
