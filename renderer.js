// Inicializar cuando la ventana cargue
window.onload = () => {
    // Elementos HTML
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    const cubeIdInput = document.getElementById('cube-id');
    const positionXInput = document.getElementById('position-x');
    const positionYInput = document.getElementById('position-y');
    const updateButton = document.getElementById('update');
    const movementDesc = document.getElementById('movement-desc');
    const videoElement = document.getElementById('camera-stream');
  
    // Enumerar dispositivos y buscar DroidCam
    navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const droidCamDevice = videoDevices.find(device => device.label.includes('DroidCam'));

      if (droidCamDevice) {
        // Acceder al feed de DroidCam
        navigator.mediaDevices.getUserMedia({
          video: { deviceId: droidCamDevice.deviceId }
        })
        .then((stream) => {
          videoElement.srcObject = stream;
          videoElement.play();
          console.log('Cámara DroidCam conectada');
        })
        .catch((err) => {
          console.error('Error al acceder a DroidCam:', err);
        });
      } else {
        console.error('DroidCam no encontrada');
      }
    })
    .catch((err) => {
      console.error('Error al enumerar dispositivos:', err);
    });
      
    // Botón Start
    document.getElementById('start').addEventListener('click', () => {
        console.log('Conectando al robot...');
        window.electronAPI.sendStart(); // Llama al evento 'start-robot'
    
        // Escuchar el estado de la conexión
        window.electronAPI.onRobotConnectionStatus((status) => {
            document.getElementById('movement-desc').innerText = status;
            console.log(status);
        });
    });
  
    // Botón Stop
    stopButton.addEventListener('click', () => {
      window.electronAPI.sendStop(); // Llama a la función expuesta en preload.js
      movementDesc.innerText = 'Robot detenido';
    });
  
    // Actualizar posición de cubos
    updateButton.addEventListener('click', () => {
      const cubeId = cubeIdInput.value;
      const positionX = parseFloat(positionXInput.value);
      const positionY = parseFloat(positionYInput.value);
  
      if (!cubeId || isNaN(positionX) || isNaN(positionY)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
      }
  
      // Enviar datos al backend
      window.electronAPI.updateCubePosition({
        cube: cubeId,
        positionX,
        positionY
      });
  
      movementDesc.innerText = `Moviendo ${cubeId} a X=${positionX}, Y=${positionY}`;
    });
  
    // Escuchar el estado del robot desde el backend
    window.electronAPI.onRobotStatus((status) => {
      console.log('Estado del robot:', status);
      movementDesc.innerText = `Estado: ${status}`;
    });

    document.getElementById('update').addEventListener('click', () => {
        const cubeId = document.getElementById('cube-id').value;
        const positionX = parseFloat(document.getElementById('position-x').value);
        const positionY = parseFloat(document.getElementById('position-y').value);
      
        if (!cubeId || isNaN(positionX) || isNaN(positionY)) {
          alert('Por favor, completa todos los campos correctamente.');
          return;
        }
      
        // Enviar datos al backend
        window.electronAPI.updateCubePosition({
          cube: cubeId,
          positionX,
          positionY
        });
      
        // Actualizar las posiciones de los cubos en la interfaz
        const positionElement = document.getElementById(`${cubeId.toLowerCase()}-position`);
        if (positionElement) {
          positionElement.innerText = `x: ${positionX}, y: ${positionY}`;
        } else {
          console.error('Cubo no encontrado:', cubeId);
        }
      });
  };