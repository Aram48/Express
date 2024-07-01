const express = require("express");
const fs = require("fs");

const projectRouter = express.Router();

projectRouter.post("/", (req, res) => {

    let newProject = req.body;

    fs.readFile("projects.json", "utf-8", (err, data) => {
        if (err) {
            console.error("File does not exist");
            return res.status(500).send("Internal server error");
        }

        let projects = [];

        try {
            projects = JSON.parse(data);
            projects.push(newProject);

            fs.writeFile("projects.json", JSON.stringify(projects, null, 2), (err) => {
                if (err) {
                    console.error("Can not add projects");
                    return res.status(500).send("Internal server error");
                }
                return res.status(200).send({ message: "Project created" });
            });
        } catch (err) {
            return res.status(500).send("Internal server error");
        }
    });
});

projectRouter.get("/", (req, res) => {

    fs.readFile("projects.json", "utf-8", (err, data) => {
        if (err) {
            console.error("File doesnt exist");
            return res.status(500).send("Internal server error");
        }

        try {
            const projects = JSON.parse(data);
            res.send(projects);
        } catch (err) {
            return res.status(500).send("Intrnal serer error");
        }
    });
});

projectRouter.get("/:id", (req, res) => {

    fs.readFile("projects.json", "utf-8", (err, data) => {
        if (err) {
            console.error("File doesnt exist");
            return res.status(500).send("Internal server error");
        }

        try {
            const projects = JSON.parse(data);
            let index = projects.find(project => project.id === parseInt(req.params.id));
            if (index) {
                res.send(index);
            } else {
                return res.status(400).send("Projects not found");
            }
        } catch (err) {
            return res.status(500).send("Internal server error");
        }
    });
});

projectRouter.put("/:id", (req, res) => {

    fs.readFile("projects.json", "utf-8", (err, data) => {
        if (err) {
            console.error("File doesnt exist");
            return res.status(500).send("Internal server error");
        }
        try {
            const projects = JSON.parse(data);
            let index = projects.findIndex(project => project.id === parseInt(req.params.id));
            if (index !== -1) {
                projects[index].name = req.body.name,
                    projects[index].description = req.body.description,
                    projects[index].startDate = req.body.startDate,
                    projects[index].endDate = req.body.endDate,
                    projects[index].status = req.body.status,
                    projects[index].budget = req.body.budget,
                    projects[index].currency = req.body.currency,
                    projects[index].team = req.body.team,
                    projects[index].tasks = req.body.tasks

                fs.writeFile("projects.json", JSON.stringify(projects, null, 2), (err) => {
                    if (err) {
                        console.error("Can not update projects");
                        return res.status(500).send("Internal server error");
                    }
                    res.status(200).send("Project updated successfully");
                });
            } else {
                return res.status(400).send("Projects not found");
            }
        } catch (err) {
            console.error("Something went wrong");
            return res.status(500).send("Internal server error");
        }
    });
});

projectRouter.delete("/:id", (req, res) => {

    fs.readFile("projects.json", "utf-8", (err, data) => {

        if (err) {
            console.error("File doesnt ecxist");
            return res.status(500).send("Internal server error");
        }
        try {
            const projects = JSON.parse(data);
            let index = projects.findIndex(project => project.id === parseInt(req.params.id));
            if (index !== -1) {
                projects.splice(index, 1);

                fs.writeFile("projects.json", JSON.stringify(projects, null, 2), (err) => {
                    if (err) {
                        console.error("Cannot delete projects");
                        return res.status(500).send("Internal server error");
                    }
                    res.status(200).send("Projects deleted successfully");
                });
            } else {
                return res.status(400).send("Projects not found");
            }
        } catch (err) {
            return res.status(500).send("Internal server error");
        }
    });
});

module.exports = projectRouter;