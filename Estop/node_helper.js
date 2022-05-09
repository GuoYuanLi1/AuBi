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
    this.estop_file = "/home/pi/Desktop/MagicMirror/modules/Estop/estop.txt";
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'ESTOP_CONFIG') {
      if (!this.started) {
        this.config = payload;
        this.started = true;
        console.log("Estop module has started")
        
        var fs = require('fs');
        // Clear estop
        fs.writeFileSync(this.estop_file, "0");
        console.log("Clear Estop");
      }
    }

    else if (notification === "READ_ESTOP") {
      var fs = require('fs');
      var estop = fs.readFileSync(this.estop_file).toString().replace(/\s+/g, '');
    
      //console.log("outside read data: " + data_read);
      if(estop === '1') {
        // console.log("sending percent: " + percent);
        this.sendSocketNotification("ESTOP");
      }else{
        this.sendSocketNotification("NOT_ESTOP");
      }
         
    }
  },
});
