import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CustomsInspection = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const [inspections, setInspections] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [inspectedBy, setInspectedBy] = useState('');

  useEffect(() => {
    const fetchInspections = async () => {
      const response = await fetch(`http://localhost:3001/api/customs/${containerId}`);
      if (response.ok) {
        const data = await response.json();
        setInspections(data);
      }
    };
    fetchInspections();
  }, [containerId]);

  const handleAddInspection = async () => {
    await fetch(`http://localhost:3001/api/customs/${containerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, notes, inspectedBy }),
    });
    setStatus('');
    setNotes('');
    setInspectedBy('');
    // a simple way to refresh the data
    const response = await fetch(`http://localhost:3001/api/customs/${containerId}`);
    if (response.ok) {
        const data = await response.json();
        setInspections(data);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customs Inspections: {containerId}</h1>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Add New Inspection</h2>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Status"
            className="p-2 border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <textarea
            placeholder="Notes"
            className="p-2 border rounded w-full"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <input
            type="text"
            placeholder="Inspected By"
            className="p-2 border rounded"
            value={inspectedBy}
            onChange={(e) => setInspectedBy(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddInspection}
          >
            Add Inspection
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Inspections</h2>
        {inspections.map((inspection) => (
          <div key={inspection.id} className="border p-4 mb-4 rounded">
            <p><strong>Status:</strong> {inspection.status}</p>
            <p><strong>Inspected By:</strong> {inspection.inspectedBy}</p>
            <p><strong>Date:</strong> {new Date(inspection.createdAt).toLocaleString()}</p>
            <p><strong>Notes:</strong> {inspection.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomsInspection;
