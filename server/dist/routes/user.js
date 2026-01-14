import express, {} from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import "dotenv/config";
const app = express();
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const find = await prisma.user.findFirstOrThrow({
            where: {
                email
            }
        });
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        });
        const token = jwt.sign({ id: user.id }, `${process.env.JWT_SECRET}`);
        res.status(200).json({ msg: "user created", details: user });
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
        res.status(200).json({ msg: "user signin", token });
    }
    catch (err) {
        res.status(400).json({ msg: err });
    }
});
export default app;
//# sourceMappingURL=user.js.map