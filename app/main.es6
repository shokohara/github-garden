const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Tray = electron.Tray;
const Menu = electron.Menu;
const ipc = electron.ipcMain;
const moment = require("moment");

let mainWindow;
let tray;
app.on("window-all-closed", () => {
  if (process.platform != "darwin") {
    app.quit();
  }
});

app.on("ready", () => {
  app.dock.hide();
  function createWindow() {
    mainWindow = new BrowserWindow({width: 800, height: 600, frame: false});
    mainWindow.loadURL("file://" + __dirname + "/index.html");
    mainWindow.on("closed", () => {
      mainWindow = null;
    });
    mainWindow.on("blur", () => {
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
      }, {
        label: "GitHub Garden v" + app.getVersion(),
        enabled: false
      }, {
        label: "Preference",
        click: () => {
          if (mainWindow == null) {
            createWindow()
          } else {
            mainWindow.show();
          }
        }
      }, {
        label: "Quit",
        click: () => {
          app.quit();
        }
      }
    ]);
  }

  tray.setContextMenu(createContextMenu("Fetching"));

  ipc.on("tray.color", (event, arg) => {
    const color = arg === null ? "#eeeeee" : arg;
    const src = __dirname + "/images/" + color + ".png";
    tray.setImage(src);
    tray.setPressedImage(src);
    const lastUpdatedAt = new Date().getTime();
    const newLabel = "Last updated at " + moment(lastUpdatedAt).format('HH:mm:ss');
    if (tray.menu.items[0].label !== newLabel) {
      tray.setContextMenu(createContextMenu(newLabel))
    }
  });
  ipc.on("window", (event, arg) => {
    if (arg === "open") {
      if (mainWindow == null) {
        createWindow()
      } else {
        mainWindow.show();
      }
    } else if (arg === "close") {
      if (mainWindow != null) {
        mainWindow.hide();
      }
    }
  });
});
