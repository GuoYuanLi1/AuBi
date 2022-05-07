Module.register("Cargo", {
  defaults: {
    Openpage: false,
    lockOpen: false,
    url: "http://localhost:8081/",
  },
  

  start: function () {
    Log.info(this.name + " has started...");
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

  
  
  toggleReceiveMenu: function () {
    const menuToggleDiv = document.getElementById("st-receivemenu-toggle")
    menuToggleDiv.classList.toggle('show');

    const mainMenuDiv = document.getElementById("st-receivemain-menu")
    mainMenuDiv.classList.toggle('show')
  },
  

  createReceiveButtonDiv: function () {
    const receiveButtonDiv = document.createElement("div");
    receiveButtonDiv.className = "st-container__receive-button";
    receiveButtonDiv.id = "st-receivemenu-toggle";

    receiveButtonDiv.innerHTML = "<span class='fa fa-unlock fa-3x'></span>"
        + "<br>" + this.translate('');
    receiveButtonDiv.addEventListener("click", () => {
      this.toggleReceiveMenu();
      this.sendSocketNotification("GET_CARGO");
      this.sendSocketNotification("assert");
      
    });

    return receiveButtonDiv;
  },
  
  createGetButton: function () {
    const getButtonItem = document.createElement("li");
    getButtonItem.innerHTML = "<span class='fa fa-check fa-3x'></span>"
        + "<br>" + this.translate('Confirm & Exit');
    getButtonItem.className = "li-t";
    getButtonItem.addEventListener("click", () => {
      this.config.Openpage = false;
      this.sendSocketNotification("CLOSE_LOCK", false);
      this.sendSocketNotification("assert");
      
      this.toggleReceiveMenu();
    });

    return getButtonItem;
  },
  
   createReceiveHeader: function () {
    var header = document.createElement("li");
    header.innerText = "Cargo Retrieval";
    header.style.fontSize = "75pt";
    header.style.lineHeight = "75pt";

    return header;
  },

  createReceiveText: function () {
    var text = document.createElement("li");
    text.innerText = "Please place your finger on the fingerprint sensor\n to retrive your cargo";
    text.style.fontSize = "40pt";
    text.style.lineHeight = "40pt";
   

    return text;

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
    
    menuToggleButtonDiv.innerHTML = "<span class='fa fa-truck fa-3x'></span>"
        + "<br>" + this.translate('');
    menuToggleButtonDiv.className = "st-container__menu-toggle";

    menuToggleButtonDiv.addEventListener("click", () => {
      Openpage = true;
      this.toggleSideMenu();
      this.sendSocketNotification("INPUT_TASK");
      this.sendSocketNotification("assert");
      });

    //return menuToggleButtonItem;
    return menuToggleButtonDiv;
  },

 
  
   createConfirmButton: function () {
    const confrimButtonItem = document.createElement("li");
    confrimButtonItem.innerHTML = "<span class='fa fa-check fa-3x'></span>"
        + "<br>" + this.translate('Confirm & Exit');
    confrimButtonItem.className = "li-t";
    confrimButtonItem.addEventListener("click", () => {
      this.config.Openpage = false;
      this.sendSocketNotification("assert");
      this.sendSocketNotification("CLOSE_LOCK", true);
      
      this.toggleSideMenu();
    });

    return confrimButtonItem;
  },
  


  createIFrame: function () {
    iframe = document.createElement("IFRAME");
    iframe.width = "99.5%";
    iframe.height = "950px"; // 630px for 13 inch
    iframe.scrolling = "no";
    iframe.src = this.config.url; 
    
    return iframe;
  },
  
  
  createReceiveMenuDiv: function () {
    const mainMenuDiv = document.createElement("div");
    mainMenuDiv.className = "st-container__receivemain-menu";
    mainMenuDiv.id = "st-receivemain-menu";
    
    
    const ReceiveHeader = this.createReceiveHeader();
    const ReceiveText = this.createReceiveText();
    const GetButton = this.createGetButton();
    
    const buttonList = document.createElement("ul");
    buttonList.appendChild(ReceiveHeader);
    buttonList.appendChild(ReceiveText);
    buttonList.appendChild(GetButton);
    
    mainMenuDiv.appendChild(buttonList);

    
    return mainMenuDiv;
  },
  
  
  createMainMenuDiv: function () {
    const mainMenuDiv = document.createElement("div");
    mainMenuDiv.className = "st-container__main-menu";
    mainMenuDiv.id = "st-main-menu";
    
    // const closeButton = this.createCloseButton();
    iFrame = this.createIFrame();
    const confirmButton = this.createConfirmButton();
    

    const buttonList = document.createElement("ul");
    
    buttonList.appendChild(confirmButton);
    buttonList.appendChild(iFrame);
    
    
    mainMenuDiv.appendChild(buttonList);

    return mainMenuDiv;
  },

  getDom: function () {
    // Initial standby state
    document.body.className = "st-standby show";
    
    ///this.sendSocketNotification("deassert");

    const container = this.createContainerDiv();

    const ReceiveButton = this.createReceiveButtonDiv();
    container.appendChild(ReceiveButton);

    const menuToggleButton = this.createMenuToggleButtonDiv();
    container.appendChild(menuToggleButton);

    const mainMenu = this.createMainMenuDiv();
    document.body.appendChild(mainMenu);
    
    const receiveMenu = this.createReceiveMenuDiv();
    document.body.appendChild(receiveMenu);
    

    return container;
  },
  

  notificationReceived: function (notification, payload, sender) {
     switch(notification) {
        case "DOM_OBJECTS_CREATED":
          var timer = setInterval(()=>{
          this.sendSocketNotification("CARGO_START",0);
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
