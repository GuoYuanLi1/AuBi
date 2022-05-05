/* Magic Mirror
 * Warning.js
 *
 * By GuoYuan Li
 * Lafayette college
 * 
 */

Module.register("Tipping", {
  defaults: {
    tipping: false,
  },

  start: function () {
    Log.info(this.name + " has started...");
    this.sendSocketNotification("CONFIG", this.config);
  },

  getStyles: function () {
    return [this.file("css/tipping.css"), "font-awesome.css"];
  },

  // Load translations files
  getTranslations: function () {
    return {
      en: "translations/en.json",
      nb: "translations/nb.json",
    };
  },

  createWarningContainer: function () {
    const Warningcontainer = document.createElement("div");
    Warningcontainer.className = "st-warningcontainer";

    return Warningcontainer;
  },


  toggleSideMenu: function () {
    const menuToggleDiv = document.getElementById("st-warningmenu-toggle")
    menuToggleDiv.classList.toggle('show');

    const mainMenuDiv = document.getElementById("st-warningmain-menu")
    mainMenuDiv.classList.toggle('show');
  },

  

  createMenuToggleButtonDiv: function () {
    const menuToggleButtonDiv = document.createElement("div");
    menuToggleButtonDiv.className = "st-warningcontainer__warningmenu-toggle";
    menuToggleButtonDiv.id = "st-warningmenu-toggle";

    return menuToggleButtonDiv;
  },

  

  createTippingWarningHeader: function () {
    const header = document.createElement("li");
    header.innerText = "TIPPING WARNING";
    header.style.fontSize = "65pt";
    header.style.lineHeight = "65pt";

    return header;
  },

  createTippingWarningText: function () {
    const text = document.createElement("li");
    text.innerText = "I'm a BAD robot but I'm not bad!\nPlease DO NOT lean on me!";
    text.style.fontSize = "30pt";
    text.style.lineHeight = "30pt";

    return text;

  },


  
  createMainMenuDiv: function () {
    const mainMenuDiv = document.createElement("div");
    mainMenuDiv.className = "st-warningcontainer__warningmain-menu";
    mainMenuDiv.id = "st-warningmain-menu";


    const WarningHeader = this.createTippingWarningHeader();
    const WarningText = this.createTippingWarningText();

    // const restartButton = this.createRestartButton();

    const buttonList = document.createElement("ul");

    buttonList.appendChild(WarningHeader);
    buttonList.appendChild(WarningText);
    

    mainMenuDiv.appendChild(buttonList);

    return mainMenuDiv;
  },

  getDom: function () {
    
    const container = this.createWarningContainer();

    const menuToggleButton = this.createMenuToggleButtonDiv();
    container.appendChild(menuToggleButton);
    

    const mainMenu = this.createMainMenuDiv();
    document.body.appendChild(mainMenu);

    return container;
  },

  notificationReceived: function (notification, payload, sender) {
     switch(notification) {
        case "DOM_OBJECTS_CREATED":
          var timer = setInterval(()=>{
          this.sendSocketNotification("READ_WARNING");
        }, 200);
        break
      }
  },


  socketNotificationReceived: function (notification) {
    switch(notification) {
      case "TIPPING":
        if(!this.config.tipping) {
          this.config.tipping = true;
          this.updateDom();
          this.toggleSideMenu();
        }
        break;

      case "NOT_TIPPING":
        if(this.config.tipping) {
          this.config.tipping = false;
          this.updateDom();
          this.toggleSideMenu();
        }
        break;
    }
  },

});