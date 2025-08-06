import React, { useState, useEffect } from 'react';

const TruckAppointmentSystem = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [truckingCompany, setTruckingCompany] = useState('');
  const [driverName, setDriverName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [containerId, setContainerId] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch('http://localhost:3001/api/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    };
    fetchAppointments();
  }, []);

  const handleAddAppointment = async () => {
    await fetch('http://localhost:3001/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ truckingCompany, driverName, licensePlate, appointmentTime, status, containerId }),
    });
    // refresh
    const response = await fetch('http://localhost:3001/api/appointments');
    if (response.ok) {
        const data = await response.json();
        setAppointments(data);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    await fetch(`http://localhost:3001/api/appointments/${id}`, {
        method: 'DELETE'
    });
    // refresh
    const response = await fetch('http://localhost:3001/api/appointments');
    if (response.ok) {
        const data = await response.json();
        setAppointments(data);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Truck Appointment System (TAS)</h1>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Add New Appointment</h2>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Trucking Company" className="p-2 border rounded" value={truckingCompany} onChange={(e) => setTruckingCompany(e.target.value)} />
          <input type="text" placeholder="Driver Name" className="p-2 border rounded" value={driverName} onChange={(e) => setDriverName(e.target.value)} />
          <input type="text" placeholder="License Plate" className="p-2 border rounded" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} />
          <input type="datetime-local" placeholder="Appointment Time" className="p-2 border rounded" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} />
          <select className="p-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELED">Canceled</option>
          </select>
          <input type="text" placeholder="Container ID" className="p-2 border rounded" value={containerId} onChange={(e) => setContainerId(e.target.value)} />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-2" onClick={handleAddAppointment}>
            Add Appointment
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Appointments</h2>
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
                <td className="border p-2">{appointment.status}</td>
                <td className="border p-2">
                    <button className="text-red-500" onClick={() => handleDeleteAppointment(appointment.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TruckAppointmentSystem;
