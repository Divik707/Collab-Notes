import { Router, Request, Response } from "express"
import { RequestHandler } from "express-serve-static-core"
import { userSchema, roomSchema } from "@repo/schemas/schema"
import { prismaClient } from "@repo/database/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/common2febe/common"
import { verifUser } from "../middleware/verifyUser"

const userController = Router();

export const user_Signed_up = userController.post('/sign-up', async(req: Request, res: Response) => {
    try {
        const parsed_Data = userSchema.safeParse(req.body);
        if(!parsed_Data.success) {
            res.json({
                message: "Invalid inputs"
            })
        }
        const user_Exist = await prismaClient.user.findFirst({
            where: { username: parsed_Data.data?.username}
        })
        if(user_Exist) {
            res.json({
                message: "user already signed-up"
            })
        }
        if(parsed_Data.data?.password == null) {
            return
        }
        const hashed_Password = await bcrypt.hash(parsed_Data.data.password, 10)
        await prismaClient.user.create({
            data: {
                username: parsed_Data.data?.username,
                password:  hashed_Password
            }
        })
        res.json({
            message: "user created successfully"
        })
    } catch (error) {
        console.error(error)
        res.json({
            message: "error handling"
        })
    }
})

export const user_login = userController.post('/login', async(req: Request, res: Response) =>{
    try {
        const parsed_Data = userSchema.safeParse(req.body);
        if(!parsed_Data.success) {
            res.json({
                message: "Invalid inputs"
            })
        }
        const user_Exist = await prismaClient.user.findFirst({
                where: { username: parsed_Data.data?.username }
        })
         if(!user_Exist) {
         res.json({
         message: "user not found"
          })
        }
        if(parsed_Data.data?.password == null || user_Exist?.password == null) {
            return;
        }
        const valid_Password = await bcrypt.compare(parsed_Data.data.password, user_Exist.password)
        if(!valid_Password) {
            res.json({
             message: "Invalid password"
             })
        }

        const user_Token = jwt.sign({id: user_Exist.id}, JWT_SECRET, {expiresIn: '15d'})
        res.json({
            message: "login successful",
            token: user_Token
        })
    } catch (error) {
        console.error(error)
        res.json({
            message: "error handling"
        })
    }
});

export const create_Room = userController.post('/room', verifUser as RequestHandler, async (req: Request, res: Response) => {
    try {
        const parsed_Data = roomSchema.safeParse(req.body);
        if(!parsed_Data.success) {
            res.json({
                message: "Invalid inputs"
            })
        }
        const user_Id = req.body.user_Id ;
        const roomName = parsed_Data.data?.name;
        const room_Exist = await prismaClient.room.findFirst({
            where: {
                name: roomName
            }
        })
        if(room_Exist) {
            res.json({
                message: "room already exists"
            })
        }
        if(!user_Id) {
            res.json({
                message: "user not found"
            })
        const newRoom = await prismaClient.room.create({
            data: {
                name: roomName as string,
                adminId: user_Id
            }
        })
        res.json({
            message: "room created successfully",
            Room : newRoom.name
        })
    } }
    catch (error) {
        console.error(error)
        res.json({
            message: "error handling"
        })
    }
})

export const Room_Chats_by_Id = userController.get('/room/chats/:room_Id', async (req: Request, res: Response) => {
    try {
        const room_Id = parseInt(req.params.room_Id as string);
        const room = await prismaClient.room.findUnique({
            where: {
                id: room_Id
            }
        })
        if(!room) {
            res.json({
                message: "room not found"
            })
        }
        const roomId = parseInt(room?.id as unknown as string);
        const chats = await prismaClient.chats.findMany({
            where: {
                roomId: { id: roomId }
            }
        });
        res.json({
            message: "chats fetched successfully",
            chats: chats.map(chat => ({
                id: chat.id,
                message: chat.message,
            }))
        })
    } catch (error) {
        console.error(error)
        res.json({
            message: "error handling"
        })
    }
})

export const Room_Chats_by_name = userController.get('/room/chat/:room_Name', async (req: Request, res: Response) => {
    try {
        const room_Name = req.params.room_Name;
        const room = await prismaClient.room.findFirst({
            where: {
                name: room_Name
            }
        })
        if(!room) {
            res.json({
                message: "room not found"
            })
        }
        const roomId = parseInt(room?.id as unknown as string);
        const chats = await prismaClient.chats.findMany({
            where: {
                roomId: { id: roomId }
            }
        });
        res.json({
            message: "chats fetched successfully",
            chats: chats.map(chat => ({
                id: chat.id,
                message: chat.message,
            }))
        })
    } catch (error) {
        console.error(error)
        res.json({
            message: "error handling"
        })
    }
})