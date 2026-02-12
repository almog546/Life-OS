require('dotenv').config();

import express, { json } from 'express';
const app = express();
import cors from 'cors';
import session from 'express-session';

app.set('trust proxy', 1); 

app.use(json());



app.use(cors({
  origin: [
    'https://life-os-phi-steel.vercel.app',
    'https://life-os-almog546s-projects.vercel.app'
  ],
  credentials: true
}));


const isLocal = process.env.NODE_ENV !== 'production';

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
