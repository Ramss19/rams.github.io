const { contextBridge, ipcRenderer } = require('electron');

// Exponer funciones específicas al frontend
contextBridge.exposeInMainWorld('electronAPI', {
  sendStart: () => ipcRenderer.send('start-robot'), // Enviar evento para conectar al robot
  sendStop: () => ipcRenderer.send('stop-robot'),  // Envía el evento para detener el robot
  updateCubePosition: (data) => ipcRenderer.send('update-cube-position', data), // Envía datos del cubo
  onRobotStatus: (callback) => ipcRenderer.on('robot-status', (event, status) => callback(status)), // Escucha actualizaciones del backend
  onRobotConnectionStatus: (callback) => ipcRenderer.on('robot-connection-status', (event, status) => callback(status))
});