# AutoFix App

Aplicación móvil para gestionar solicitudes de un taller mecánico.
Permitir registrarse, iniciar sesión y enviar solicitudes de
servicio para un vehículo.

## Tecnologías

- React Native con Expo
- TypeScript

## Instalación y ejecución

1. Instalar las dependencias:

```bash
npm install
```

2. Iniciar la app:

```bash
npx expo start
```

3. Abrir la app en el celular con la aplicación Expo Go, escaneando el código QR que aparece en el terminal.

## Estructura del proyecto

El código está organizado bajo el principio de separación de responsabilidades:

```text
autofix-app/
├── src/
│   ├── app/
│   │   └── index.tsx            # Navegación y estado central
│   ├── domain/
│   │   └── Solicitud.ts         # Datos de la solicitud automotriz
│   ├── infraestructura/
│   │   └── context/
│   │       ├── AuthContext.tsx          # Manejo de la sesión del usuario
│   │       └── SolicitudesContext.tsx   # Manejo de las solicitudes
│   ├── presentacion/
│   │   ├── componentes/         # Componentes reutilizables
│   │   │   ├── CustomButton.tsx # Botón táctil con variantes
│   │   │   └── CustomInput.tsx  # Campo de texto con labels y errores
│   │   └── vistas/              # Pantallas de la aplicación
│   │       ├── LoginScreen.tsx          # Inicio de sesión
│   │       ├── HomeScreen.tsx           # Pantalla principal
│   │       ├── RegisterScreen.tsx       # Formulario de solicitud
│   │       └── RegisterUserScreen.tsx   # Registro de usuario
│   ├── shared/
│   │   └── theme.ts             # Estilos y tema compartidos
│   └── global.css
└── README.md                    # Documentación
```

## Equipo

- Saavedra Quispe, Alexander
- Acosta Palacios, Adrian
- Vasquez Aquino, Jeiser
- Palacios Quinde, Karin

## Institución

IDAT - Desarrollo de Sistemas Front-End y Back-End
