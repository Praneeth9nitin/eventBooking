import jwt from "jsonwebtoken"
import "dotenv/config"
import type { NextFunction, Request, Response } from "express"

declare global {
    namespace Express {
        interface Request {
            id?: string | object
        }
    }
}

const authMiddleware = function(req:Request,res:Response,next:NextFunction) {
    
    const auth = req.headers.authorization
    if(!auth || !auth.startsWith('Bearer ')){
        res.status(403).json({})
    }
    const token = auth?.split(" ")[1]
    
    try {
        if (token == undefined){
            throw new Error("token undedined");
        }
        const decode = jwt.verify(token,`${process.env.JWT_SECRET}`) as jwt.JwtPayload
        req.id = decode.id
        next();
    } catch (error) {
        res.status(403).json({})
    }
}

export default authMiddleware