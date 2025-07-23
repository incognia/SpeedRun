const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GitLabStrategy = require('passport-gitlab2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Serialización del usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Estrategia GitHub OAuth
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Buscar usuario existente por GitHub ID
    let user = await User.findOne({ githubId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Buscar usuario por email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Vincular cuenta GitHub existente
      user.githubId = profile.id;
      await user.save();
      return done(null, user);
    }
    
    // Crear nuevo usuario
    const hashedPassword = await bcrypt.hash(Math.random().toString(36), 10);
    
    user = await User.create({
      username: profile.username || profile.displayName,
      email: profile.emails[0].value,
      password: hashedPassword,
      githubId: profile.id
    });
    
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

// Estrategia GitLab OAuth
passport.use(new GitLabStrategy({
  clientID: process.env.GITLAB_CLIENT_ID,
  clientSecret: process.env.GITLAB_CLIENT_SECRET,
  callbackURL: process.env.GITLAB_CALLBACK_URL,
  gitlabURL: process.env.GITLAB_URL || 'https://gitlab.com'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Buscar usuario existente por GitLab ID
    let user = await User.findOne({ gitlabId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Buscar usuario por email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Vincular cuenta GitLab existente
      user.gitlabId = profile.id;
      await user.save();
      return done(null, user);
    }
    
    // Crear nuevo usuario
    const hashedPassword = await bcrypt.hash(Math.random().toString(36), 10);
    
    user = await User.create({
      username: profile.username || profile.displayName,
      email: profile.emails[0].value,
      password: hashedPassword,
      gitlabId: profile.id
    });
    
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

// Estrategia JWT
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    
    if (user) {
      return done(null, user);
    }
    
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;
