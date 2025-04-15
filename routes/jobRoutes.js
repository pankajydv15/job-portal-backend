const express =require('express')
const {createJob, getAllJobs,getUserJobs} = require("../controller/jobPosterController")
const authenticateToken = require("../middleware/authmiddleware")

const router = express.Router();

router.post("/create",authenticateToken,createJob)
router.get("/",getAllJobs)
router.get("/user/:userId", getUserJobs);

module.exports = router;