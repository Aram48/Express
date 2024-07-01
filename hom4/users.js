const express = require("express");
const fs = require("fs");

const userRouter = express.Router();

userRouter.post("/", (req, res) => {

    let newUser = req.body;
    fs.readFile("users.json", "utf-8", (err, data) => {
        if (err) {
            console.err("File does not exist");
            return res.status(500).send("Internal erver error");
        }
        let users = [];

        try {
            users = JSON.parse(data);
            users.push(newUser);

            fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    console.error("Cannot add user");
                    return res.status(500).send("Internal server error");
                }
                return res.status(200).send({ message: "User created" });
            });
        } catch (err) {
            console.error("Something went wrong while parsing data");
            res.status(500).send("Internal server error");
        }
    })
});

userRouter.get("/", (req, res) => {

    fs.readFile("users.json", "utf-8", (err, data) => {
        if (err) {
            console.err("File does not exist");
            res.status(500).send("Internal server error");
        }

        try {
            const users = JSON.parse(data);
            res.send(users);
        } catch (err) {
            res.status(500).send("Internal server error");
        }
    });
});

userRouter.get("/:id", (req, res) => {

    fs.readFile("users.json", "utf-8", (err, data) => {
        if (err) {
            console.error("File does not exist");
            res.status(500).send("Internal server error");
        }
        try {
            const users = JSON.parse(data);
            let index = users.find(user => user.id === parseInt(req.params.id));
            if (index) {
                res.send(index);
            } else {
                res.status(400).send("User not found");
            }
        } catch (err) {
            res.status(500).send("Internal server error");
        }
    });
});

userRouter.put("/:id", (req, res) => {

    fs.readFile("users.json", "utf-8", (err, data) => {
        if (err) {
            console.error("File does not exist");
            res.status(500).send("Internal server error");
        }
        try {
            const users = JSON.parse(data);
            const index = users.findIndex(user => user.id === parseInt(req.params.id));
            if (index !== -1) {
                users[index].fullName = req.body.fullName;
                users[index].email = req.body.email;

                fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
                    if (err) {
                        console.error("Cannot update user");
                        return res.status(500).send("Internal server error");
                    }
                    res.status(200).send("User updated successfully");
                });
            } else {
                res.status(404).send("User not found");
            }
        } catch (err) {
            console.error("Something went wrong");
            res.status(500).send("Internal server error");
        }
    });
});


userRouter.delete("/:id", (req, res) => {
    fs.readFile("users.json", "utf-8", (err, data) => {
        if (err) {
            console.error("File does not exist");
            res.status(500).send("Internal server error");
        }
        try {
            const users = JSON.parse(data);
            let find = users.findIndex(user => user.id === parseInt(req.params.id));
            if (find !== -1) {
                users.splice(find, 1);
                fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
                    if (err) {
                        console.error("Cannot delete user");
                        return res.status(500).send("Internal server error");
                    }
                    res.status(200).send("User deleted successfully");
                });
            } else {
                res.status(404).send("User not found");
            }
        } catch (err) {
            console.error("Something went wrong");
            res.status(500).send("Internal server error");
        }
    })
});

module.exports = userRouter;