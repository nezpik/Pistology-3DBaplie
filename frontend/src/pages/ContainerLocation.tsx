import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ContainerLocation = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const [location, setLocation] = useState<any>(null);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      const response = await fetch(`http://localhost:3001/api/location/${containerId}`);
      if (response.ok) {
        const data = await response.json();
        setLocation(data);
        setLat(data.lat);
        setLng(data.lng);
      }
    };
    fetchLocation();
  }, [containerId]);

  const handleUpdate = async () => {
    await fetch(`http://localhost:3001/api/location/${containerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng) }),
    });
    // a simple way to refresh the data
    const response = await fetch(`http://localhost:3001/api/location/${containerId}`);
    if (response.ok) {
        const data = await response.json();
        setLocation(data);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Container Location: {containerId}</h1>
      {location ? (
        <div>
          <div className="w-full h-96 bg-gray-200 mb-4 flex items-center justify-center">
            Map Placeholder (Lat: {location.lat}, Lng: {location.lng})
          </div>
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Latitude"
              className="p-2 border rounded"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            <input
              type="number"
              placeholder="Longitude"
              className="p-2 border rounded"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleUpdate}
            >
              Update Location
            </button>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ContainerLocation;
