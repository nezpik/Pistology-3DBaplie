import React from 'react';

const BaplieMessageView = ({ message }) => {
  if (!message.baplieMessage) return null;

  return (
    <div>
      <h3 className="text-lg font-bold">BAPLIE Message</h3>
      <p><strong>Vessel:</strong> {message.baplieMessage.vesselName}</p>
      <p><strong>Voyage:</strong> {message.baplieMessage.voyageNumber}</p>
      <table className="w-full mt-2 text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Container ID</th>
            <th scope="col" className="px-6 py-3">Bay</th>
            <th scope="col" className="px-6 py-3">Row</th>
            <th scope="col" className="px-6 py-3">Tier</th>
            <th scope="col" className="px-6 py-3">Size/Type</th>
          </tr>
        </thead>
        <tbody>
          {message.baplieMessage.containers.map((container) => (
            <tr key={container.id} className="bg-white border-b">
              <td className="px-6 py-4">{container.containerId}</td>
              <td className="px-6 py-4">{container.bay}</td>
              <td className="px-6 py-4">{container.row}</td>
              <td className="px-6 py-4">{container.tier}</td>
              <td className="px-6 py-4">{container.size}{container.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BaplieMessageView;
