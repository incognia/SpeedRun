const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'review', 'done', 'blocked'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  startDate: Date,
  endDate: Date,
  dueDate: Date,
  completedDate: Date,
  estimatedHours: Number,
  actualHours: Number,
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  subtasks: [{
    title: String,
    completed: {
      type: Boolean,
      default: false
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    filename: String,
    url: String,
    type: String,
    size: Number,
    uploaded_at: {
      type: Date,
      default: Date.now
    }
  }],
  ganttPosition: {
    x: Number,
    y: Number,
    width: Number,
    height: Number
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

TaskSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  
  // Actualizar completedDate automáticamente
  if (this.status === 'done' && !this.completedDate) {
    this.completedDate = new Date();
  } else if (this.status !== 'done') {
    this.completedDate = null;
  }
  
  next();
});

// Índices para mejorar performance
TaskSchema.index({ project: 1, status: 1 });
TaskSchema.index({ assignee: 1, status: 1 });
TaskSchema.index({ creator: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ tags: 1 });

module.exports = mongoose.model('Task', TaskSchema);
