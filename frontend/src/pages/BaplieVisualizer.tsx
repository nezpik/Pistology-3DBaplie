import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';

const BaplieVisualizer = () => {
  const [baplieContent, setBaplieContent] = useState('');
  const [containers, setContainers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/baplie/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ baplieContent }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to parse BAPLIE message');
      }

      const data = await response.json();
      setContainers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setContainers([]);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">BAPLIE 3D Visualizer</h1>
      <div className="mb-4">
        <textarea
          className="w-full h-40 p-2 border rounded"
          placeholder="Paste your BAPLIE message here..."
          value={baplieContent}
          onChange={(e) => setBaplieContent(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleParse}
        >
          Generate 3D View
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="w-full h-[600px] border rounded">
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <OrbitControls />
          {containers.map((container, index) => (
            <Box
              key={index}
              args={[
                container.size === '40' ? 2 : 1,
                1,
                1
              ]}
              position={[container.bay, container.tier, container.row]}
            >
              <meshStandardMaterial color={container.type === 'RE' ? 'red' : 'blue'} />
            </Box>
          ))}
        </Canvas>
      </div>
    </div>
  );
};

export default BaplieVisualizer;
