import express from "express";
import registerValidation from "../validation/registerValidation.js";
import { register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", [registerValidation], register);

export default router;
