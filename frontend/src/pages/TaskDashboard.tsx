import React, { useState, useEffect } from 'react';

const TaskStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

const TaskDashboard = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(TaskStatus.PENDING);
  const [assignee, setAssignee] = useState('');
  const [containerId, setContainerId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        setError('Failed to fetch tasks');
      }
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, status, assignee, containerId: containerId || null }),
      });
      if (response.ok) {
        setTitle('');
        setDescription('');
        setStatus(TaskStatus.PENDING);
        setAssignee('');
        setContainerId('');
        await fetchTasks();
      } else {
        setError('Failed to add task');
      }
    } catch (err) {
      setError('Failed to add task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchTasks();
      } else {
        setError('Failed to delete task');
      }
    } catch (err) {
      setError('Failed to delete task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTaskStatus = async (task: any, newStatus: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...task, status: newStatus }),
      });
      if (response.ok) {
        await fetchTasks();
      } else {
        setError('Failed to update task status');
      }
    } catch (err) {
      setError('Failed to update task status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task Dashboard</h1>
      {error && <div className="text-danger mb-4">{error}</div>}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Add New Task</h2>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Title" className="p-2 border rounded" value={title} onChange={(e) => setTitle(e.target.value)} disabled={submitting} />
          <input type="text" placeholder="Assignee" className="p-2 border rounded" value={assignee} onChange={(e) => setAssignee(e.target.value)} disabled={submitting} />
          <textarea placeholder="Description" className="p-2 border rounded col-span-2" value={description} onChange={(e) => setDescription(e.target.value)} disabled={submitting} />
          <select className="p-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value)} disabled={submitting}>
            {Object.values(TaskStatus).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input type="text" placeholder="Container ID (optional)" className="p-2 border rounded" value={containerId} onChange={(e) => setContainerId(e.target.value)} disabled={submitting} />
          <button className="bg-primary hover:bg-primary-700 text-white font-bold py-2 px-4 rounded col-span-2 disabled:bg-primary-300" onClick={handleAddTask} disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Tasks</h2>
        {loading ? (
          <div>Loading tasks...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div key={task.id} className="border p-4 rounded bg-white shadow">
                <h3 className="font-bold text-lg">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                <p><strong>Status:</strong> {task.status}</p>
                <p><strong>Assignee:</strong> {task.assignee}</p>
                {task.containerId && <p><strong>Container:</strong> {task.containerId}</p>}
                <div className="mt-4 flex justify-between items-center">
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateTaskStatus(task, e.target.value)}
                    className="p-1 border rounded"
                    disabled={submitting}
                  >
                    {Object.values(TaskStatus).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button className="text-danger hover:text-danger-700" onClick={() => handleDeleteTask(task.id)} disabled={submitting}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDashboard;
