import { Router, RequestHandler } from "express";
import { create_Room, Room_Chats_by_Id, Room_Chats_by_name, user_login, user_Signed_up } from "../controller/usercontroller";

const userRoutes = Router();

userRoutes.use('/api/v1/auth', user_Signed_up);
userRoutes.use('/api/v1/auth', user_login);
userRoutes.use('/api/v1', create_Room);
userRoutes.use('/api/v1', Room_Chats_by_Id);
userRoutes.use('/api/v1', Room_Chats_by_name);

export default userRoutes;
