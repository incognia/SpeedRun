const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware básico
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

// Rutas básicas para desarrollo
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0-dev'
  });
});

// Mock de autenticación para desarrollo
app.get('/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  
  // Mock user para desarrollo
  res.json({
    success: true,
    user: {
      id: '507f1f77bcf86cd799439011',
      username: 'usuario-dev',
      email: 'dev@example.com',
      githubId: null,
      gitlabId: null
    }
  });
});

app.get('/auth/me', (req, res) => {
  res.json({
    id: '507f1f77bcf86cd799439011',
    username: 'usuario-dev',
    email: 'dev@example.com',
    githubId: null,
    gitlabId: null,
    created_at: new Date().toISOString()
  });
});

// Mock de proyectos
app.get('/api/projects', (req, res) => {
  res.json([
    {
      _id: '507f1f77bcf86cd799439012',
      name: 'Proyecto Demo',
      description: 'Un proyecto de ejemplo para desarrollo',
      status: 'active',
      priority: 'medium',
      owner: {
        _id: '507f1f77bcf86cd799439011',
        username: 'usuario-dev',
        email: 'dev@example.com'
      },
      members: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);
});

// Mock de tareas
app.get('/api/tasks', (req, res) => {
  res.json([
    {
      _id: '507f1f77bcf86cd799439013',
      title: 'Tarea de ejemplo',
      description: 'Una tarea de desarrollo',
      status: 'todo',
      priority: 'medium',
      creator: {
        _id: '507f1f77bcf86cd799439011',
        username: 'usuario-dev',
        email: 'dev@example.com'
      },
      project: {
        _id: '507f1f77bcf86cd799439012',
        name: 'Proyecto Demo'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Error del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de desarrollo ejecutándose en puerto ${PORT}`);
  console.log(`📊 Modo: desarrollo (sin MongoDB/OAuth)`);
});
