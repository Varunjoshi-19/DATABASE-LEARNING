import {Router} from 'express';
import dbService from "../controller/database"
const router = Router();

router.get("/create" , dbService.createUser);

router.get("/post" , dbService.createPersonAndPost);
router.get("/get-peoples", dbService.getPeoples)
router.get("/aggregate" , dbService.aggreatedData);








export default router;
