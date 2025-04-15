const Job = require("../models/jobSchema")

const createJob = async(req, res) =>{
    try{
        console.log("User from token:", req.user);
        const { companyName, description, website, email, industry, location, socialMediaLinks } = req.body;

        const job = new Job({
            companyName, 
            description,
            website,
            email,
            industry,
            location,
            socialMediaLinks,
            postedBy: req.user.id, 
        })

        await job.save();
        res.status(201).json({message: "job created successfully ", job})
    } catch (err){
        res.status(500).json({message: "Error creating job"})
    }
}

//Fetch Job
const getAllJobs = async (req, res)=>{
    try{
        const jobs = await Job.find();
        res.status(200).json(jobs)
    }catch(err){
        res.status(500).json({message:"Error Fetching Jobs", error:err.message});
    }
}

const getUserJobs = async (req, res) => {
    try {
      const userId = req.params.userId;
      const jobs = await Job.find({ postedBy: userId });
  
      res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching jobs",
        error: error.message,
      });
    }
  };
  
  

module.exports = {
    createJob,
    getAllJobs,
    getUserJobs,
  };





