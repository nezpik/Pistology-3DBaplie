import React from 'react';

const CodecoMessageView = ({ message }) => {
    if (!message.codecoMessage) return null;

    return (
        <div>
        <h3 className="text-lg font-bold">CODECO Message</h3>
        <p><strong>Gate:</strong> {message.codecoMessage.gate}</p>
        <table className="w-full mt-2 text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col" className="px-6 py-3">Container ID</th>
                <th scope="col" className="px-6 py-3">Movement Type</th>
                <th scope="col" className="px-6 py-3">Truck License Plate</th>
            </tr>
            </thead>
            <tbody>
            {message.codecoMessage.movements.map((movement) => (
                <tr key={movement.id} className="bg-white border-b">
                <td className="px-6 py-4">{movement.containerId}</td>
                <td className="px-6 py-4">{movement.movementType}</td>
                <td className="px-6 py-4">{movement.truckLicensePlate}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default CodecoMessageView;
