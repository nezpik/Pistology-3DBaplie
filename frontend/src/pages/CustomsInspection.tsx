import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const InspectionStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

const CustomsInspection = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const [inspections, setInspections] = useState<any[]>([]);
  const [status, setStatus] = useState(InspectionStatus.PENDING);
  const [notes, setNotes] = useState('');
  const [inspectedBy, setInspectedBy] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchInspections = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/customs/${containerId}`);
      if (response.ok) {
        const data = await response.json();
        setInspections(data);
      } else {
        setError('Failed to fetch inspections');
      }
    } catch (err) {
      setError('Failed to fetch inspections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, [containerId]);

  const handleAddInspection = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/customs/${containerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes, inspectedBy }),
      });
      if (response.ok) {
        setStatus(InspectionStatus.PENDING);
        setNotes('');
        setInspectedBy('');
        await fetchInspections();
      } else {
        setError('Failed to add inspection');
      }
    } catch (err) {
      setError('Failed to add inspection');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customs Inspections: {containerId}</h1>
      {error && <div className="text-danger mb-4">{error}</div>}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Add New Inspection</h2>
        <div className="flex flex-col gap-2">
          <select
            className="p-2 border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={submitting}
          >
            {Object.values(InspectionStatus).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <textarea
            placeholder="Notes"
            className="p-2 border rounded w-full"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={submitting}
          />
          <input
            type="text"
            placeholder="Inspected By"
            className="p-2 border rounded"
            value={inspectedBy}
            onChange={(e) => setInspectedBy(e.target.value)}
            disabled={submitting}
          />
          <button
            className="bg-primary hover:bg-primary-700 text-white font-bold py-2 px-4 rounded disabled:bg-primary-300"
            onClick={handleAddInspection}
            disabled={submitting}
          >
            {submitting ? 'Adding...' : 'Add Inspection'}
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Inspections</h2>
        {loading ? (
          <div>Loading inspections...</div>
        ) : (
          inspections.map((inspection) => (
            <div key={inspection.id} className="border p-4 mb-4 rounded">
              <p><strong>Status:</strong> {inspection.status}</p>
              <p><strong>Inspected By:</strong> {inspection.inspectedBy}</p>
              <p><strong>Date:</strong> {new Date(inspection.createdAt).toLocaleString()}</p>
              <p><strong>Notes:</strong> {inspection.notes}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomsInspection;
