import express from 'express';
import trackRoutes from './api/routes/track.routes.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('API is running correctly');
});

app.use('/api/tracks', trackRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
