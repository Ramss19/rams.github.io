const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const mainWindow  = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  mainWindow .loadFile('index.html');

}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Manejar mensajes desde el renderer
ipcMain.on('start-robot', (event) => {
    console.log('Iniciando conexión con el robot...');
    const robotIP = '192.168.1.196'; // Cambia esto por la IP real de tu robot

    // Ejecuta un script de Python para conectar al robot
    const pythonCommand = `python connect_robot.py ${robotIP}`;
    exec(pythonCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al conectar con el robot: ${error.message}`);
            event.reply('robot-connection-status', 'Error al conectar con el robot');
            return;
        }
        console.log(`Salida del script: ${stdout}`);
        event.reply('robot-connection-status', 'Robot conectado exitosamente');
    });
});

ipcMain.on('stop-robot', (event) => {
    console.log('Robot detenido');
    // Aquí puedes conectar lógica para detener el robot
  });
  
ipcMain.on('update-cube-position', (event, data) => {
    console.log('Datos recibidos:', data);
    // Procesar los datos de posición (cubo, x, y) y enviar al robot
  });