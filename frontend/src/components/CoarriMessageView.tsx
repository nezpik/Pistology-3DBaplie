import React from 'react';

const CoarriMessageView = ({ message }) => {
    if (!message.coarriMessage) return null;

    return (
        <div>
        <h3 className="text-lg font-bold">COARRI Message</h3>
        <p><strong>Vessel:</strong> {message.coarriMessage.vesselName}</p>
        <p><strong>Voyage:</strong> {message.coarriMessage.voyageNumber}</p>
        <table className="w-full mt-2 text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col" className="px-6 py-3">Container ID</th>
                <th scope="col" className="px-6 py-3">Movement Type</th>
                <th scope="col" className="px-6 py-3">Stowage Location</th>
            </tr>
            </thead>
            <tbody>
            {message.coarriMessage.movements.map((movement) => (
                <tr key={movement.id} className="bg-white border-b">
                <td className="px-6 py-4">{movement.containerId}</td>
                <td className="px-6 py-4">{movement.movementType}</td>
                <td className="px-6 py-4">{movement.stowageLocation}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default CoarriMessageView;
