require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Task = require("./src/models/Task");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Task Management API is running"
    });
});

app.get("/health", (req, res) => {
    res.json({
        success: true,
        status: "healthy"
    });
});

app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();    

        res.json({
            success: true,
            tasks
        });
    } catch (error) {
        console.error("Failed to fetch tasks:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch tasks"
        });
    }
});

app.post("/api/tasks", async (req, res) => {
    try {
        const { title, description, status } = req.body;

        const task = await Task.create({
            title,
            description,
            status
        });

        res.status(201).json({
            success: true,
            task
        });
    } catch (error) {
        console.error("Failed to create task:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create task"
        });
    }
});

app.get("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.json({
            success: true,
            task
        });
    } catch (error) {
        console.error("Failed to fetch task:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch task"
        });
    }
});


app.put("/api/tasks/:id", async (req, res) => {
    try {
        const { title, description, status } = req.body;

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                status
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.json({
            success: true,
            task
        });
    } catch (error) {
        console.error("Failed to update task:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update task"
        });
    }
});


app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.json({
            success: true,
            message: "Task deleted successfully",
            task
        });
    } catch (error) {
        console.error("Failed to delete task:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete task"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});