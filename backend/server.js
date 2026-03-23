require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { pool, initDb } = require("./db");

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    service: "be-todo",
    status: "ok",
    endpoints: ["/health", "/api/tasks"]
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/tasks", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.get("/api/tasks/:id", async (req, res) => {
  const taskId = Number(req.params.id);

  try {
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [taskId]);
    if (!result.rowCount) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to fetch task:", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { title, description = "", completed = false } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "title is required" });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO tasks (title, description, completed)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [title.trim(), description, completed]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to create task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  const taskId = Number(req.params.id);
  const { title, description = "", completed = false } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "title is required" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE tasks
      SET title = $1,
          description = $2,
          completed = $3,
          updated_at = NOW()
      WHERE id = $4
      RETURNING *
      `,
      [title.trim(), description, completed, taskId]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  const taskId = Number(req.params.id);

  try {
    const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING id", [taskId]);

    if (!result.rowCount) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed:", error);
    process.exit(1);
  });
