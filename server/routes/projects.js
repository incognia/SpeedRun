const express = require('express');
const passport = require('passport');
const Project = require('../models/Project');
const Task = require('../models/Task');
const router = express.Router();

// Middleware de autenticación
const authenticate = passport.authenticate('jwt', { session: false });

// Obtener todos los proyectos del usuario
router.get('/', authenticate, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ]
    })
    .populate('owner', 'username email')
    .populate('members', 'username email')
    .sort({ updated_at: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proyectos', error: error.message });
  }
});

// Obtener un proyecto específico
router.get('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'username email')
      .populate('members', 'username email');

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Verificar permisos
    const hasAccess = project.owner._id.equals(req.user._id) || 
                     project.members.some(member => member._id.equals(req.user._id));

    if (!hasAccess) {
      return res.status(403).json({ message: 'No tienes acceso a este proyecto' });
    }

    // Obtener tareas del proyecto
    const tasks = await Task.find({ project: project._id })
      .populate('assignee', 'username email')
      .populate('creator', 'username email')
      .sort({ created_at: -1 });

    res.json({ ...project.toObject(), tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proyecto', error: error.message });
  }
});

// Crear nuevo proyecto
router.post('/', authenticate, async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      owner: req.user._id
    };

    const project = await Project.create(projectData);
    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'username email')
      .populate('members', 'username email');

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear proyecto', error: error.message });
  }
});

// Actualizar proyecto
router.put('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Verificar permisos (solo el owner puede actualizar)
    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'No tienes permisos para actualizar este proyecto' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('owner', 'username email')
    .populate('members', 'username email');

    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar proyecto', error: error.message });
  }
});

// Eliminar proyecto
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Verificar permisos (solo el owner puede eliminar)
    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar este proyecto' });
    }

    // Eliminar todas las tareas del proyecto
    await Task.deleteMany({ project: req.params.id });
    
    // Eliminar el proyecto
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar proyecto', error: error.message });
  }
});

// Agregar miembro al proyecto
router.post('/:id/members', authenticate, async (req, res) => {
  try {
    const { memberId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Verificar permisos (solo el owner puede agregar miembros)
    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'No tienes permisos para agregar miembros' });
    }

    // Verificar si el miembro ya existe
    if (project.members.includes(memberId)) {
      return res.status(400).json({ message: 'El usuario ya es miembro del proyecto' });
    }

    project.members.push(memberId);
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'username email')
      .populate('members', 'username email');

    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: 'Error al agregar miembro', error: error.message });
  }
});

// Remover miembro del proyecto
router.delete('/:id/members/:memberId', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Verificar permisos (solo el owner puede remover miembros)
    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'No tienes permisos para remover miembros' });
    }

    project.members = project.members.filter(
      member => !member.equals(req.params.memberId)
    );
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'username email')
      .populate('members', 'username email');

    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: 'Error al remover miembro', error: error.message });
  }
});

// Actualizar diagrama Gantt/Mermaid
router.put('/:id/diagram', authenticate, async (req, res) => {
  try {
    const { ganttData, mermaidDiagram } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Verificar permisos
    const hasAccess = project.owner.equals(req.user._id) || 
                     project.members.includes(req.user._id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'No tienes acceso a este proyecto' });
    }

    project.ganttData = ganttData;
    project.mermaidDiagram = mermaidDiagram;
    await project.save();

    res.json({ message: 'Diagrama actualizado exitosamente', project });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar diagrama', error: error.message });
  }
});

module.exports = router;
