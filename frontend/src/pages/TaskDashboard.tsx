import React, { useState, useEffect } from 'react';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('TODO');
  const [assignee, setAssignee] = useState('');
  const [containerId, setContainerId] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('http://localhost:3001/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    await fetch('http://localhost:3001/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, status, assignee, containerId }),
    });
    // refresh
    const response = await fetch('http://localhost:3001/api/tasks');
    if (response.ok) {
        const data = await response.json();
        setTasks(data);
    }
  };

  const handleDeleteTask = async (id: string) => {
    await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'DELETE'
    });
    // refresh
    const response = await fetch('http://localhost:3001/api/tasks');
    if (response.ok) {
        const data = await response.json();
        setTasks(data);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Add New Task</h2>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Title" className="p-2 border rounded" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="text" placeholder="Assignee" className="p-2 border rounded" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
          <textarea placeholder="Description" className="p-2 border rounded col-span-2" value={description} onChange={(e) => setDescription(e.target.value)} />
          <select className="p-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <input type="text" placeholder="Container ID (optional)" className="p-2 border rounded" value={containerId} onChange={(e) => setContainerId(e.target.value)} />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-2" onClick={handleAddTask}>
            Add Task
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="border p-4 rounded">
              <h3 className="font-bold">{task.title}</h3>
              <p>{task.description}</p>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Assignee:</strong> {task.assignee}</p>
              {task.containerId && <p><strong>Container:</strong> {task.containerId}</p>}
              <button className="text-red-500" onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;
