const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/task");

const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
    // const task = Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(500).send(e)
    }
});

router.get('/tasks', auth, async (req, res) => {
    //console.log(req.query.completed);
    const match = { owner: req.user._id };
    const sort = {};
    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        const tasks = await Task.find(match, null, {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        });
        res.send(tasks);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedTaskUpdates = ["completed", "description"];
    const isValidOperation = updates.every((update) => allowedTaskUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send(`Invalid update`);
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);

    } catch (e) {
        res.status(500).send(e)
    }

});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        //const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send()
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
