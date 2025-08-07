import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.get('/', async (req, res) => {
  const appointments = await prisma.truckAppointment.findMany({
    orderBy: { appointmentTime: 'asc' },
  });
  res.json(appointments);
});

import { z } from 'zod';
import { AppointmentStatus } from '@prisma/client';

const appointmentSchema = z.object({
  truckingCompany: z.string().min(1),
  driverName: z.string().min(1),
  licensePlate: z.string().min(1),
  appointmentTime: z.string().datetime(),
  status: z.nativeEnum(AppointmentStatus),
  containerId: z.string().min(1),
});

router.post('/', async (req, res) => {
  try {
    const validation = appointmentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues });
    }
    const appointment = await prisma.truckAppointment.create({
      data: validation.data,
    });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validation = appointmentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues });
    }
    const appointment = await prisma.truckAppointment.update({
      where: { id },
      data: validation.data,
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
