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
    resume: false,
    
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


  toggleResumeMenu: function () {
    var menuToggleDiv = document.getElementById("st-resumemenu-toggle")
    menuToggleDiv.classList.toggle('show');

    var mainMenuDiv = document.getElementById("st-resumemain-menu")
    mainMenuDiv.classList.toggle('show');
  },


  createMenuToggleButtonDiv: function () {
    var menuToggleButtonDiv = document.createElement("div");
    menuToggleButtonDiv.className = "st-estopcontainer__estopmenu-toggle";
    menuToggleButtonDiv.id = "st-estopmenu-toggle";

    return menuToggleButtonDiv;
  },


  createResumeToggleButtonDiv: function () {
    var menuToggleButtonDiv = document.createElement("div");
    menuToggleButtonDiv.className = "st-estopcontainer__resumemenu-toggle";
    menuToggleButtonDiv.id = "st-resumemenu-toggle";

    return menuToggleButtonDiv;
  },


  createResumeButton: function () {
    var ResumeButtonItem = document.createElement("li");
    
    ResumeButtonItem.className = "li-t";
    ResumeButtonItem.innerHTML = "<span class='fa fa-check fa-3x'></span>"
        + "<br>" + this.translate('Resume');

    
    ResumeButtonItem.addEventListener("click", () => {

      
        this.toggleResumeMenu();

     
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


  createResumeWarningHeader: function () {
    var header = document.createElement("li");
    header.innerText = "ESTOP WARNING";
    header.style.fontSize = "65pt";
    header.style.lineHeight = "65pt";

    return header;
  },

  createResumeWarningText: function () {
    var text = document.createElement("li");
    text.innerText = "ESTOP is released!\nFunctionality resumes when RESUME button is pressed!";
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
    //var ResumeButton = this.createResumeButton();

    

    var buttonList = document.createElement("ul");

    buttonList.appendChild(WarningHeader);
    buttonList.appendChild(WarningText);
    //buttonList.appendChild(ResumeButton);
    

    mainMenuDiv.appendChild(buttonList);

    return mainMenuDiv;
  },


  createResumeMenuDiv: function () {
    var mainMenuDiv = document.createElement("div");
    mainMenuDiv.className = "st-estopcontainer__resumemain-menu";
    mainMenuDiv.id = "st-resumemain-menu";


    var resumeHeader = this.createResumeWarningHeader();
    var resumeText = this.createResumeWarningText();
    var ResumeButton = this.createResumeButton();

    

    var buttonList = document.createElement("ul");

    buttonList.appendChild(resumeHeader);
    buttonList.appendChild(resumeText);
    buttonList.appendChild(ResumeButton);
    

    mainMenuDiv.appendChild(buttonList);

    return mainMenuDiv;
  },

  getDom: function () {
    
    var container = this.createEstopContainer();
    

    var menuToggleButton = this.createMenuToggleButtonDiv();
    container.appendChild(menuToggleButton);

    var resumeToggleButton = this.createResumeToggleButtonDiv();
    container.appendChild(resumeToggleButton);
    

    var mainMenu = this.createMainMenuDiv();
    document.body.appendChild(mainMenu);

    var resumeMenu = this.createResumeMenuDiv();
    document.body.appendChild(resumeMenu);

    return container;
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
          /*
           if(this.config.resume) {
            this.toggleResumeMenu();
            this.config.resume = false;
          }
          * */
        }
        break;

      case "NOT_ESTOP":
        if(this.config.estop) {
          this.config.resume = true;
          this.config.estop = false;
          this.toggleSideMenu();
          this.toggleResumeMenu();
          
          //this.config.resume = false;
        }
        break;
    }
  },

});
