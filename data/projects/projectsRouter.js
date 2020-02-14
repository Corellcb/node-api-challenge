const express = require('express');

const projects = require('../helpers/projectModel');
const actionsRouter = require('../actions/actionsRouter') // actions here

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    projects
        .get()
        .then(got => res.status(200).json(got))
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Ooops this is no good'});
        })
});

router.get('/:id', validateProjectId(), (req, res) => {
    const { id } = req.params;

    projects
        .get(id)
        .then(got => res.status(200).json(got))
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Ooops this is no good' });
        })
});

router.get('/:id/actions', (req, res) => {
    const { id } = req.params;

    projects
        .getProjectActions(id)
        .then(got => {
            if (got) {
                res.status(200).json(got)
            } else {
                res.status(400).json({ errorMessage: 'This ID does not exist.' })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Ooops this is no good' });
        })
});

router.post('/', validateProject(), (req, res) => {
    projects
        .insert(req.resource)
        .then(inserted => {
            if (inserted !== undefined) {
                res.status(200).json(inserted)
            } else {
                res.status(400).json({ errorMessage: 'The specified project does not exist.' })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Ooops this is no good' });
        })
});

router.put('/:id', validateProject(), validateProjectId(), (req, res) => {
    projects
        .update(req.params.id, req.body)
        .then(updated => {
            if (updated) {
                res.status(200).json(updated);
            } else {
                res.status(400).json({ errorMessage: 'The specified project does not exist.' })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Ooops this is no good' });
        })
});

router.delete('/:id', validateProjectId(), (req, res) => {
    projects
        .remove(req.params.id)
        .then(removed => {
            if (removed) {
                res.status(200).json({ message: 'Post removed.'});
            } else {
                res.status(400).json({ errorMessage: 'The specified project does not exist.' })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Ooops this is no good' });
        })
});

function validateProject() {
    return (req, res, next) => {
        const resource = {
            name: req.body.name,
            description: req.body.description
        }

        if (resource.name && resource.description) {
            req.resource = resource;
            next();
        } else {
            res.status(400).json({ errorMessage: 'Please provide name and description.'});
        }
    }
}

function validateProjectId() {
    return (req, res, next) => {
        projects.get(req.params.id).then(got => {
            if(got) {
                next();
            } else {
                res.status(400).json({ errorMessage: 'This ID does not exist.' })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Oopps'});
        })
    }
}

module.exports = router;