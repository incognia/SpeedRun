const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Middleware de autenticación
const authenticate = passport.authenticate('jwt', { session: false });

// Buscar usuarios (para agregar a proyectos)
router.get('/search', authenticate, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Query debe tener al menos 2 caracteres' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    })
    .select('username email')
    .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar usuarios', error: error.message });
  }
});

// Obtener perfil de usuario específico
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('username email created_at');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
});

// Actualizar perfil del usuario actual
router.put('/me', authenticate, async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Verificar que el username/email no estén en uso por otro usuario
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: req.user._id } },
        { $or: [{ username }, { email }] }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'El username o email ya están en uso' 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true, runValidators: true }
    ).select('username email created_at updated_at');

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar perfil', error: error.message });
  }
});

module.exports = router;
