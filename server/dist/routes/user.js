import express, {} from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import "dotenv/config";
import authMiddleware from './middleware.js';
import { boolean } from 'zod';
const app = express();
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const find = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (find) {
            throw new Error("user already exist");
        }
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        });
        const token = jwt.sign({ id: user.id }, `${process.env.JWT_SECRET}`);
        res.status(200).json({ msg: "user created", details: user, token });
    }
    catch (err) {
        res.status(400).json({ msg: err });
    }
});
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                email
            }
        });
        if (user.password != password) {
            throw new Error("invalid password");
        }
        const token = jwt.sign({ id: user.id }, `${process.env.JWT_SECRET}`);
        res.status(200).json({ msg: "user signin", user, token });
    }
    catch (err) {
        res.status(400).json({ msg: err });
    }
});
app.get('/allEvents', authMiddleware, async (req, res) => {
    const events = await prisma.event.findMany();
    res.status(200).json({ msg: "all events", events });
});
app.get('/seats/:event', authMiddleware, async (req, res) => {
    const eventId = Number(req.params.event);
    try {
        const seats = await prisma.seat.findMany({
            where: {
                eventId
            }
        });
        res.status(200).json({ msg: "seats for event", seats });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
app.get('/seatonhold/:id', authMiddleware, async (req, res) => {
    const eventId = Number(req.params.id);
    const userId = Number(req.id);
    try {
        const seats = await prisma.seat.findMany({
            where: {
                status: "HOLD",
                eventId,
                holdBy: userId
            }
        });
        res.status(200).json({ msg: "seats u hold for event", seats });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
app.post('/seatHold/:id', authMiddleware, async (req, res) => {
    const seatId = Number(req.params.id);
    const userId = Number(req.id);
    try {
        const result = await prisma.$transaction(async (tx) => {
            const seats = await tx.$queryRaw `SELECT * FROM "Seat" WHERE "id" = ${seatId} FOR UPDATE`;
            if (seats.length === 0) {
                throw new Error("seats not avaialble");
            }
            if (seats[0]?.status !== 'AVAILABLE') {
                throw new Error("seat is already booked or on hold");
            }
            const hold = await tx.seat.update({
                where: {
                    id: seatId
                },
                data: {
                    status: "HOLD",
                    holdBy: userId,
                    holdUntil: new Date(Date.now() + 5 * 60 * 1000)
                }
            });
        });
        res.status(200).json({ msg: "Seat held for 5 mins" });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
app.post('/bookSeats/:value', authMiddleware, async (req, res) => {
    const userId = Number(req.id);
    const eventId = Number(req.params.value);
    const seats = req.body.seats;
    const arraySeat = [];
    try {
        const result = await prisma.$transaction(async (tx) => {
            const confirmation = await tx.seat.updateMany({
                where: {
                    status: "HOLD",
                    eventId,
                    holdBy: userId
                },
                data: {
                    status: "BOOKED"
                }
            });
            const booking = await tx.booking.create({
                data: {
                    userId,
                    eventId
                }
            });
            seats.forEach(element => {
                arraySeat.push({ bookingId: booking?.id, seatId: element });
            });
            const seatBooking = await tx.bookingSeat.createMany({
                data: arraySeat
            });
            return { confirmation, booking, seatBooking };
        });
        res.status(200).json({ msg: "booked success fully", result });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
export default app;
//# sourceMappingURL=user.js.map