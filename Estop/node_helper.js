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
    if (notification === 'ESTOP_CONFIG') {
      if (!this.started) {
        this.config = payload;
        this.started = true;
        console.log("Estop module has started")
        //this.sendSocketNotification("SHUTIT", payload);
      }
    }

    else if (notification === "READ_ESTOP") {
      var fs = require('fs');
      
     
      fs.readFile("/home/pi/Desktop/MagicMirror/modules/Estop/estop.txt", function (err, data) {
          if(err) console.log("Error occured: read file failed");

          estop = data.toString().replace(/\s+/g, '');
          //console.log("tipping!");
      });

      //console.log("outside read data: " + data_read);
      if(estop === '1') {
        // console.log("sending percent: " + percent);
        this.sendSocketNotification("ESTOP");
      }else if(estop === '0') {
        this.sendSocketNotification("NOT_ESTOP");
      }
         
    }
  },
});
