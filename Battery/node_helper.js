'use strict';

/* Magic Mirror
 * Module: MMM-Tesla2
 *
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
//const Bluelinky = require('bluelinky');
var util = require("util");

module.exports = NodeHelper.create({

	start: function() {
		this.started = false;
		//this.config = null;
    //this.vehicle_data = null;
  },

  

	socketNotificationReceived: async function(notification, payload) {
		var self = this;
		if (notification === 'BLUELINKY_CONFIG' && self.started == false) {
			se;f.started = true;
			self.sendSocketNotification("STARTED", true);
		}

    else if (notification == 'BLUELINKY_CONFIG') {
      self.sendSocketNotification("CAR_DATA", self.vehicle_data);
    }



    if (notification === 'DO_YOUR_JOB') {
      var fs = require('fs');
     
      fs.readFile("/Users/tomli/Desktop/MagicMirror/modules/MMM-Bluelinky/percent.txt", function (err, data) {
          if(err) console.log("Error occured: read file failed");

          var percent = data.toString().replace(/\s+/g, '');
          this.sendSocketNotification("DATA_READ", percent);
           
           
        });
        
        
    }
	},
});
