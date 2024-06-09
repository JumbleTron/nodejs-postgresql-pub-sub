import express from "express";
import pool, { pgBoss } from "./db.js";

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/produce-select', async (_,response) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
        'INSERT INTO job_queue (job_name, payload) VALUES ($1, $2) RETURNING id',
        ['new_job', JSON.stringify({})]
    );
    response.type('application/json');
    response.status(201);
    response.send({ id: res.rows[0].id });
    console.log('Job added with ID:', res.rows[0].id);
  } finally {
    client.release();
  }
})

app.get('/produce', async (_,response) => {
  const boss = pgBoss
  try {
    await boss.start();
    const jobId = await boss.send('example-queue', { exampleData: 'exampleValue' });
    response.type('application/json');
    response.status(201);
    response.send({ id: jobId });
    console.log(`Job added with ID: ${jobId}`);
  } catch (err) {
    console.error('Error produce message:', err);
  } finally {
    await boss.stop();
  }
})

app.get('/status', (req, res) => {
  res.send({ "status": "up"})
})


app.use((_, res) => {
  res.type('application/json');
  res.status(404);
  res.send({ error: 'Not found' });
});

const server = app.listen(PORT, () => {
  console.log(`Starting Express server on http://localhost:${PORT}`)
});

server.on('close', () => {
  console.log('Express server closed');
})

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  cleanupAndExit();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  cleanupAndExit();
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  cleanupAndExit();
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received');
  cleanupAndExit();
});

const cleanupAndExit = () => {
  pool.end(() => {
    console.log('Closed pool connections');
    process.exit(1);
  });
}
