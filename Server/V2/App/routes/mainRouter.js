
import {Router} from 'express';
import authRouter from './authRouter.js';
//import fileRouter from './fileRouter.js';

const mainRouter = Router()

mainRouter.use("/auth", authRouter)
//mainRouter.use("/file", fileRouter)

export default mainRouter;