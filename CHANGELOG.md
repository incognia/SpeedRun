# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere al [Versionado Semántico](https://semver.org/lang/es/).

## [No Publicado]

### Próximas funcionalidades
- OAuth completo con GitHub y GitLab
- Gestión completa de proyectos y tareas
- Diagramas Gantt con Mermaid
- Sistema de comentarios y notificaciones
- Integración con repositorios Git

## [0.1.0] - 2025-01-23

### Agregado
- Configuración inicial del proyecto con Next.js 14 y Express
- Modelos de datos para Usuario, Proyecto y Tarea con MongoDB/Mongoose
- Sistema de autenticación básico con JWT
- Rutas API completas para gestión de proyectos, tareas y usuarios
- Configuración de Passport.js para OAuth (GitHub y GitLab) - preparación
- Interfaz de usuario con Tailwind CSS y componentes reutilizables
- Página de login con botón de desarrollo temporal funcional
- Dashboard básico con información del usuario autenticado
- Configuración Docker para MongoDB con docker-compose
- Servidor mock para desarrollo sin dependencias externas
- Sistema de build y scripts de desarrollo optimizados
- Configuración TypeScript completa con paths absolutos
- Componentes de UI básicos (LoadingSpinner, ClientOnly)
- Provider de autenticación con React Context funcionando
- Manejo correcto de hidratación SSR/CSR
- Sistema de logging para debugging en desarrollo
- Documentación completa en README.md y CHANGELOG.md

### Configurado
- Estructura de carpetas siguiendo mejores prácticas de Next.js
- Variables de entorno para desarrollo y producción
- Scripts npm para diferentes modos de desarrollo
- Configuración de ESLint y TypeScript estricta
- Estilos globales con Tailwind CSS y clases utilitarias personalizadas
- Configuración de PostCSS y Autoprefixer
- Middleware CORS configurado para desarrollo
- Rutas de API proxy configuradas en Next.js
- Sistema de manejo de errores en frontend y backend

### Corregido
- Problemas de hidratación en componentes cliente
- Conflictos de puertos en modo desarrollo
- Errores de autenticación con tokens mock
- Problemas de CORS entre frontend y backend
- Manejo correcto de estados de carga

### Seguridad
- Configuración de headers de seguridad básicos
- Validación de tokens JWT en rutas protegidas
- Sanitización de datos de entrada en APIs mock
