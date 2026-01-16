import express, { type Request, type Response } from 'express'
import 'dotenv/config'
import prisma from '../prisma.js'
import middleware from './middleware.js'
import jwt from 'jsonwebtoken'
import type { SeatCreateManyInput } from '../src/generated/prisma/models.js'
const app = express();
const secret = process.env.JWT_SECRET

app.post('/login', async (req:Request, res:Response)=>{
    const {username, password}:{username:string, password:string} = req.body;

    const admin = await prisma.admin.findUnique({
        where:{
            email:username
        }
    })
    if(!admin){
        res.status(400).json({msg:"admin not find"});
    }
    if (admin?.password !== password){
        res.status(400).json({msg:"invalid password"});
    }
    const token = jwt.sign({id:admin?.id}, `${secret}`)
    res.status(200).json({msg:"login successful",token});
})

app.post('/createEvent', middleware, async (req:Request, res:Response)=>{
    const {title, location, dateTime, totalSeats} : {title:string, location:string, dateTime:string, totalSeats:number} = req.body;

    const find = await prisma.event.findFirst({
        where:{
            title,
            location,
            dateTime
        }
    })

    if (find){
        res.status(400).json({msg:"event already exist"})
    }
    const event = await prisma.event.create({
        data:{
            title,
            location,
            dateTime
        },
        select:{
            id:true,
            title:true,
            dateTime:true
        }
    })
    let setSeats:SeatCreateManyInput[] = []
    for(var i = 0; i < totalSeats; i++){
        setSeats.push({ eventId : event.id, seatNo : String.fromCharCode(65+ Math.floor(i/10)) +'-'+ String.fromCharCode(48 + i%10) });
    }

    const seats = await prisma.seat.createMany({
        data:setSeats
    })

    return res.status(200).json({msg:"event created",details:event})
})

export default app;