/* Magic Mirror
 * Module: Compliments
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 */
Module.register("compliments", {
	// Module config defaults.
	defaults: {
		compliments: {
			anytime: ["Hi, this is AuBi!\n What can I do for you?"],
			morning: ["Good morning, how can AuBi help you?", "Good morning!\n Is there anything I can do?", "Good morning!\n How was your sleep?"],
			afternoon: ["Hello, this is AuBi!\n Nice to meet you!", "Hi, I'm AuBi!\n Is there anything I can help?", "Good afternoon!\n How may I help you?"],
			evening: ["Good evening!\n How can I help you?", "Hi, I'm AuBi!\n Is there anything I can do?", "Good evening! Nice to meet you!"],
			"....-01-01": ["Happy new year!"]
		},
		updateInterval: 5000,
		remoteFile: null,
		fadeSpeed: 2000,
		morningStartTime: 3,
		morningEndTime: 12,
		afternoonStartTime: 12,
		afternoonEndTime: 17,
		random: true,
		mockDate: null
	},
	lastIndexUsed: -1,
	// Set currentweather from module
	currentWeatherType: "",

	// Define required scripts.
	getScripts: function () {
		return ["moment.js"];
	},

	// Define start sequence.
	start: function () {
		Log.info("Starting module: " + this.name);

		this.lastComplimentIndex = -1;
		this.change = 0;
		this.last_user = "User";

		if (this.config.remoteFile !== null) {
			this.complimentFile((response) => {
				this.config.compliments = JSON.parse(response);
				this.updateDom();
			});
		}

		// Schedule update timer.
	setInterval(() => {
		this.updateDom(this.config.fadeSpeed);
		}, this.config.updateInterval);
		
	
	},

	/**
	 * Generate a random index for a list of compliments.
	 *
	 * @param {string[]} compliments Array with compliments.
	 * @returns {number} a random index of given array
	 */
	randomIndex: function (compliments) {
		if (compliments.length === 1) {
			return 0;
		}

		const generate = function () {
			return Math.floor(Math.random() * compliments.length);
		};

		let complimentIndex = generate();

		while (complimentIndex === this.lastComplimentIndex) {
			complimentIndex = generate();
		}

		this.lastComplimentIndex = complimentIndex;

		return complimentIndex;
	},

	/**
	 * Retrieve an array of compliments for the time of the day.
	 *
	 * @returns {string[]} array with compliments for the time of the day.
	 */
	complimentArray: function () {
		const hour = moment().hour();
		const date = this.config.mockDate ? this.config.mockDate : moment().format("YYYY-MM-DD");
		let compliments;

		if (hour >= this.config.morningStartTime && hour < this.config.morningEndTime && this.config.compliments.hasOwnProperty("morning")) {
			compliments = this.config.compliments.morning.slice(0);
		} else if (hour >= this.config.afternoonStartTime && hour < this.config.afternoonEndTime && this.config.compliments.hasOwnProperty("afternoon")) {
			compliments = this.config.compliments.afternoon.slice(0);
		} else if (this.config.compliments.hasOwnProperty("evening")) {
			compliments = this.config.compliments.evening.slice(0);
		}

		if (typeof compliments === "undefined") {
			compliments = [];
		}

		if (this.currentWeatherType in this.config.compliments) {
			compliments.push.apply(compliments, this.config.compliments[this.currentWeatherType]);
		}

		compliments.push.apply(compliments, this.config.compliments.anytime);

		for (let entry in this.config.compliments) {
			if (new RegExp(entry).test(date)) {
				compliments.push.apply(compliments, this.config.compliments[entry]);
			}
		}

		return compliments;
	},

	/**
	 * Retrieve a file from the local filesystem
	 *
	 * @param {Function} callback Called when the file is retrieved.
	 */
	complimentFile: function (callback) {
		const xobj = new XMLHttpRequest(),
			isRemote = this.config.remoteFile.indexOf("http://") === 0 || this.config.remoteFile.indexOf("https://") === 0,
			path = isRemote ? this.config.remoteFile : this.file(this.config.remoteFile);
		xobj.overrideMimeType("application/json");
		xobj.open("GET", path, true);
		xobj.onreadystatechange = function () {
			if (xobj.readyState === 4 && xobj.status === 200) {
				callback(xobj.responseText);
			}
		};
		xobj.send(null);
	},

	/**
	 * Retrieve a random compliment.
	 *
	 * @returns {string} a compliment
	 */
	randomCompliment: function () {
		// get the current time of day compliments list
		const compliments = this.complimentArray();
		// variable for index to next message to display
		let index;
		// are we randomizing
		if (this.config.random) {
			// yes
			index = this.randomIndex(compliments);
		} else {
			// no, sequential
			// if doing sequential, don't fall off the end
			index = this.lastIndexUsed >= compliments.length - 1 ? 0 : ++this.lastIndexUsed;
		}

		return compliments[index] || "";
	},

	// Override dom generator.
	getDom: function () {
		const wrapper = document.createElement("div");
		wrapper.className = this.config.classes ? this.config.classes : "thin xlarge bright pre-line";
		// get the compliment text
		const complimentText = this.randomCompliment();
		// split it into parts on newline text
		const parts = complimentText.split("\n");
		// create a span to hold it all
		const compliment = document.createElement("span");
		// process all the parts of the compliment text
		for (const part of parts) {
			// create a text element for each part
			compliment.appendChild(document.createTextNode(part));
			// add a break `
			compliment.appendChild(document.createElement("BR"));
		}
		// remove the last break
		compliment.lastElementChild.remove();
		wrapper.appendChild(compliment);

		return wrapper;
	},

	// From data currentweather set weather type
	setCurrentWeatherType: function (type) {
		this.currentWeatherType = type;
	},

	// Override notification handler.
	notificationReceived: function (notification, payload, sender) {
		
		if (notification === "CURRENTWEATHER_TYPE") {
			this.setCurrentWeatherType(payload.type);
		}
		
			if (notification === "IDENTIFIED") {
				this.config.compliments = {
					anytime: ["Hey there, " + payload + "!"],
					morning: ["Good morning, " + payload + "!", "Enjoy your day! " + payload + "!", "Hi "+ payload + "! How was your sleep?"],
					afternoon: ["Good afternoon, " + payload + "!"],
					evening: ["Good evening, " + payload + "!"],
					"....-01-01": ["Happy new year!"]
				};
				if(this.change !== 1 || this.last_user !== payload) {
					this.updateDom();
					this.change = 1;
					this.last_user = payload;
				}
		}else if(notification === "UNKNOWN"){
			this.config.compliments = {
				anytime: ["Hi, this is AuBi!\n What can I do for you?"],
				morning: ["Good morning, how can AuBi help you?", "Good morning!\n Is there anything I can do?", "Good morning!\n How was your sleep?"],
				afternoon: ["Hello, this is AuBi!\n Nice to meet you!", "Hi, I'm AuBi!\n Is there anything I can help?", "Good afternoon!\n How may I help you?"],
				evening: ["Good evening!\n How can I help you?", "Hi, I'm AuBi!\n Is there anything I can do?", "Good evening! Nice to meet you!"],
				"....-01-01": ["Happy new year!"]
			};
			if(this.change !== 0  || this.last_user !== payload) {
					this.updateDom();
					this.change = 0;
					this.last_user = payload;
				}
			
		}
		
		
			
	}
});
