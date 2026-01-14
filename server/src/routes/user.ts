import express, {type Request, type Response} from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../prisma.js'
import "dotenv/config"
import authMiddleware from './middleware.js'

const app = express()

app.post('/signup', async (req : Request, res : Response) => {
    const {name, email, password}:{name:string, email:string, password:string} = req.body
    try{
        const find = await prisma.user.findFirstOrThrow({
            where:{
                email
            }
        })

        const user = await prisma.user.create({
            data:{
                name,
                email,
                password
            }
        })

        const token = jwt.sign({id : user.id},`${ process.env.JWT_SECRET}`)
        res.status(200).json({msg:"user created", details : user})
    }catch(err){
        res.status(400).json({msg : err})
    }
})

app.post('/signin', async (req : Request, res : Response)=>{
    const {email, password} : { email : string, password : string} = req.body
    try{
        const user = await prisma.user.findFirstOrThrow({
            where:{
                email
            }
        })
        if (user.password != password){
            throw new Error("invalid password")
        }
        const token = jwt.sign({id:user.id}, `${process.env.JWT_SECRET}`)
        res.status(200).json({msg: "user signin", token}) 
    }catch(err){
        res.status(400).json({msg:err})
    }
})

app.get('/allEvents', authMiddleware, async (req : Request, res : Response)=>{
    const events = await prisma.event.findMany();
    res.status(200).json({msg :"all events", events})
})

app.post('/booking:id', authMiddleware, async (req : Request, res : Response)=>{
    const eventId = Number(req.params.id);
    const userId = Number(req.id);
    const {seatId}:{seatId:number} = req.body;
    try {
        
        const transaction = prisma.$transaction(async (tx)=>{
            const seats  = await tx.$queryRaw<
            { id: number; isBooked: boolean }[]
            >`
            SELECT * from "Seats" WHERE "id" = ${seatId} FOR UPDATE
            `
            if (seats.length === 0){
                throw new Error("seats does not exist");
            }
            
            if (seats[0]?.isBooked){
                throw new Error("seat already booked");
                
            }
            const booking = await tx.booking.create({
                data: {
                    userId,
                    eventId
                }
            })
            const seatBooking = await tx.bookingSeat.create({
                data:{
                    bookingId : booking.id,
                    seatId
                }
            })
            
            await tx.seat.update({
                where:{
                    id : seatId
                },
                data:{
                    isBooked : true
                }
            })

            return booking
        })

        res.status(200).json({msg:"seats booked sucessfully", booking:transaction})
    } catch (error) {
        res.status(400).json({msg:error})
    }

})

export default app