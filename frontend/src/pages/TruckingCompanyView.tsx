import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AppointmentStatus = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

const TruckingCompanyView = () => {
  const { companyName } = useParams<{ companyName: string }>();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/appointments/company/${companyName}`);
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        setError('Failed to fetch appointments');
      }
    } catch (err) {
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyName) {
      fetchAppointments();
    }
  }, [companyName]);

  const handleUpdateStatus = async (id: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
        const appointment = appointments.find(apt => apt.id === id);
        const response = await fetch(`http://localhost:3001/api/appointments/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...appointment, status }),
        });
        if (response.ok) {
            await fetchAppointments();
        } else {
            setError('Failed to update status');
        }
    } catch (err) {
        setError('Failed to update status');
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Appointments for {companyName}</h1>
      {error && <div className="text-danger mb-4">{error}</div>}
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
                {appointment.status === AppointmentStatus.SCHEDULED && (
                  <>
                    <button className="text-success mr-2 disabled:text-gray-400" onClick={() => handleUpdateStatus(appointment.id, AppointmentStatus.COMPLETED)} disabled={loading}>Complete</button>
                    <button className="text-danger disabled:text-gray-400" onClick={() => handleUpdateStatus(appointment.id, AppointmentStatus.CANCELLED)} disabled={loading}>Cancel</button>
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
