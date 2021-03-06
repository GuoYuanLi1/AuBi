

/* Magic Mirror
 * Module: MMM-Tesla2
 *
 * Lafayette College.
 */

const NodeHelper = require('node_helper');
var util = require("util");

module.exports = NodeHelper.create({

  start: function() {
    this.started = false;
    this.percent_file = "/home/pi/Desktop/MagicMirror/modules/Battery/percent.txt";
  },

  

  socketNotificationReceived: function(notification, payload) {
    var self = this;
    if (notification === 'BLUELINKY_CONFIG' && self.started == false) {
      self.started = true;
      self.sendSocketNotification("STARTED", true);
    }

    
    else if (notification === "GET_DATA") {
      var fs = require('fs');
      var percent = fs.readFileSync(this.percent_file).toString().replace(/\s+/g, '');
      /*
      fs.readFile("/home/pi/Desktop/MagicMirror/modules/Battery/percent.txt", function (err, data) {
          if(err) console.log("Error occured: read file failed");

          percent = data.toString().replace(/\s+/g, '');
          
      });
      * */

      
      if(percent !== "") {
        // console.log("sending percent: " + percent);
        this.sendSocketNotification("DATA_READ", percent);
      }
         
    }

  },
});
