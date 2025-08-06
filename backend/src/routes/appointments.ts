import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  const appointments = await prisma.truckAppointment.findMany({
    orderBy: { appointmentTime: 'asc' },
  });
  res.json(appointments);
});

router.post('/', async (req, res) => {
  const { truckingCompany, driverName, licensePlate, appointmentTime, status, containerId } = req.body;
  try {
    const appointment = await prisma.truckAppointment.create({
      data: { truckingCompany, driverName, licensePlate, appointmentTime, status, containerId },
    });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { truckingCompany, driverName, licensePlate, appointmentTime, status, containerId } = req.body;
  try {
    const appointment = await prisma.truckAppointment.update({
      where: { id },
      data: { truckingCompany, driverName, licensePlate, appointmentTime, status, containerId },
    });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.truckAppointment.delete({
      where: { id },
    });
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

export default router;
