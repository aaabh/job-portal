import { Job } from "../model/job.model.js";

//Admin Job Posting
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      position,
      companyId,
      experience,
    } = req.body;
    const userId = req.id;
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !position ||
      !companyId ||
      !experience
    ) {
      return res.status(400).json({
        message: "Please fill in all fields",
        status: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      position,
      company : companyId,
      experienceLevel: experience,
      created_by: userId,
    });
    return res.status(201).json({
      message: "Job posted successfully",
      status: true,
      job,
    });

  } catch (error) {
    console.error("error in postJob", error);
    res.status(500).send({ message: "Server Error posting job" });
  }
};



//Users
export const getAllJobs = async ( req, res ) => {
  try{
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { requirements: { $regex: keyword, $options: "i" }},
        // { salary: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
        { jobType: { $regex: keyword, $options: "i" } },
        { position: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query).populate({
      path: "company",
    }).sort({createdAt:-1});
    
    if( !jobs ){
      return res.status(404).json({
        message: "No jobs found",
        status: false,
        });
    };
    return res.status(200).json({
      message: "Jobs found successfully",
      status: true,
      jobs,
      });

  }
  catch(error){
    console.error("error in getAllJobs", error);
    res.status(500).send({ message: "Server Error getting all jobs" });
  }
}

//User
export const getJobById = async ( req, res ) => {
  try{
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if( !job ){
      return res.status(404).json({
        message: "Job not found",
        status: false,
        });
      }
      return res.status(200).json({
        message: "Job found successfully",
        status: true,
        job,
        });
  }
  catch(error){
    console.error("error in getJobById", error);
    return res.status(500).json({
      message: "Server Error getting job by id",
      success: false,
    })
  }
}

//Admin job created 
export const getAdminJobs = async ( req, res ) => {
  try{
    const adminId = req.id ;
    const jobs = await Job.find({ created_by: adminId });
    if( !jobs ){
      return res.status(404).json({
        message: "No jobs found",
        status: false,
        });
        }
        return res.status(200).json({
          message: "Jobs found successfully",
          status: true,
          jobs,
          });

  }
  catch( error ){
    console.error("error in getAdminJobs", error);
    return res.status(500).json({
      message: "Server Error getting admin jobs",
      success: false,
      });
  }
}

//update job
// export const updateJob = async ( req, res ) => {
//   try{


//   }
//   catch( error ){
//     console.error("error in updateJob", error);
//     return res.status(500).json({
//       message: "Server Error updating job",
//       success: false,
//     })
//   }
// }