// Module to control application life.
import app from "app";
// Module to create native browser window.
import BrowserWindow from "browser-window";
// Report crashes to our server.
import crashReporter from "crash-reporter";
crashReporter.start();

import moment from "moment";
import $ from "jquery";
// var Canvas = require('canvas')
//   , Image = Canvas.Image
//   , canvas = new Canvas(200, 200)
//   , ctx = canvas.getContext('2d');
import ipc from "ipc"

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow = null;

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

var menubar = require("menubar");
var mb = menubar({"icon": "src/images/#eeeeee.png"});
mb.on("ready", () => {
    ipc.on('asynchronous-message', function(event, arg) {
      console.log(mb)
      console.log(mb.tray)
      let src = "src/images/"+arg.substr(1).substr(0, (arg.length -2))+".png"
      console.log(src)
      mb.tray.setImage(src)
      // mb.tray.setImage("src/images/"+arg+".png")
      console.log(arg)
    });
    // mb.tray.setImage("src/images/"+color+".png")
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on("ready", () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600});

    // and load the index.html of the app.
    mainWindow.loadUrl(`file://${__dirname}/index.html`);
    // mainWindow.loadUrl(`https://github.com/skohar`);

    // Open the devtools.
    if (process.env.NODE_ENV !== "production") {
        mainWindow.openDevTools();
    }

    // Emitted when the window is closed.
    mainWindow.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});
