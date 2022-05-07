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
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'CARGO_CONFIG') {
      if (!this.started) {
        this.config = payload;
        this.started = true;
        console.log("cargo module has started")
        
        
      }
      


    }

    

    if (notification === 'READ_URL') {
      
      console.log("URL GET!");
    }

    

    if (notification === 'assert') {
      var fs = require('fs');
     
      fs.writeFile("/Users/tomli/Desktop/MagicMirror/modules/Cargo/interact_in.txt", "1", function (err) {
           if(err) {
             console.log("Error occured: write file failed")
           }else{
             console.log("Clicked!")
           }
        });
        
        //delay x millisecond and then deassert click signal
        setTimeout(function(){ 
          fs.writeFile("/Users/tomli/Desktop/MagicMirror/modules/Cargo/interact_in.txt", "0", function (err) {
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
      var return_home = '';
     
      fs.readFile("/Users/tomli/Desktop/MagicMirror/modules/Cargo/interact_end_out.txt", function (err, data) {
           if(err) console.log("Error occured: read file failed")
           return_home = data.toString().replace(/\s+/g, '');
           // console.log("Return home: " + return_home);
           
        });
        
        if(return_home === '1') {
          // console.log("Return home screen");
          this.sendSocketNotification("RETURN_NOW");
        }

        

        
        /*
        if ((url !== "") && !this.urlUpdated) {
            this.urlUpdated = true;
            this.sendSocketNotification("URL_UP", url);
        }
        */


        if(!this.urlUpdated) {
          console.log("URL NOT UPDATED!!!!");
          fs.readFile("/Users/tomli/Desktop/MagicMirror/modules/Cargo/url.txt", function (err, data) {
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
            fs.writeFile("/Users/tomli/Desktop/MagicMirror/modules/Cargo/url.txt", "", function (err) {
              if(err) {
                console.log("Error occured: write file failed")
              }else{
                console.log("URL text removed!!!")
              }
            });



          }
        }


          
      
    }
   
    
  },
});