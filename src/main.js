// Module to control application life.
import app from "app";
// Module to create native browser window.
import BrowserWindow from "browser-window";
// Report crashes to our server.
import crashReporter from "crash-reporter";
crashReporter.start();

import moment from "moment";
import $ from "jquery";
import ipc from "ipc";

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

var menubar = require("menubar");
var mb = menubar({"icon": "src/images/#eeeeee.png"});
mb.on("ready", () => {
    ipc.on('asynchronous-message', function(event, arg) {
      let src = "src/images/"+arg.substr(1).substr(0, (arg.length -2))+".png";
      mb.tray.setImage(src);
      // mb.tray.setImage("src/images/"+arg+".png")
    });
});
