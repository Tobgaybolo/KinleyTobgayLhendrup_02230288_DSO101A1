"use client";

import { useEffect, useMemo, useState } from "react";
import TaskForm from "../components/TaskForm";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.REACT_APP_API_URL ||
  "https://be-todo-02230288-amd64-v2.onrender.com";

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed) || a.id - b.id);
  }, [tasks]);

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/tasks`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Unable to load tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateOrUpdate = async (payload) => {
    const isEditing = Boolean(editingTask?.id);
    const endpoint = isEditing ? `${API_URL}/api/tasks/${editingTask.id}` : `${API_URL}/api/tasks`;
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: "Request failed" }));
      throw new Error(body.error || "Request failed");
    }

    setEditingTask(null);
    await loadTasks();
  };

  const handleDelete = async (id) => {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: "Delete failed" }));
      throw new Error(body.error || "Delete failed");
    }

    if (editingTask?.id === id) {
      setEditingTask(null);
    }

    await loadTasks();
  };

  const handleToggleCompleted = async (task) => {
    const response = await fetch(`${API_URL}/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        completed: !task.completed
      })
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: "Update failed" }));
      throw new Error(body.error || "Update failed");
    }

    await loadTasks();
    setEditingTask(null);
  };

  return (
    <main className="page">
      <section className="card">
        <h1>Todo List</h1>

        <TaskForm
          editingTask={editingTask}
          onSubmit={async (task) => {
            try {
              setError("");
              await handleCreateOrUpdate(task);
            } catch (err) {
              setError(err.message);
            }
          }}
          onCancel={() => setEditingTask(null)}
        />

        {error && <p className="error">{error}</p>}

        <div className="tasks">
          {loading && <p>Loading tasks...</p>}
          {!loading && sortedTasks.length === 0 && <p>No tasks yet. Add one above.</p>}

          {!loading &&
            sortedTasks.map((task) => (
              <article key={task.id} className={`task-item ${task.completed ? "done" : ""}`}>
                <div>
                  <span className={`status-badge ${task.completed ? "completed" : "pending"}`}>
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                  <h3>{task.title}</h3>
                  <p>{task.description || "No description"}</p>
                </div>
                <div className="task-actions">
                  <button
                    className="secondary"
                    onClick={async () => {
                      try {
                        setError("");
                        await handleToggleCompleted(task);
                      } catch (err) {
                        setError(err.message);
                      }
                    }}
                    type="button"
                  >
                    {task.completed ? "Mark Incomplete" : "Mark Complete"}
                  </button>
                  <button className="secondary" onClick={() => setEditingTask(task)} type="button">
                    Edit
                  </button>
                  <button
                    className="danger"
                    onClick={async () => {
                      try {
                        setError("");
                        await handleDelete(task.id);
                      } catch (err) {
                        setError(err.message);
                      }
                    }}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
        </div>
      </section>
    </main>
  );
}
