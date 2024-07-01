const express = require("express");
const fs = require("fs");

const taskRouter = express.Router();

taskRouter.post("/", (req, res) => {

    let newTasks = req.body;
    fs.readFile("tasks.json", "utf-8", (err, data) => {
        if (err) {
            console.err("File does not exist");
            return res.status(500).send("Internal server error");
        }
        let tasks = [];

        try {
            tasks = JSON.parse(data);
            tasks.push(newTasks);

            fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2), (err) => {
                if (err) {
                    console.err("Can not add task");
                    return res.status(500).send("Internal server error");
                }
                return res.status(200).send({ message: "Task created" });
            });
        } catch (err) {
            console.error("Something went wrong while parsing data");
            res.status(500).send("Internal server error");
        }
    });
});

taskRouter.get("/", (req, res) => {

    fs.readFile("tasks.json", "utf-8", (err, data) => {
        if (err) {
            console.error("File doesnt exist");
            return res.status(500).send("Internal server error");
        }

        try {
            const tasks = JSON.parse(data);
            res.send(tasks);
        } catch (err) {
            res.status(500).send("Internal server error");
        }
    });
});

taskRouter.get("/:id", (req, res) => {

    fs.readFile("tasks.json", "utf-8", (err, data) => {
        if (err) {
            console.error("File does not exist");
            return res.status(500).send("Internal server error");
        }
        try {
            const tasks = JSON.parse(data);
            let index = tasks.find(task => task.id === parseInt(req.params.id));
            if (index) {
                res.send(index);
            } else {
                res.status(400).send("Task not found");
            }
        } catch (err) {
            return res.status(500).send("Internal server error");
        }
    });
});

taskRouter.put("/:id", (req, res) => {

    fs.readFile("tasks.json", "utf-8", (err, data) => {
        if (err) {
            console.error("File does not exist");
            res.status(500).send("Internal server error");
        }
        try {
            const tasks = JSON.parse(data);
            let index = tasks.findIndex(task => task.id === parseInt(req.params.id));
            if (index !== -1) {
                tasks[index].title = req.body.title,
                tasks[index].description = req.body.description,
                tasks[index].status = req.body.status,
                tasks[index].assignee = req.body.assignee,
                tasks[index].dueDate = req.body.dueDate

                fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2), (err) => {
                    if (err) {
                        console.error("Cannot update tasks");
                        return res.status(500).send("Internal server error");
                    }
                    res.status(200).send("Tasks update successfully");
                });
            } else {
                return res.status(400).send("Tasks not found");
            }
        } catch (err) {
            console.error("Something went wrong");
            return res.status(500).send("Internal server error");
        }
    });
});

taskRouter.delete("/:id", (req, res) => {

    fs.readFile("tasks.json", "utf-8", (err, data) => {
        if (err) {
            console.error("File does not exist");
            return res.status(500).send("Something went wrong");
        }

        try {
            const tasks = JSON.parse(data);
            let index = tasks.findIndex(task => task.id === parseInt(req.params.id));
            if (index !== -1) {
                tasks.splice(index, 1);

                fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2), (err) => {
                    if (err) {
                        console.error("Cannot delete tasks");
                        return res.status(500).send("Internal server error");
                    }
                    res.status(200).send("Tasks deleted successfully");
                });
            } else {
                return res.status(400).send("Tasks not found");
            }
        } catch (err) {
            return res.status(500).send("Internal server error");
        }
    });
});

module.exports = taskRouter;