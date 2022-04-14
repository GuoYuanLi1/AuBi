Module.register("MMM-SmartTouch", {
  defaults: {
    // Unselected: "<span class='fa fa-circle fa-3x'></span>" + "<br>",
    GoToButton: null,
    DeliveryButton: null,
    ConfirmButton: null,
  },
  

  start: function () {
    Log.info(this.name + " has started...");
    this.sendSocketNotification("CONFIG", this.config);
  },

  getStyles: function () {
    return [this.file("css/mmm-smarttouch.css"), "font-awesome.css"];
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
  
  
  
  
  deselect: function () {
    GoToButton.innerHTML = "<span class='fa fa-circle fa-3x'></span>"
        + "<br>" + this.translate('Go to location'); 
    DeliveryButton.innerHTML = "<span class='fa fa-circle fa-3x'></span>"
        + "<br>" + this.translate('Delivery');
    
    
  },

  createStandByButtonDiv: function () {
    const standByButtonDiv = document.createElement("div");
    standByButtonDiv.className = "st-container__standby-button";

    standByButtonDiv.appendChild(document.createElement("span"))
    standByButtonDiv.addEventListener("click", () => this.toggleStandby());

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
    /**
    menuToggleButtonDiv.className = "st-container__menu-toggle";
    menuToggleButtonDiv.id = "st-menu-toggle";

    const hamburgerLineOne = document.createElement("div");
    hamburgerLineOne.className = "st-container__menu-toggle st-toggle__bar_one";

    const hamburgerLineTwo = document.createElement("div");
    hamburgerLineTwo.className = "st-toggle__bar_two";

    const hamburgerLineThree = document.createElement("div");
    hamburgerLineThree.className = "st-toggle__bar_three";

    menuToggleButtonDiv.appendChild(hamburgerLineOne);
    menuToggleButtonDiv.appendChild(hamburgerLineTwo);
    menuToggleButtonDiv.appendChild(hamburgerLineThree);
    * */
    menuToggleButtonDiv.innerHTML = "<span class='fa fa-archive fa-3x'></span>"
        + "<br>" + this.translate('');
    menuToggleButtonDiv.className = "st-container__menu-toggle";

    menuToggleButtonDiv.addEventListener("click", () => {
      this.sendSocketNotification("assert");
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
      this.sendSocketNotification("assert");
      this.deselect();
      this.toggleSideMenu();
    });
      

    return closeButtonItem;
  },
  

  createConfirmButton: function () {
    const ConfirmButtonItem = document.createElement("li");
    ConfirmButtonItem.innerHTML = "<span class='fa fa-circle fa-3x'></span>"
        + "<br>" + this.translate('Confirm');
    ConfirmButtonItem.className = "li-t";
  
    
    ConfirmButtonItem.addEventListener("click", () => {
     
        ConfirmButtonItem.innerHTML = "<span class='fa fa-bullseye fa-3x'></span>"
        + "<br>" + this.translate('Go to location');
      
    });
    
    return ConfirmButtonItem;
  },
  
  
  createGoToButton: function () {
    const GoToButtonItem = document.createElement("li");
    GoToButtonItem.innerHTML = "<span class='fa fa-circle fa-3x'></span>"
        + "<br>" + this.translate('Go to location');
    GoToButtonItem.className = "li-t";
    
    
    GoToButtonItem.addEventListener("click", () => {
     
        GoToButtonItem.innerHTML = "<span class='fa fa-bullseye fa-3x'></span>"
        + "<br>" + this.translate('Go to location');
        DeliveryButton.innerHTML = "<span class='fa fa-circle fa-3x'></span>"
        + "<br>" + this.translate('Delivery');
        this.sendSocketNotification("assert");
        //setInterval(function(){ this.sendSocketNotification("deassert"); }, 10);
        
       
    });
    
    return GoToButtonItem;
  },
  
  
  createDeliveryButton: function () {
    const DeliveryButtonItem = document.createElement("li");
    DeliveryButtonItem.innerHTML = "<span class='fa fa-circle fa-3x'></span>"
        + "<br>" + this.translate('Delivery');
    DeliveryButtonItem.className = "li-t";
  
    
    DeliveryButtonItem.addEventListener("click", () => {
        DeliveryButtonItem.innerHTML = "<span class='fa fa-bullseye fa-3x'></span>"
        + "<br>" + this.translate('Delivery');
        GoToButton.innerHTML = "<span class='fa fa-circle fa-3x'></span>"
        + "<br>" + this.translate('Go to location');
        this.sendSocketNotification("assert");
        //setInterval(function(){ this.sendSocketNotification("deassert"); }, 10);
        
        
    });
    
    
    return DeliveryButtonItem;
  },
  

/*
  createRestartButton: function () {
    const restartButtonItem = document.createElement("li");
    restartButtonItem.innerHTML = "<span class='fa fa-repeat fa-3x'></span>"
        + "<br>" + this.translate('RESTART');
    restartButtonItem.className = "li-t"

    // Send restart notification when clicked
    restartButtonItem.addEventListener("click",
        () => this.sendSocketNotification("RESTART", {}));

    return restartButtonItem
  },
  * */

  createMainMenuDiv: function () {
    const mainMenuDiv = document.createElement("div");
    mainMenuDiv.className = "st-container__main-menu";
    mainMenuDiv.id = "st-main-menu";

    
    const closeButton = this.createCloseButton();
    GoToButton = this.createGoToButton();
    DeliveryButton = this.createDeliveryButton();

    const buttonList = document.createElement("ul");
    buttonList.appendChild(closeButton);
    buttonList.appendChild(GoToButton);
    buttonList.appendChild(DeliveryButton);

    mainMenuDiv.appendChild(buttonList);

    return mainMenuDiv;
  },

  getDom: function () {
    // Initial standby state
    document.body.className = "st-standby show";
    
    this.sendSocketNotification("deassert");

    const container = this.createContainerDiv();

    const standByButton = this.createStandByButtonDiv();
    container.appendChild(standByButton);

    const menuToggleButton = this.createMenuToggleButtonDiv();
    container.appendChild(menuToggleButton);

    const mainMenu = this.createMainMenuDiv();
    document.body.appendChild(mainMenu);
    

    return container;
  },
  

  notificationReceived: function (notification, payload, sender) {
  },

  // Recieve notification from sockets via nodehelper.js
  socketNotificationReceived: function (notification, payload) {
  },

});
