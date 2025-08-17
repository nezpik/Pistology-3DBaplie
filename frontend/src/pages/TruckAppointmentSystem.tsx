import React, { useState, useEffect } from 'react';

const AppointmentStatus = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

const TruckAppointmentSystem = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [truckingCompany, setTruckingCompany] = useState('');
  const [driverName, setDriverName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [status, setStatus] = useState(AppointmentStatus.SCHEDULED);
  const [containerId, setContainerId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/appointments');
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
    fetchAppointments();
  }, []);

  const handleAddAppointment = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ truckingCompany, driverName, licensePlate, appointmentTime, status, containerId }),
      });
      if (response.ok) {
        setTruckingCompany('');
        setDriverName('');
        setLicensePlate('');
        setAppointmentTime('');
        setStatus(AppointmentStatus.SCHEDULED);
        setContainerId('');
        await fetchAppointments();
      } else {
        setError('Failed to add appointment');
      }
    } catch (err) {
      setError('Failed to add appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/appointments/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchAppointments();
      } else {
        setError('Failed to delete appointment');
      }
    } catch (err) {
      setError('Failed to delete appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAppointmentStatus = async (appointment: any, newStatus: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/appointments/${appointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...appointment, status: newStatus }),
      });
      if (response.ok) {
        await fetchAppointments();
      } else {
        setError('Failed to update appointment status');
      }
    } catch (err) {
      setError('Failed to update appointment status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Truck Appointment System (TAS)</h1>
      {error && <div className="text-danger mb-4">{error}</div>}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Add New Appointment</h2>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Trucking Company" className="p-2 border rounded" value={truckingCompany} onChange={(e) => setTruckingCompany(e.target.value)} disabled={submitting} />
          <input type="text" placeholder="Driver Name" className="p-2 border rounded" value={driverName} onChange={(e) => setDriverName(e.target.value)} disabled={submitting} />
          <input type="text" placeholder="License Plate" className="p-2 border rounded" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} disabled={submitting} />
          <input type="datetime-local" placeholder="Appointment Time" className="p-2 border rounded" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} disabled={submitting} />
          <select className="p-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value)} disabled={submitting}>
            {Object.values(AppointmentStatus).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input type="text" placeholder="Container ID" className="p-2 border rounded" value={containerId} onChange={(e) => setContainerId(e.target.value)} disabled={submitting} />
          <button className="bg-primary hover:bg-primary-700 text-white font-bold py-2 px-4 rounded col-span-2 disabled:bg-primary-300" onClick={handleAddAppointment} disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Appointment'}
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Appointments</h2>
        {loading ? (
          <div>Loading appointments...</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Time</th>
                <th className="border p-2">Trucking Company</th>
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
                  <td className="border p-2">{appointment.truckingCompany}</td>
                  <td className="border p-2">{appointment.driverName}</td>
                  <td className="border p-2">{appointment.licensePlate}</td>
                  <td className="border p-2">{appointment.containerId}</td>
                  <td className="border p-2">
                    <select
                      value={appointment.status}
                      onChange={(e) => handleUpdateAppointmentStatus(appointment, e.target.value)}
                      className="p-1 border rounded"
                      disabled={submitting}
                    >
                      {Object.values(AppointmentStatus).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border p-2">
                      <button className="text-danger hover:text-danger-700" onClick={() => handleDeleteAppointment(appointment.id)} disabled={submitting}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TruckAppointmentSystem;
