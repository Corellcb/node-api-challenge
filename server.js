const express = require('express');
const projectsRouter = require('./data/projects/projectsRouter');
const actionsRouter = require('./data/actions/actionsRouter');

const server = express();

server.use(express.json());
server.use(logger);

server.use('/projects', projectsRouter);
server.use('/actions', actionsRouter);

function logger(req, res, next) {
    const date = new Date();
    console.log(`${req.method} request to ${req.originalUrl} at ${date}`);
    next();
}

module.exports = server;