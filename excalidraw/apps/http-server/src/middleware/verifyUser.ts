import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common2febe/common";

export const verifUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({message: "Unauthorized"});
        }
        if (typeof decoded === "string" || !("id" in decoded)) {
            return res.status(401).json({message: "Unauthorized"});
        }
        req.body.user_Id = (decoded as jwt.JwtPayload).id;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}
