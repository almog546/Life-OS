require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');

app.set('trust proxy', 1); 

app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true
}));



const isProduction = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.SESSION_SECRET || 'dev-secret';

app.use(
  session({
    name: 'sid',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
    },
  })
);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/areas', require('./routes/areaRoutes'));
app.use('/api/focus', require('./routes/focusRoutes'));
app.use('/api/timelogs', require('./routes/timeLogRoutes'));

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
