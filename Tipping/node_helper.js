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
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'CONFIG') {
      if (!this.started) {
        this.config = payload;
        this.started = true;
        console.log("Tipping module has started")
        //this.sendSocketNotification("SHUTIT", payload);
      }
    }

    else if (notification === "READ_WARNING") {
      var fs = require('fs');
      
     
      fs.readFile("/Users/tomli/Desktop/MagicMirror/modules/Tipping/tipping.txt", function (err, data) {
          if(err) console.log("Error occured: read file failed");

          tipping = data.toString().replace(/\s+/g, '');
          //console.log("tipping!");
      });

      //console.log("outside read data: " + data_read);
      if(tipping === '1') {
        // console.log("sending percent: " + percent);
        this.sendSocketNotification("TIPPING");
      }else if(tipping === '0') {
        this.sendSocketNotification("NOT_TIPPING");
      }
         
    }
  },
});
