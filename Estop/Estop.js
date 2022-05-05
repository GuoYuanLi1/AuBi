/* Magic Mirror
 * Warning.js
 *
 * By GuoYuan Li
 * Lafayette college
 * 
 */

Module.register("Estop", {
  defaults: {
    estop: false,
    change: false,
  },

  start: function () {
    Log.info(this.name + " has started...");
    this.sendSocketNotification("ESTOP_CONFIG", this.config);
  },

  getStyles: function () {
    return [this.file("css/estop.css"), "font-awesome.css"];
  },

  // Load translations files
  getTranslations: function () {
    return {
      en: "translations/en.json",
      nb: "translations/nb.json",
    };
  },

  createEstopContainer: function () {
    var Estopcontainer = document.createElement("div");
    Estopcontainer.className = "st-estopcontainer";

    return Estopcontainer;
  },


  toggleSideMenu: function () {
    var menuToggleDiv = document.getElementById("st-estopmenu-toggle")
    menuToggleDiv.classList.toggle('show');

    var mainMenuDiv = document.getElementById("st-estopmain-menu")
    mainMenuDiv.classList.toggle('show');
  },

  

  createMenuToggleButtonDiv: function () {
    var menuToggleButtonDiv = document.createElement("div");
    menuToggleButtonDiv.className = "st-estopcontainer__estopmenu-toggle";
    menuToggleButtonDiv.id = "st-estopmenu-toggle";

    return menuToggleButtonDiv;
  },


  createResumeButton: function () {
    var ResumeButtonItem = document.createElement("li");
    
    ResumeButtonItem.className = "li-t";
    if(this.config.change) ResumeButtonItem.innerHTML = "<span class='fa fa-circle fa-3x'></span>"
        + "<br>" + this.translate('Resume');;

    
    ResumeButtonItem.addEventListener("click", () => {
      
        if(!this.config.estop) this.toggleSideMenu();

     
    });
    
    return ResumeButtonItem;
  },

  

  createEstopWarningHeader: function () {
    var header = document.createElement("li");
    header.innerText = "ESTOP WARNING";
    header.style.fontSize = "65pt";
    header.style.lineHeight = "65pt";

    return header;
  },

  createEstopWarningText: function () {
    var text = document.createElement("li");
    text.innerText = "ESTOP is pressed!\nFunctionality resumes when ESTOP is released!";
    text.style.fontSize = "30pt";
    text.style.lineHeight = "30pt";
   

    return text;

  },


  
  createMainMenuDiv: function () {
    var mainMenuDiv = document.createElement("div");
    mainMenuDiv.className = "st-estopcontainer__estopmain-menu";
    mainMenuDiv.id = "st-estopmain-menu";


    var WarningHeader = this.createEstopWarningHeader();
    var WarningText = this.createEstopWarningText();
    var ResumeButton = this.createResumeButton();

    

    var buttonList = document.createElement("ul");

    buttonList.appendChild(WarningHeader);
    buttonList.appendChild(WarningText);
    buttonList.appendChild(ResumeButton);
    

    mainMenuDiv.appendChild(buttonList);

    return mainMenuDiv;
  },

  getDom: function () {
    
    //var container = this.createEstopContainer();
    var Estopcontainer = document.createElement("div");
    Estopcontainer.className = "st-estopcontainer";

    //var menuToggleButton = this.createMenuToggleButtonDiv();
    var menuToggleButtonDiv = document.createElement("div");
    menuToggleButtonDiv.className = "st-estopcontainer__estopmenu-toggle";
    menuToggleButtonDiv.id = "st-estopmenu-toggle";
    Estopcontainer.appendChild(menuToggleButtonDiv);
    

    //var mainMenu = this.createMainMenuDiv();
    var mainMenuDiv = document.createElement("div");
    mainMenuDiv.className = "st-estopcontainer__estopmain-menu";
    mainMenuDiv.id = "st-estopmain-menu";

    var buttonList = document.createElement("ul");

    var header = document.createElement("li");
    header.innerText = "ESTOP WARNING";
    header.style.fontSize = "65pt";
    header.style.lineHeight = "65pt";

    buttonList.appendChild(header);

    var text = document.createElement("li");
    text.innerText = "ESTOP is pressed!\nFunctionality resumes when ESTOP is released!";
    text.style.fontSize = "30pt";
    text.style.lineHeight = "30pt";

    buttonList.appendChild(text);


    var ResumeButtonItem = document.createElement("li");
    ResumeButtonItem.className = "li-t";
     ResumeButtonItem.innerHTML = "<span class='fa fa-check fa-3x'></span>"
        + "<br>" + this.translate('Press here after releasing ESTOP');;
    ResumeButtonItem.addEventListener("click", () => {
      
        if(!this.config.estop) this.toggleSideMenu();

    });

    buttonList.appendChild(ResumeButtonItem);

    mainMenuDiv.appendChild(buttonList);

    document.body.appendChild(mainMenuDiv);
    // Estopcontainer.appendChild(mainMenuDiv);

    return Estopcontainer;
  },

  notificationReceived: function (notification, payload, sender) {
     switch(notification) {
        case "DOM_OBJECTS_CREATED":
          var timer = setInterval(()=>{
          this.sendSocketNotification("READ_ESTOP");
        }, 200);
        break
      }
  },


  socketNotificationReceived: function (notification) {
    switch(notification) {
      case "ESTOP":
        if(!this.config.estop) {
          this.config.estop = true;
          this.toggleSideMenu();
        }
        break;

      case "NOT_ESTOP":
        if(this.config.estop) {
          this.config.estop = false;
          this.config.change = true;
          this.updateDom();
          //this.config.change = false;
        }
        break;
    }
  },

});