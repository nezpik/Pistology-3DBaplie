import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ContainerHistory = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const [history, setHistory] = useState<any[]>([]);
  const [event, setEvent] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/history/${containerId}`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else {
        setError('Failed to fetch history');
      }
    } catch (err) {
      setError('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [containerId]);

  const handleAddEvent = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/history/${containerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event, description }),
      });
      if (response.ok) {
        setEvent('');
        setDescription('');
        await fetchHistory(); // Refresh the history
      } else {
        setError('Failed to add event');
      }
    } catch (err) {
      setError('Failed to add event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Container History: {containerId}</h1>
      {error && <div className="text-danger mb-4">{error}</div>}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Add New Event</h2>
        <div className="flex gap-4 mb-2">
          <input
            type="text"
            placeholder="Event"
            className="p-2 border rounded"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            disabled={submitting}
          />
          <input
            type="text"
            placeholder="Description"
            className="p-2 border rounded w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
          />
        </div>
        <button
          className="bg-primary hover:bg-primary-700 text-white font-bold py-2 px-4 rounded disabled:bg-primary-300"
          onClick={handleAddEvent}
          disabled={submitting}
        >
          {submitting ? 'Adding...' : 'Add Event'}
        </button>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">History</h2>
        {loading ? (
          <div>Loading history...</div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ContainerHistory;
