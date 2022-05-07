var util = require("util");


/// node_helper.js
var NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
  start: function() {
    this.countDown = 10000000
  },
  socketNotificationReceived: function(notification, payload) {
    switch(notification) {
      case "DO_YOUR_JOB":


      var fs = require('fs');
      var face_rec_name = '';
      fs.readFile("/home/pi/Desktop/MagicMirror/modules/Facial/sample.txt", function(err,data)
            {
                if(err)
                    console.log(err)
                else{
                    face_rec_name = data.toString().replace(/\s+/g, '')
                    console.log(face_rec_name);
                  }
            });
      
      if(face_rec_name != "Guest") 
      {
         this.sendSocketNotification("I_DID", face_rec_name);
      }else{
        this.sendSocketNotification("I_NOT", face_rec_name);
      }

            
  /*
      fs.readdir('/home/pi/Desktop/MagicMirror/modules/Facial/public/', (err, datadir) => {
        if (err) throw err;
          
          // Try it where we expect a match
          const checker = value =>
          ['-id.png'].some(element => value.includes(element));
          face_name_id = datadir.filter(checker)[0];
          
          
          face_name_id = face_name_id.split("-")
          face_name_display = face_name_id[0];
        
           if(face_rec_name == face_name_display)
          {
            console.log("state: I_DID, name is %s", face_name_display);
            this.sendSocketNotification("I_DID", face_rec_name)
          }else
          {
            this.sendSocketNotification("I_NOT", face_rec_name)
          }
          
          
      });
      * */
        break
    }
  },
})
