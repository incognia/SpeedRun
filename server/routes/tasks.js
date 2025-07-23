const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const Project = require('../models/Project');
const router = express.Router();

// Middleware de autenticación
const authenticate = passport.authenticate('jwt', { session: false });

// Obtener todas las tareas del usuario
router.get('/', authenticate, async (req, res) => {
  try {
    const { projectId, status, assignee, priority } = req.query;
    
    // Construir filtros
    let filters = {
      $or: [
        { assignee: req.user._id },
        { creator: req.user._id }
      ]
    };

    if (projectId) filters.project = projectId;
    if (status) filters.status = status;
    if (assignee) filters.assignee = assignee;
    if (priority) filters.priority = priority;

    const tasks = await Task.find(filters)
      .populate('project', 'name')
      .populate('assignee', 'username email')
      .populate('creator', 'username email')
      .populate('dependencies', 'title status')
      .sort({ created_at: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas', error: error.message });
  }
});

// Obtener una tarea específica
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name owner members')
      .populate('assignee', 'username email')
      .populate('creator', 'username email')
      .populate('dependencies', 'title status project')
      .populate('comments.author', 'username email');

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Verificar permisos (debe ser asignado, creador o miembro del proyecto)
    const hasAccess = task.assignee?._id.equals(req.user._id) ||
                     task.creator._id.equals(req.user._id) ||
                     task.project.owner.equals(req.user._id) ||
                     task.project.members.includes(req.user._id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'No tienes acceso a esta tarea' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tarea', error: error.message });
  }
});

// Crear nueva tarea
router.post('/', authenticate, async (req, res) => {
  try {
    // Verificar que el proyecto existe y el usuario tiene acceso
    const project = await Project.findById(req.body.project);
    
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const hasProjectAccess = project.owner.equals(req.user._id) ||
                           project.members.includes(req.user._id);

    if (!hasProjectAccess) {
      return res.status(403).json({ message: 'No tienes acceso a este proyecto' });
    }

    const taskData = {
      ...req.body,
      creator: req.user._id
    };

    const task = await Task.create(taskData);
    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignee', 'username email')
      .populate('creator', 'username email')
      .populate('dependencies', 'title status');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear tarea', error: error.message });
  }
});

// Actualizar tarea
router.put('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Verificar permisos
    const hasAccess = task.creator.equals(req.user._id) ||
                     task.assignee?.equals(req.user._id) ||
                     task.project.owner.equals(req.user._id) ||
                     task.project.members.includes(req.user._id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'No tienes permisos para actualizar esta tarea' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('project', 'name')
    .populate('assignee', 'username email')
    .populate('creator', 'username email')
    .populate('dependencies', 'title status');

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar tarea', error: error.message });
  }
});

// Eliminar tarea
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Verificar permisos (solo creador o owner del proyecto pueden eliminar)
    const canDelete = task.creator.equals(req.user._id) ||
                     task.project.owner.equals(req.user._id);

    if (!canDelete) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar esta tarea' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarea', error: error.message });
  }
});

// Agregar comentario a tarea
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Verificar permisos
    const hasAccess = task.creator.equals(req.user._id) ||
                     task.assignee?.equals(req.user._id) ||
                     task.project.owner.equals(req.user._id) ||
                     task.project.members.includes(req.user._id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'No tienes acceso a esta tarea' });
    }

    task.comments.push({
      author: req.user._id,
      content
    });

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('comments.author', 'username email');

    res.json(updatedTask.comments);
  } catch (error) {
    res.status(400).json({ message: 'Error al agregar comentario', error: error.message });
  }
});

// Agregar subtarea
router.post('/:id/subtasks', authenticate, async (req, res) => {
  try {
    const { title } = req.body;
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Verificar permisos
    const hasAccess = task.creator.equals(req.user._id) ||
                     task.assignee?.equals(req.user._id) ||
                     task.project.owner.equals(req.user._id) ||
                     task.project.members.includes(req.user._id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'No tienes acceso a esta tarea' });
    }

    task.subtasks.push({ title });
    await task.save();

    res.json(task.subtasks);
  } catch (error) {
    res.status(400).json({ message: 'Error al agregar subtarea', error: error.message });
  }
});

// Actualizar subtarea
router.put('/:id/subtasks/:subtaskId', authenticate, async (req, res) => {
  try {
    const { completed } = req.body;
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Verificar permisos
    const hasAccess = task.creator.equals(req.user._id) ||
                     task.assignee?.equals(req.user._id) ||
                     task.project.owner.equals(req.user._id) ||
                     task.project.members.includes(req.user._id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'No tienes acceso a esta tarea' });
    }

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({ message: 'Subtarea no encontrada' });
    }

    subtask.completed = completed;
    await task.save();

    res.json(task.subtasks);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar subtarea', error: error.message });
  }
});

// Obtener estadísticas de tareas
router.get('/stats/overview', authenticate, async (req, res) => {
  try {
    const { projectId } = req.query;
    
    let matchFilter = {
      $or: [
        { assignee: req.user._id },
        { creator: req.user._id }
      ]
    };

    if (projectId) {
      matchFilter.project = mongoose.Types.ObjectId(projectId);
    }

    const stats = await Task.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Task.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ statusStats: stats, priorityStats });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
});

module.exports = router;
