var app = require("app");
var BrowserWindow = require("browser-window");
var Tray = require("tray");
var Menu = require("menu");
var moment = require("moment");
require("crash-reporter").start();

var mainWindow = null;
var tray = null;
app.on("window-all-closed", function() {
  if (process.platform != "darwin") {
    app.quit();
  }
});

var ipc = require("ipc");
app.on("ready", function() {
  app.dock.hide();
  function createWindow() {
    mainWindow = new BrowserWindow({width: 800, height: 600, frame: false});
    mainWindow.loadUrl("file://" + __dirname + "/index.html");
    mainWindow.on("closed", function () {
      mainWindow = null;
    });
    mainWindow.on("blur", function () {
      if (mainWindow != null) {
        mainWindow.hide();
      }
    })
  }
  createWindow();
  mainWindow.hide();

  tray = new Tray(__dirname + "/images/#eeeeee.png");
  function createContextMenu(newLabel) {
    return Menu.buildFromTemplate([
      {
        label: newLabel,
        enabled: false
      },
      {
        label: "GitHub Garden v" + app.getVersion(),
        enabled: false
      },
      {
        label: "Preference",
        click: function () {
          if (mainWindow == null) {
            createWindow()
          } else {
            mainWindow.show();
          }
        }
      },
      {
        label: "Quit",
        click: function () {
          app.quit();
        }
      }
    ]);
  }
  tray.setContextMenu(createContextMenu("Fetching"));

  ipc.on("asynchronous-message", function (event, arg) {
    var color = arg === null ? "#eeeeee" : arg;
    var src = __dirname + "/images/" + color + ".png";
    tray.setImage(src);
    tray.setPressedImage(src);
    var lastUpdatedAt = new Date().getTime();
    var newLabel = "Last updated at " + moment(lastUpdatedAt).format('HH:mm:ss');
    if (tray.menu.items[0].label !== newLabel) {
      tray.setContextMenu(createContextMenu(newLabel))
    }
  });
  ipc.on("asynchronous-message2", function (event, arg) {
    if (mainWindow == null) {
      createWindow()
    } else {
      mainWindow.show();
    }
  });
});
