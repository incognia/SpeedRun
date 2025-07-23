# SpeedRun Project Manager

Gestor de proyectos avanzado con cronogramas Gantt usando Mermaid y Markdown, desarrollado con Next.js, Express, MongoDB y autenticación OAuth.

## 🚀 Características

- **Gestión de Proyectos**: Crea, edita y organiza proyectos con equipos
- **Tareas Avanzadas**: Sistema completo de tareas con dependencias, subtareas y comentarios
- **Cronogramas Gantt**: Visualización con Mermaid integrado
- **Autenticación OAuth**: Login con GitHub y GitLab (en desarrollo)
- **Markdown Support**: Documentación rica con soporte completo de Markdown
- **Dashboard Intuitivo**: Interfaz moderna y responsiva con Tailwind CSS

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Passport.js
- **Autenticación**: JWT, OAuth (GitHub/GitLab)
- **Diagramas**: Mermaid.js
- **Base de Datos**: MongoDB con Mongoose

## 📦 Instalación

### Prerrequisitos

- Node.js 18+
- Docker (para MongoDB)
- Git

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/incognia/speedrun.git
   cd speedrun
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con tus configuraciones.

4. **Iniciar MongoDB con Docker**
   ```bash
   docker-compose up -d mongodb
   ```

5. **Ejecutar la aplicación**

   **Modo desarrollo con mock data:**
   ```bash
   npm run dev:mock
   ```
   
   **Modo desarrollo completo (requiere MongoDB):**
   ```bash
   npm run dev
   ```

6. **Acceder a la aplicación**
   - Frontend: http://localhost:3000
   - API: http://localhost:5000
   - MongoDB Admin: http://localhost:8081 (admin/admin123)

## 🔧 Scripts Disponibles

```bash
# Desarrollo con mock data (recomendado para empezar)
npm run dev:mock

# Desarrollo completo
npm run dev

# Solo frontend
npm run client:dev

# Solo backend
npm run server:dev

# Solo backend mock
npm run server:dev:mock

# Build para producción
npm run build

# Iniciar en producción
npm run start

# Linting
npm run lint

# Tests
npm run test
```

## 🏗️ Estructura del Proyecto

```
speedrun/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard principal
│   ├── login/             # Página de login
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes React
│   ├── providers/         # Context providers
│   └── ui/                # Componentes UI reutilizables
├── hooks/                 # Custom hooks
├── server/                # Backend Express
│   ├── config/            # Configuraciones
│   ├── models/            # Modelos MongoDB
│   ├── routes/            # Rutas API
│   ├── dev-server.js      # Servidor mock para desarrollo
│   └── index.js           # Servidor principal
├── docker-compose.yml     # Configuración Docker
├── next.config.js         # Configuración Next.js
├── tailwind.config.js     # Configuración Tailwind
└── package.json
```

## 🎯 Estado del Proyecto

### ✅ Funcional (v0.1.0)
- [x] Configuración base Next.js 14 + Express funcionando
- [x] Autenticación mock con JWT para desarrollo
- [x] Modelos de datos completos (Usuario, Proyecto, Tarea)
- [x] API REST mock con endpoints funcionales
- [x] Interfaz de login completamente funcional
- [x] Dashboard básico con información de usuario
- [x] Sistema de componentes con Tailwind CSS
- [x] Docker setup para MongoDB listo
- [x] Servidor de desarrollo mock sin dependencias
- [x] Sistema de build y deployment configurado
- [x] Manejo correcto de hidratación SSR/CSR
- [x] Provider de autenticación con React Context
- [x] Logging de debugging para desarrollo

### 🚧 En Desarrollo Inmediato
- [ ] OAuth completo con GitHub/GitLab
- [ ] Conexión real con MongoDB
- [ ] Gestión completa de proyectos (CRUD)
- [ ] Editor de tareas con dependencias
- [ ] Middleware de autenticación completo

### 📋 Roadmap v0.2.0
- [ ] Diagramas Gantt con Mermaid
- [ ] Sistema de comentarios en tareas
- [ ] Notificaciones en tiempo real
- [ ] Búsqueda y filtros avanzados
- [ ] Exportación a PDF

### 🔮 Futuro
- [ ] Integración con repositorios Git
- [ ] API webhooks
- [ ] Modo offline
- [ ] Aplicación móvil

## 🧪 Desarrollo

Para empezar a desarrollar:

1. **Usar el modo mock** para desarrollo rápido sin configurar OAuth ni MongoDB:
   ```bash
   npm run dev:mock
   ```

2. **Acceder a la aplicación** en http://localhost:3000

3. **Hacer login** con el botón "Iniciar Sesión (Desarrollo)"

4. **Ver el dashboard** funcionando con datos mock

## 🐳 Docker

El proyecto incluye configuración Docker para MongoDB:

```bash
# Iniciar solo MongoDB
docker-compose up -d mongodb

# Iniciar MongoDB + Mongo Express (UI)
docker-compose up -d

# Detener servicios
docker-compose down

# Ver logs
docker-compose logs -f
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Rodrigo Álvarez** (@incognia)
- GitHub: [@incognia](https://github.com/incognia)
- Email: incognia@gmail.com

---

⭐ ¡Dale una estrella si este proyecto te ayuda!
