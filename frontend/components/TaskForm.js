"use client";

import { useEffect, useState } from "react";

const emptyTask = {
  title: "",
  description: "",
  completed: false
};

export default function TaskForm({ editingTask, onSubmit, onCancel }) {
  const [task, setTask] = useState(emptyTask);

  useEffect(() => {
    if (editingTask) {
      setTask({
        title: editingTask.title || "",
        description: editingTask.description || "",
        completed: Boolean(editingTask.completed)
      });
      return;
    }

    setTask(emptyTask);
  }, [editingTask]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(task);
    if (!editingTask) {
      setTask(emptyTask);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{editingTask ? "Edit Task" : "Add Task"}</h2>
      <label>
        Title
        <input
          type="text"
          value={task.title}
          onChange={(event) => setTask((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="Enter task title"
          required
        />
      </label>

      <label>
        Description
        <textarea
          value={task.description}
          onChange={(event) =>
            setTask((prev) => ({ ...prev, description: event.target.value }))
          }
          placeholder="Optional task details"
          rows={3}
        />
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(event) =>
            setTask((prev) => ({ ...prev, completed: event.target.checked }))
          }
        />
        Completed
      </label>

      <div className="form-actions">
        <button type="submit">{editingTask ? "Update" : "Create"}</button>
        {editingTask && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
