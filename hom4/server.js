const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRouter = require("./users");
const taskRouter = require("./tasks");
const projectRouter = require("./projects");

const PORT = 3001;

app.use(bodyParser.json());

let resources = {
    users: "users.json",
    projects: "projects.json",
    tasks: "tasks.json",
}

app.use("/users", userRouter);
app.use("/tasks", taskRouter);
app.use("/projects", projectRouter);
app.use("/projects/:id/tasks", taskRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});