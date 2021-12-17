// const fs = require('fs');
const { app, BrowserWindow } = require("electron");

function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    // transparent: true,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile("dist/index.html");
}

app.on("ready", createWindow);

//   function saveCallback(canvas, filePath) {
//     // Get the DataUrl from the Canvas
//     const url = canvas.toDataURL('image/jpg', 0.8);

//     // remove Base64 stuff from the Image
//     const base64Data = url.replace(/^data:image\/png;base64,/, "");
//     fs.writeFile(filePath, base64Data, 'base64', function (err) {
//         console.log(err);
//     });
// }

/*
const { app, BrowserWindow } = require('electron')

app.disableHardwareAcceleration()

let win

app.once('ready', () => {
  win = new BrowserWindow({
    webPreferences: {
      offscreen: true
    }
  })

  win.loadURL('http://github.com')
  win.webContents.on('paint', (event, dirty, image) => {
    // updateBitmap(dirty, image.getBitmap())
  })
  win.webContents.setFrameRate(30)
})Copy

*/
