import express from "express";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";
import authenticateToken from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/postJob").post(authenticateToken, postJob);
router.route("/getAll").get(authenticateToken, getAllJobs);
router.route("/getadminjobs").get(authenticateToken, getAdminJobs);
router.route("/get/:id").get(authenticateToken, getJobById);



export default router;

