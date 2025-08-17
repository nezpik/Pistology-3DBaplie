import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const DamageReport = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const [reports, setReports] = useState<any[]>([]);
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [photos, setPhotos] = useState<string[]>(['']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/damage/${containerId}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        setError('Failed to fetch reports');
      }
    } catch (err) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [containerId]);

  const handleAddReport = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const photoUrls = photos.map(p => p.trim()).filter(p => p);
      const response = await fetch(`http://localhost:3001/api/damage/${containerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, reportedBy, photos: photoUrls }),
      });
      if (response.ok) {
        setDescription('');
        setReportedBy('');
        setPhotos(['']);
        await fetchReports();
      } else {
        const err = await response.json();
        setError(err.error?.[0]?.message || 'Failed to add report');
      }
    } catch (err) {
      setError('Failed to add report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Damage Reports: {containerId}</h1>
      {error && <div className="text-danger mb-4">{error}</div>}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Add New Report</h2>
        <div className="flex flex-col gap-2">
          <textarea
            placeholder="Description"
            className="p-2 border rounded w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
          />
          <input
            type="text"
            placeholder="Reported By"
            className="p-2 border rounded"
            value={reportedBy}
            onChange={(e) => setReportedBy(e.target.value)}
            disabled={submitting}
          />
          <div>
            <label className="block mb-1">Photos (comma-separated URLs):</label>
            <input
              type="text"
              placeholder="e.g., http://example.com/photo1.jpg,http://example.com/photo2.jpg"
              className="p-2 border rounded w-full"
              value={photos.join(',')}
              onChange={(e) => setPhotos(e.target.value.split(','))}
              disabled={submitting}
            />
          </div>
          <button
            className="bg-primary hover:bg-primary-700 text-white font-bold py-2 px-4 rounded disabled:bg-primary-300"
            onClick={handleAddReport}
            disabled={submitting}
          >
            {submitting ? 'Adding...' : 'Add Report'}
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Reports</h2>
        {loading ? (
          <div>Loading reports...</div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="border p-4 mb-4 rounded">
              <p><strong>Description:</strong> {report.description}</p>
              <p><strong>Reported By:</strong> {report.reportedBy}</p>
              <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}</p>
              <div>
                <strong>Photos:</strong>
                <div className="flex gap-2 mt-2">
                  {report.photos.map((photo: string, index: number) => (
                    <img key={index} src={photo} alt="damage" className="w-32 h-32 object-cover" />
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DamageReport;
