import express from 'express';
import crypto from 'crypto';

const generateId = () => parseInt(crypto.randomBytes(4).toString('hex'), 16);

let users = [];

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log('http://localhost:3000');
});

app.get('/users', (_req, res) => {
  return res.status(200).json(users);
});

app.get('/users/:id', (req, res) => {
  const id = req.params.id;

  const foundUser = users.find((user) => {
    return user.id.toString() === id;
  });

  if (foundUser === undefined) {
    return res.status(404).send();
  }

  return res.status(200).json(foundUser);
});

app.post('/users', (req, res) => {
  const body = req.body;

  if (typeof body.nome !== 'string' || typeof body.idade !== 'number' || typeof body.alturaCm !== 'number') {
    return res.status(400).send('Invalid format');
  }

  const user = {
    id: generateId(),
    nome: body.nome,
    idade: body.idade,
    alturaCm: body.alturaCm
  };

  users.push(user);

  return res.status(204).send();
});

app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;

  if (body.nome && typeof body.nome !== 'string') {
    return res.status(400).send('Invalid nome');
  }

  if (body.idade && typeof body.idade !== 'number') {
    return res.status(400).send('Invalid idade');
  }

  if (body.alturaCm && typeof body.alturaCm !== 'number') {
    return res.status(400).send('Invalid alturaCm');
  }
  
  const foundUser = users.find((user) => user.id.toString() === id);
  if (!foundUser) return res.status(404).send();

  if (body.nome) foundUser.nome = body.nome;
  if (body.idade) foundUser.idade = body.idade;
  if (body.alturaCm) foundUser.alturaCm = body.alturaCm;

  return res.status(200).send();
});

app.delete('/users/:id', (req, res) => {
  const id = req.params.id;

  const foundUser = users.find((user) => user.id.toString() === id);
  if (!foundUser) return res.status(404).send();

  users = users.filter((user) => user.id !== foundUser.id);
  return res.status(200).send();
});
