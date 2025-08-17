import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

import locationRouter from './routes/location';
import historyRouter from './routes/history';
import damageRouter from './routes/damage';
import ediRouter from './routes/edi';
import customsRouter from './routes/customs';
import tasksRouter from './routes/tasks';
import appointmentsRouter from './routes/appointments';

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.use('/api/location', locationRouter);
app.use('/api/history', historyRouter);
app.use('/api/damage', damageRouter);
app.use('/api/edi', ediRouter);
app.use('/api/customs', customsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/appointments', appointmentsRouter);

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
