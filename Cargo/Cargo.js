// var util = require("util");

Module.register("Cargo", {
  defaults: {
    Openpage: false,
    url: "http://localhost:8081/",
  },
  

  start: function () {
    Log.info(this.name + " has started...");
    //this.updateURL();
    this.sendSocketNotification("CARGO_CONFIG", this.config);
  },

  getStyles: function () {
    return [this.file("css/cargo.css"), "font-awesome.css"];
  },

  // Load translations files
  getTranslations: function () {
    return {
      en: "translations/en.json",
      nb: "translations/nb.json",
    };
  },

  createContainerDiv: function () {
    const containerDiv = document.createElement("div");
    containerDiv.className = "st-container";

    return containerDiv;
  },

  toggleStandby: function () {
    const existingBodyClass = document.body.className;
    if (existingBodyClass === "st-standby show") {
      document.body.className = "st-standby fade";
    } else {
      document.body.className = "st-standby show";
    }
  },
  

  updateURL: function () {
    var fs = require('fs');
    fs.readFile("/Users/tomli/Desktop/MagicMirror/modules/Cargo/url.txt", function (err, data) {
           if(err) console.log("Error occured: read file failed")
           else this.config.url = data.toString().replace(/\s+/g, '');
           // console.log("Return home: " + return_home);
           
        });
    this.sendSocketNotification("READ_URL");

  },

  createStandByButtonDiv: function () {
    const standByButtonDiv = document.createElement("div");
    standByButtonDiv.className = "st-container__standby-button";

    standByButtonDiv.appendChild(document.createElement("span"))
    standByButtonDiv.addEventListener("click", () => {
      this.toggleStandby();
    });

    return standByButtonDiv;
  },

  toggleSideMenu: function () {
    const menuToggleDiv = document.getElementById("st-menu-toggle")
    menuToggleDiv.classList.toggle('show');

    const mainMenuDiv = document.getElementById("st-main-menu")
    mainMenuDiv.classList.toggle('show')
  },

  createMenuToggleButtonDiv: function () {
    //const menuToggleButtonItem = document.createElement("li");
    const menuToggleButtonDiv = document.createElement("div");
    menuToggleButtonDiv.id = "st-menu-toggle";
    
    menuToggleButtonDiv.innerHTML = "<span class='fa fa-archive fa-3x'></span>"
        + "<br>" + this.translate('');
    menuToggleButtonDiv.className = "st-container__menu-toggle";

    menuToggleButtonDiv.addEventListener("click", () => {
      this.sendSocketNotification("assert");
      Openpage = true;
      this.toggleSideMenu();
      });

    //return menuToggleButtonItem;
    return menuToggleButtonDiv;
  },

  createCloseButton: function () {
    const closeButtonItem = document.createElement("li");
    closeButtonItem.innerHTML = "<span class='fa fa-times-circle fa-3x'></span>"
        + "<br>" + this.translate('CLOSE');
    closeButtonItem.className = "li-t";
    closeButtonItem.addEventListener("click", () => {
      this.config.Openpage = false;
      this.sendSocketNotification("assert");
      this.toggleSideMenu();
    });

    return closeButtonItem;
  },
  


  createIFrame: function () {
    var reader = new FileReader();

    iframe = document.createElement("IFRAME");
    iframe.width = "99.5%";
    iframe.height = "630px";
    iframe.scrolling = "no";
    iframe.src = this.config.url; 
    
    return iframe;
  },
  
  
  createMainMenuDiv: function () {
    const mainMenuDiv = document.createElement("div");
    mainMenuDiv.className = "st-container__main-menu";
    mainMenuDiv.id = "st-main-menu";
    
    const closeButton = this.createCloseButton();
    iFrame = this.createIFrame();
    

    const buttonList = document.createElement("ul");
    //buttonList.id = "button-list";
    buttonList.appendChild(closeButton);
    buttonList.appendChild(iFrame);
    
    
    mainMenuDiv.appendChild(buttonList);

    return mainMenuDiv;
  },

  getDom: function () {
    // read URL
    //this.updateURL();

    // Initial standby state
    document.body.className = "st-standby show";
    
    ///this.sendSocketNotification("deassert");

    const container = this.createContainerDiv();

    const standByButton = this.createStandByButtonDiv();
    container.appendChild(standByButton);

    const menuToggleButton = this.createMenuToggleButtonDiv();
    container.appendChild(menuToggleButton);

    const mainMenu = this.createMainMenuDiv();
    document.body.appendChild(mainMenu);
    

    return container;
  },


  updateScreen: function () {
    let mainMenu = document.getElementById("st-main-menu");
    document.body.removeChild(mainMenu);

    const newMenu = this.createMainMenuDiv();
    document.body.appendChild(newMenu);

  },
  

  notificationReceived: function (notification, payload, sender) {
     switch(notification) {
        case "DOM_OBJECTS_CREATED":
          var timer = setInterval(()=>{
          this.sendSocketNotification("DO_YOUR_JOB");
        }, 200)
        break
      }
  },

  // Recieve notification from sockets via nodehelper.js
  socketNotificationReceived: function (notification, payload) {
    switch(notification) {
      
      
      case "URL_UP":
        mainMenu = document.getElementById("st-main-menu");
        buttonList = mainMenu.firstChild;
        iFrame = buttonList.lastChild;
        iFrame.src = payload;
        break;
        
        

      case "RETURN_NOW":
        if(Openpage) {
          this.toggleSideMenu();
          Openpage = false;
        }
        break;
    }
  },

});