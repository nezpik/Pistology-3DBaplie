import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ContainerLocation = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const [location, setLocation] = useState<any>(null);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3001/api/location/${containerId}`);
        if (response.ok) {
          const data = await response.json();
          setLocation(data);
          setLat(data.lat.toString());
          setLng(data.lng.toString());
        } else {
          const err = await response.json();
          setError(err.error || 'Location not found');
          setLocation(null);
        }
      } catch (err) {
        setError('Failed to fetch location');
        setLocation(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();
  }, [containerId]);

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/location/${containerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng) }),
      });
      if (response.ok) {
        const data = await response.json();
        setLocation(data);
        setLat(data.lat.toString());
        setLng(data.lng.toString());
      } else {
        const err = await response.json();
        setError(err.error || 'Failed to update location');
      }
    } catch (err) {
      setError('Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !location) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Container Location: {containerId}</h1>
      {error && <div className="text-danger mb-4">{error}</div>}
      {location ? (
        <div>
          <div className="w-full h-96 bg-secondary-200 mb-4 flex items-center justify-center">
            Map Placeholder (Lat: {location.lat}, Lng: {location.lng})
          </div>
          <div className="flex gap-4 items-center">
            <input
              type="number"
              placeholder="Latitude"
              className="p-2 border rounded"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Longitude"
              className="p-2 border rounded"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              disabled={loading}
            />
            <button
              className="bg-primary hover:bg-primary-700 text-white font-bold py-2 px-4 rounded disabled:bg-primary-300"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Location'}
            </button>
          </div>
        </div>
      ) : (
        <div>No location data found for this container.</div>
      )}
    </div>
  );
};

export default ContainerLocation;
