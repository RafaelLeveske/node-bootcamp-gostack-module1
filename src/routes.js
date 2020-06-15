const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const routes = express.Router();

const projects = [];

//Middlewares
function logRequests(req, res, next) {
  const { method, url } = req;

  const logLabel = `[${method.toUpperCase()} ${url}]`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
};

function validateProjectId(req, res, next) {
  const { id } = req.params;

  if(!isUuid(id)) {
    return res.status(400).json({ error: "Project does not exist" })
  };

  return next();
};

routes.use(logRequests);
routes.use('/projects/:id', validateProjectId);

routes.get('/projects', (req, res) => {
  const { title } = req.query;

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

    return res.json(results);
});

routes.post('/projects', (req, res) => {
  const { title, owner } = req.body;

  projects.push({
    id: uuid(),
    title,
    owner
  });
  return res.json(projects);
});

routes.put('/projects/:id', (req, res) => {
  const { id } = req.params;
  const { title, owner } = req.body

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return res.status(400).json({ error: "Project not found" });
  };

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return res.json(project);
});

routes.delete('/projects/:id', (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return res.status(400).json({ error: "Project not found" });
  };

  projects.splice(projectIndex, 1);

  return res.status(204).send();
});

module.exports = routes;