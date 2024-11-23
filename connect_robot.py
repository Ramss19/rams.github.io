import os
import sys
import time

sys.path.append(os.path.join(os.path.dirname(__file__), '../../..'))

from xarm.wrapper import XArmAPI

# Leer la IP del robot desde los argumentos
if len(sys.argv) < 2:
    print("Error: Por favor, proporciona la dirección IP del robot como argumento.")
    sys.exit(1)

robot_ip = sys.argv[1]  # La IP del robot es el primer argumento

# Conectar al brazo robótico|
arm = XArmAPI(robot_ip)
arm.connect()

if arm.connected:
    print("Conexión exitosa al robot uFactory xArm 6")

    # Configurar el brazo
    arm.motion_enable(enable=True)
    arm.set_mode(0)
    arm.set_state(0)
    print("El robot está listo para recibir comandos")
else:
    print("No se pudo conectar al robot")

# Mantener la conexión abierta o desconectar al terminar
# arm.disconnect()