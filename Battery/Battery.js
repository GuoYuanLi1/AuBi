/* global Module */

/* Magic Mirror
 * Module: Battery
 *
 * By GuoYuan Li
 * Lafayette College.
 */

Module.register("Battery",{

	defaults: {
		battery_level: 0,
	},

	// Define required scripts.
	getScripts: function() {
		return [];
	},

	getStyles: function() {
		return [];
	},

	start: function() {
		Log.info('Starting module: ' + this.name);
		this.sendSocketNotification('BLUELINKY_CONFIG', this.config);
	},

	getDom: function() {
		var batteryWidth = 300;
		var batteryHeight = batteryWidth/4;
		var wrapper = document.createElement("div");


		var svgNS = "http://www.w3.org/2000/svg";
		var svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute('width', batteryWidth * 1.1);
		svg.setAttribute('height', batteryHeight);

		var batteryFrame = document.createElementNS(svgNS, "rect");

		batteryFrame.setAttribute('width', batteryWidth);
		batteryFrame.setAttribute('height', batteryHeight);
		batteryFrame.setAttribute('style', "fill:rgba(0,0,0,0);stroke-width:2;stroke:rgba(255,255,255, 0.75)");
		batteryFrame.setAttribute("rx", batteryWidth/20);
		
		svg.appendChild(batteryFrame);

		var batteryHead = document.createElementNS(svgNS, "rect");
		batteryHead.setAttribute('width', batteryWidth * 0.05);
		batteryHead.setAttribute('height', batteryHeight * 0.6);
		batteryHead.setAttribute("x", batteryWidth); // 25/200*batteryWidth
		batteryHead.setAttribute("y", 0.2 * batteryHeight); // 36/50*batteryHeight
		batteryHead.setAttribute('style', "fill:rgba(0,0,0,0);stroke-width:2;stroke:rgba(255,255,255, 0.75)");
		batteryHead.setAttribute("rx", batteryWidth/200);

		svg.appendChild(batteryHead);

		var shiftedContentContainer = document.createElementNS(svgNS, "svg");
		shiftedContentContainer.setAttribute("x", batteryWidth/80);
		shiftedContentContainer.setAttribute("y", batteryWidth/80);

		var batteryContent = document.createElementNS(svgNS, "rect");

		batteryContent.setAttribute('width', this.config.battery_level/100*batteryWidth * 0.975); //this.battery_level
		batteryContent.setAttribute('height', batteryHeight*0.9);
		if(this.config.battery_level <= 20) {
			batteryContent.setAttribute('style', "fill:rgba(220,45,45,0.7)");
		}else{
			batteryContent.setAttribute('style', "fill:rgba(45,220,45,0.7)");
		}
		batteryContent.setAttribute("rx", batteryWidth/20);
		
		shiftedContentContainer.appendChild(batteryContent);

		var chargeLevelText = document.createElementNS(svgNS, "text");
		chargeLevelText.setAttribute("x", 0.4 * batteryWidth); // 25/200*batteryWidth
		chargeLevelText.setAttribute("y", 0.7 * batteryHeight); // 36/50*batteryHeight
		chargeLevelText.setAttribute("style", "fill:rgba(255,255,255,0.6); font: bold " + 30*batteryWidth/200 + "px sans-serif;");

		var textNode = document.createTextNode(this.config.battery_level + '%'); // this.battery_level
		chargeLevelText.appendChild(textNode);
		shiftedContentContainer.appendChild(chargeLevelText);


		svg.appendChild(shiftedContentContainer);
		wrapper.appendChild(svg);

		var timeago = document.createElement("div");
		timeago.innerText = "Battery Level";
		timeago.style.fontSize = "10pt";
		timeago.style.lineHeight = "10pt"
		wrapper.appendChild(timeago);

		return wrapper;
	},

	

	notificationReceived: function (notification, payload, sender) {
     	switch(notification) {
        	case "DOM_OBJECTS_CREATED":
          		var timer = setInterval(()=> {
          			this.sendSocketNotification("GET_DATA");
        		}, 200);
        	break;
      	}
  	},

 	socketNotificationReceived: function(notification, payload) {
		
		
		if (notification === "STARTED") {
			this.updateDom();
		}
		
		else if (notification === "DATA_READ") {
			this.config.battery_level = parseInt(payload);
			this.updateDom();
		}

		
	},
});