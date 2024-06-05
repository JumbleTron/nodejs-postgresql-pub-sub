import express from "express";

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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