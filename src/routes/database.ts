import {Router} from 'express';
import dbService from "../controller/database"
const router = Router();

router.get("/create" , dbService.createUser);

router.get("/post" , dbService.createPersonAndPost);
router.get("/aggregate" , dbService.aggreatedData);


router.post("/create-person" , dbService.createPerson);
router.post("/create-post" , dbService.createPost);



router.post("/create-account" , dbService.createUserAccount);
router.post("/transfer-money" , dbService.transferMoney);



export default router;
