var util = require("util");


/// node_helper.js
var NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
  start: function() {
    this.started = false;
    this.countDown = 10000000;
    this.facial_file = "/home/pi/Desktop/MagicMirror/modules/Facial/face_name.txt";
  },
  socketNotificationReceived: function(notification, payload) {
    switch(notification) {
      case "FACIAL_CONFIG":
        
        if(!this.started) {
          this.started = true;
          console.log("Facial Recognition module has started");
        }
        
        var fs = require('fs');
        // Intialize the face name to Guest
        fs.writeFileSync(this.facial_file, "Guest");
        console.log("Close the initially opened lock!");
        
        break;
      
      
      
      
      
      
      case "READ_FACE":

        var fs = require('fs');
        var face_rec_name = fs.readFileSync(this.facial_file).toString().replace(/\s+/g, '');
      /*
      fs.readFile("/home/pi/Desktop/MagicMirror/modules/Facial/sample.txt", function(err,data)
            {
                if(err)
                    console.log(err)
                else{
                    face_rec_name = data.toString().replace(/\s+/g, '')
                    console.log(face_rec_name);
                  }
            });
            * */
      
        if(face_rec_name !== "Guest") {
          this.sendSocketNotification("I_DID", face_rec_name);
        }else{
          this.sendSocketNotification("I_NOT", face_rec_name);
        }
          break;
    }
  },
})
