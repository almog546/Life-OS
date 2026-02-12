require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');

app.set('trust proxy', 1);

app.use(express.json());

app.use(cors({
  origin: [
    'https://life-os-phi-steel.vercel.app',
    'https://life-os-almog546s-projects.vercel.app'
  ],
  credentials: true
}));

app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    },
  })
);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/areas', require('./routes/areaRoutes'));
app.use('/api/focus', require('./routes/focusRoutes'));
app.use('/api/timelogs', require('./routes/timeLogRoutes'));

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
