import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TruckingCompanyView = () => {
  const { companyName } = useParams<{ companyName: string }>();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch('http://localhost:3001/api/appointments');
      if (response.ok) {
        const data = await response.json();
        const filteredAppointments = data.filter((apt: any) => apt.truckingCompany === companyName);
        setAppointments(filteredAppointments);
      }
    };
    fetchAppointments();
  }, [companyName]);

  const handleUpdateStatus = async (id: string, status: string) => {
    const appointment = appointments.find(apt => apt.id === id);
    await fetch(`http://localhost:3001/api/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...appointment, status }),
    });
    // refresh
    const response = await fetch('http://localhost:3001/api/appointments');
    if (response.ok) {
        const data = await response.json();
        const filteredAppointments = data.filter((apt: any) => apt.truckingCompany === companyName);
        setAppointments(filteredAppointments);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Appointments for {companyName}</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Time</th>
            <th className="border p-2">Driver</th>
            <th className="border p-2">License Plate</th>
            <th className="border p-2">Container</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td className="border p-2">{new Date(appointment.appointmentTime).toLocaleString()}</td>
              <td className="border p-2">{appointment.driverName}</td>
              <td className="border p-2">{appointment.licensePlate}</td>
              <td className="border p-2">{appointment.containerId}</td>
              <td className="border p-2">{appointment.status}</td>
              <td className="border p-2">
                {appointment.status === 'PENDING' && (
                  <>
                    <button className="text-green-500 mr-2" onClick={() => handleUpdateStatus(appointment.id, 'CONFIRMED')}>Confirm</button>
                    <button className="text-red-500" onClick={() => handleUpdateStatus(appointment.id, 'CANCELED')}>Cancel</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TruckingCompanyView;
