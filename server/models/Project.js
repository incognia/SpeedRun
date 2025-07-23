const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  deadline: Date,
  ganttData: {
    type: String, // JSON string con datos del diagrama Gantt
    default: null
  },
  mermaidDiagram: {
    type: String, // Código Mermaid para el diagrama
    default: null
  },
  markdownNotes: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

ProjectSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Índices para mejorar performance
ProjectSchema.index({ owner: 1, status: 1 });
ProjectSchema.index({ members: 1 });
ProjectSchema.index({ tags: 1 });

module.exports = mongoose.model('Project', ProjectSchema);
