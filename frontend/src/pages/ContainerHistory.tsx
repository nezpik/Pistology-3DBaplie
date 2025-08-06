import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ContainerHistory = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const [history, setHistory] = useState<any[]>([]);
  const [event, setEvent] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await fetch(`http://localhost:3001/api/history/${containerId}`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    };
    fetchHistory();
  }, [containerId]);

  const handleAddEvent = async () => {
    await fetch(`http://localhost:3001/api/history/${containerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event, description }),
    });
    setEvent('');
    setDescription('');
    // a simple way to refresh the data
    const response = await fetch(`http://localhost:3001/api/history/${containerId}`);
    if (response.ok) {
        const data = await response.json();
        setHistory(data);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Container History: {containerId}</h1>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Add New Event</h2>
        <div className="flex gap-4 mb-2">
          <input
            type="text"
            placeholder="Event"
            className="p-2 border rounded"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            className="p-2 border rounded w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddEvent}
        >
          Add Event
        </button>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">History</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Event</th>
              <th className="border p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{new Date(item.createdAt).toLocaleString()}</td>
                <td className="border p-2">{item.event}</td>
                <td className="border p-2">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContainerHistory;
