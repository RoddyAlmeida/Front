# Todo Pro

Aplicación web para la gestión de tareas y usuarios, con soporte para roles de usuario y administrador.

## Descripción general

Todo Pro es una aplicación web moderna desarrollada con React y Vite, que permite a los usuarios gestionar tareas y a los administradores gestionar usuarios y visualizar estadísticas. El sistema implementa autenticación basada en JWT y control de acceso por roles.

## Características principales

- Autenticación de usuarios: registro e inicio de sesión con JWT.
- Gestión de tareas: crear, editar, eliminar y asignar tareas. Los administradores pueden asignar tareas a cualquier usuario.
- Gestión de usuarios: solo los administradores pueden ver, crear, editar y eliminar usuarios.
- Roles: existen dos roles principales, admin y usuario. El rol admin tiene acceso a la gestión de usuarios y al dashboard.
- Dashboard: estadísticas de tareas y usuarios (solo para administradores).
- Perfil de usuario: cada usuario puede ver y editar su perfil.
- Interfaz moderna: estilos con styled-components y diseño responsivo.
- Protección de rutas: acceso restringido a rutas según autenticación y rol.
- Manejo de errores y validaciones en formularios.

## Estructura del proyecto

```
todo-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── UserContext.jsx
│   │   ├── UserContext.js
│   │   └── useUser.js
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── TasksPage.jsx
│   │   └── UsersPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## Instalación

1. Clona el repositorio:
   ```
   git clone <url-del-repo>
   cd todo-frontend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Configura la URL base de la API en `src/services/api.js` si es necesario.

4. Inicia la aplicación:
   ```
   npm run dev
   ```

## Uso

- Accede a la aplicación en `http://localhost:5173` (o el puerto que indique Vite).
- Regístrate o inicia sesión.
- Si eres administrador, tendrás acceso a la gestión de usuarios y al dashboard.
- Los usuarios normales solo pueden gestionar sus propias tareas y editar su perfil.

## Flujo de autenticación y roles

- El usuario puede registrarse o iniciar sesión.
- Al iniciar sesión, se almacena el token JWT y los datos del usuario en localStorage.
- El contexto global de usuario (`UserContext`) gestiona el estado de autenticación y provee funciones para login y logout.
- Las rutas están protegidas: si no hay token, se redirige automáticamente a la pantalla de login.
- El navbar muestra enlaces y opciones según el rol del usuario.

## Manejo de errores y validaciones

- Todos los formularios (login, registro, tareas, usuarios) incluyen validaciones de campos requeridos y formato (por ejemplo, email válido, contraseñas coincidentes, mínimo de caracteres).
- Los errores de la API se muestran al usuario de forma clara.
- El sistema utiliza mensajes de error y éxito para mejorar la experiencia de usuario.

## Ejemplo de estructura de la API esperada

- Autenticación:
  - `POST /login` — Devuelve `{ token }` y datos del usuario.
  - `POST /register` — Registra un nuevo usuario.
  - `GET /me` — Devuelve los datos del usuario autenticado.
- Usuarios:
  - `GET /users` — Lista de usuarios (solo admin).
  - `POST /users` — Crear usuario (solo admin).
  - `PUT /users/:id` — Editar usuario (solo admin o el propio usuario).
  - `DELETE /users/:id` — Eliminar usuario (solo admin).
- Tareas:
  - `GET /tasks` — Lista de tareas.
  - `POST /tasks` — Crear tarea.
  - `PUT /tasks/:id` — Editar tarea.
  - `DELETE /tasks/:id` — Eliminar tarea.

## Buenas prácticas implementadas

- Uso de React Context para el manejo global de usuario y autenticación.
- Separación de componentes y páginas para mayor mantenibilidad.
- Uso de hooks personalizados (`useUser`) para acceder al contexto de usuario.
- Estilos desacoplados mediante styled-components.
- Código modular y reutilizable.
- Manejo centralizado del token JWT en las peticiones HTTP usando interceptores de Axios.
- Confirmaciones para acciones destructivas (eliminar usuario/tarea).
- Mensajes de feedback visual para acciones exitosas o fallidas.

## Dependencias principales

- React
- react-router-dom
- styled-components
- axios
- Vite

## Personalización

- Puedes modificar los estilos en los componentes de `src/components/` y las páginas en `src/pages/`.
- Para cambiar la URL de la API, edita `src/services/api.js`.

## Licencia

Este proyecto se distribuye bajo la licencia MIT.
