/* Magic Mirror
 * Node Helper: Warning
 *
 * By GuoYuan Li
 * Lafayette College
 * MIT Licensed.
 */
const NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
  start: function () {
    this.started = false;
    this.config = {};
    this.tipping_file = "/home/pi/Desktop/MagicMirror/modules/Tipping/tipping.txt";
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'CONFIG') {
      if (!this.started) {
        this.config = payload;
        this.started = true;
        console.log("Tipping module has started")
       
        var fs = require('fs');
        
        // Clear Tipping
        fs.writeFileSync(this.tipping_file, "0");
        console.log("Clear tipping");
      }
    }

    else if (notification === "READ_WARNING") {
      var fs = require('fs');
      var tipping = fs.readFileSync(this.tipping_file).toString().replace(/\s+/g, '');
     
      if(tipping === '1') {
        console.log("Tipping occurs! Please do not lean!");
        this.sendSocketNotification("TIPPING");
      }else {
        this.sendSocketNotification("NOT_TIPPING");
      }
         
    }
  },
});
