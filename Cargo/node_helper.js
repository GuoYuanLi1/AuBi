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
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'CARGO_CONFIG') {
      if (!this.started) {
        this.config = payload;
        this.started = true;
        console.log("cargo module has started")
        //console.log("proceed")
        //this.sendSocketNotification("SHUTIT", payload);
        
        var fs = require('fs');
         fs.writeFile("/home/pi/Desktop/MagicMirror/modules/Cargo/lock.txt", "0", function (err) {
              if(err) {
                console.log("Error occured: write file failed")
              }else{
                console.log("Close the acidentally opened lock!")
              }
            });
        
      }
      
    }
    

    else if (notification === 'assert') {
      var fs = require('fs');
     
      fs.writeFile("/home/pi/Desktop/MagicMirror/modules/Cargo/interact_in.txt", "1", function (err) {
           if(err) {
             console.log("Error occured: write file failed")
           }else{
             console.log("Clicked!")
           }
        });
        
        //delay x millisecond and then deassert click signal
        setTimeout(function(){ 
          fs.writeFile("/home/pi/Desktop/MagicMirror/modules/Cargo/interact_in.txt", "0", function (err) {
           if(err) {
             console.log("Error occured: write file failed")
           }else{
             console.log("Not Clicked!")
           }
          });
        }, 100);
          
    }
    
    
     else if (notification === 'CARGO_START') {
        var fs = require('fs');
        
        // Update URL
        if(!this.urlUpdated) {
          // console.log("URL NOT UPDATED!!!!");
          fs.readFile("/home/pi/Desktop/MagicMirror/modules/Cargo/url.txt", function (err, data) {
           if(err) console.log("Error occured: read file failed")
           else {
            url = data.toString().replace(/\s+/g, '')
            //console.log("URL get: " + url);
            } 
          });

            if(url !== "") {
              this.urlUpdated = true;
              this.sendSocketNotification("URL_UP", url);
              console.log("URL updated!!!!");
              fs.writeFile("/home/pi/Desktop/MagicMirror/modules/Cargo/url.txt", "", function (err) {
                if(err) {
                  console.log("Error occured: write file failed")
                }else{
                  console.log("URL text removed!!!")
                }
              });

            }
        }
      
      
        // User presses Retrieval button and enters retrieval page
        if (this.getFinger) {
            fs.readFile("/home/pi/Desktop/MagicMirror/modules/Cargo/name.txt", function (err, data) {
                  if(err) console.log("Error occured: read file failed")
                  name_web = data.toString().replace(/\s+/g, '');
                  //console.log("Confirm: " + confirm);
                });
            
            fs.readFile("/home/pi/Desktop/MagicMirror/modules/Cargo/fingerprint.txt", function (err, data) {
                  if(err) console.log("Error occured: read file failed")
                  name_finger = data.toString().replace(/\s+/g, '');
                  //console.log("Confirm: " + confirm);
                });
        
            if(name_web === name_finger) {
                  // Open lock
                  fs.writeFile("/home/pi/Desktop/MagicMirror/modules/Cargo/lock.txt", "1", function (err) {
                    if(err) {
                      console.log("Error occured: write file failed")
                    }else{
                      
                      console.log("Fingerprint matched! Open lock!")
                    }
                  });
                  this.getFinger = false;
            }
            
        // User presses Cargo button and enters Cargo page
        if (this.inputCargo) {
            fs.readFile("/home/pi/Desktop/MagicMirror/modules/Cargo/delivery.txt", function (err, data) {
                  if(err) console.log("Error occured: read file failed")
                  delivery = data.toString().replace(/\s+/g, '').charAt(0);
                  // console.log("Return home: " + return_home);
                });
        
            fs.readFile("/home/pi/Desktop/MagicMirror/modules/Cargo/confirm.txt", function (err, data) {
                  if(err) console.log("Error occured: read file failed")
                  confirm = data.toString().replace(/\s+/g, '');
                  //console.log("Confirm: " + confirm);
                });
        
        
            if(confirm === '1' && delivery === '1') {
                  // Open lock
                fs.writeFile("/home/pi/Desktop/MagicMirror/modules/Cargo/lock.txt", "1", function (err) {
                    if(err) {
                      console.log("Error occured: write file failed")
                    }else{
                      console.log("Cargo delivery registered! Open lock!");
                    
                    }
                });
              // this.sendSocketNotification("LOCK_OPEN");
              this.inputCargo = false;
            }
        }
            
            
      }
     
        
         fs.readFile("/home/pi/Desktop/MagicMirror/modules/Cargo/interact_end_out.txt", function (err, data) {
           if(err) console.log("Error occured: read file failed")
           return_home = data.toString().replace(/\s+/g, '');
           // console.log("Return home: " + return_home);
           
        });
         
        
        
        if(return_home === '1') {
          // console.log("Return home screen");
          this.sendSocketNotification("RETURN_NOW");
        }
        
        
        
        
    }
    
    else if (notification === "GET_CARGO") {
      this.getFinger = true;
    }
    
    else if (notification === "INPUT_TASK") {
      this.inputCargo = true;
    }
    
    
    else if (notification === "CLOSE_LOCK") {
       var fs = require('fs');
      
      // User presses 'CONFIRM' and leave Cargo Delivery page
      if (payload) {
         // Deassert confirm
            fs.writeFile("/home/pi/Desktop/MagicMirror/modules/Cargo/confirm.txt", "0", function (err) {
              if(err) {
                console.log("Error occured: write file failed")
              }else{
                console.log("User leaves Cargo page! Deassert confirm")
                confirm = '0';
              }
            });
        
            // Close Lock
            fs.writeFile("/home/pi/Desktop/MagicMirror/modules/Cargo/lock.txt", "0", function (err) {
              if(err) {
                console.log("Error occured: write file failed")
              }else{
                console.log("User leaves Cargo page! Close Lock!")
                //console.log("Confirm: " + confirm);
              }
            });
      // User presses 'RECEIVED' and leave Retrieval page 
      }else{
            // Close Lock
              fs.writeFile("/home/pi/Desktop/MagicMirror/modules/Cargo/lock.txt", "0", function (err) {
                  if(err) {
                    console.log("Error occured: write file failed")
                  }else{
                    console.log("User received cargo! Close Lock!")
                    // name_finger = 'xxx';
                    // name_web = "yyy";
                    //console.log("Confirm: " + confirm);
                  }
                });
            
            // Erase name on web
            fs.writeFile("/home/pi/Desktop/MagicMirror/modules/Cargo/name.txt", "xxx", function (err) {
              if(err) {
                console.log("Error occured: write file failed")
              }else{
                name_web = "xxx";
                console.log("Erase web name")
              }
            });
        
            // Erase fingerprint
            fs.writeFile("/home/pi/Desktop/MagicMirror/modules/Cargo/fingerprint.txt", "yyy", function (err) {
              if(err) {
                console.log("Error occured: write file failed")
              }else{
                name_finger = 'yyy';
                console.log("Erase fingerprint name")
                //console.log("Confirm: " + confirm);
              }
            });
        
        
      }
    }
    
    
   
    
  },
});
