const express = require('express');

const actions = require('../helpers/actionModel');
const projects = require('../helpers/projectModel');

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    actions
        .get()
        .then(got => res.status(200).json(got))
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'oops'});
        });
});

router.get('/:id', validateActionId(), (req, res) => {
    const {id} = req.params;

    actions
        .get(id)
        .then(got => res.status(200).json(got))
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'oops'});
        });
});

router.post('/', validateAction(), validateProjectId(), (req, res) => {
    actions
        .insert(req.resource)
        .then(inserted => res.status(201).json(inserted))
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'oops'});
        });
});

router.put('/:id', validateActionId(), validateAction(), (req, res) => {
    actions
        .update(req.params.id, req.resource)
        .then(updated => {
            if(updated) {
                res.status(200).json({ message: 'updated'})
            } else {
                res.status(400).json({ errorMessage: 'Specified action does not exist.'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'oops'});
        })
});

router.delete('/:id', validateActionId(), (req, res) => {
    actions
        .remove(req.params.id)
        .then(removed => {
            if(removed) {
                res.status(200).json({ message: 'ding dong the action\'s dead'})
            } else {
                res.status(404).json({ message: 'action could not be found'});
            }
        })
        .catch(err => {
        console.log(err);
        res.status(500).json({ errorMessage: 'oops'});
    })
})

function validateAction() {
    return (req, res, next) => {
        const resource = {
            project_id: req.body.project_id,
            description: req.body.description,
            notes: req.body.notes
        }

        if (resource.project_id && resource.description && resource.notes) {
            req.resource = resource;
            next();
        } else {
            res.status(400).json({ errorMessage: 'Please provide post ID, notes, and description.' });
        }
    }
}

function validateActionId() {
    return (req, res, next) => {

        actions
            .get(req.params.id)
            .then(got => {
                if (got) {
                    next();
                } else {
                    res.status(400).json({ errorMessage: 'This ID does not exist.' })
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ errorMessage: 'Oopps' });
            })
    }
}

function validateProjectId() {
    return (req, res, next) => {
        projects
            .get(req.resource.project_id)
            .then(got => {
                if (got) {
                    next();
                } else {
                    res.status(400).json({ errorMessage: 'This ID does not exist.' })
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ errorMessage: 'Oopps' });
            })
    }
}

module.exports = router;