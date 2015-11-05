var app = require("app");
var BrowserWindow = require("browser-window");
var Tray = require("tray");
var Menu = require("menu");
require("crash-reporter").start();

var mainWindow = null;
var tray = null;
app.on("window-all-closed", function() {
  if (process.platform != "darwin") {
    app.quit();
  }
});

var menubar = require("menubar");
var ipc = require("ipc");
app.on("ready", function() {
  function createWindow() {
    mainWindow = new BrowserWindow({width: 800, height: 600, frame: false});
    mainWindow.loadUrl("file://" + __dirname + "/index.html");
    mainWindow.on("closed", function () {
      mainWindow = null;
    });
  }
  createWindow();

  tray = new Tray(__dirname + "/images/#eeeeee.png");
  function clicked() {
    if (mainWindow != null && mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      if(mainWindow == null) {
        createWindow()
      } else {
        mainWindow.show();
      }
    }
  }
  tray.on("clicked", clicked);
  ipc.on("asynchronous-message", function (event, arg) {
    var color = arg === null ? "#eeeeee" : arg;
    var src = __dirname + "/images/" + color + ".png";
    tray.setImage(src);
    tray.setPressedImage(src);
  });
});
