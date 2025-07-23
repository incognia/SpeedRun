const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Generar JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Ruta de autenticación con GitHub
router.get('/github', 
  passport.authenticate('github', { scope: ['user:email'] })
);

// Callback de GitHub
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: process.env.NEXT_PUBLIC_ERROR_REDIRECT }),
  (req, res) => {
    const token = generateToken(req.user);
    
    // Redirigir al frontend con el token
    res.redirect(`${process.env.NEXT_PUBLIC_SUCCESS_REDIRECT}?token=${token}`);
  }
);

// Ruta de autenticación con GitLab
router.get('/gitlab',
  passport.authenticate('gitlab', { scope: ['read_user'] })
);

// Callback de GitLab
router.get('/gitlab/callback',
  passport.authenticate('gitlab', { failureRedirect: process.env.NEXT_PUBLIC_ERROR_REDIRECT }),
  (req, res) => {
    const token = generateToken(req.user);
    
    // Redirigir al frontend con el token
    res.redirect(`${process.env.NEXT_PUBLIC_SUCCESS_REDIRECT}?token=${token}`);
  }
);

// Verificar token JWT
router.get('/verify', 
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        githubId: req.user.githubId,
        gitlabId: req.user.gitlabId
      }
    });
  }
);

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
    res.json({ message: 'Sesión cerrada exitosamente' });
  });
});

// Obtener información del usuario actual
router.get('/me',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      githubId: req.user.githubId,
      gitlabId: req.user.gitlabId,
      created_at: req.user.created_at
    });
  }
);

module.exports = router;
