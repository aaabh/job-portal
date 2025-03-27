import { Company } from '../model/company.model.js';
export const registerCompany = async(req, res) => {
  try {
    const { companyName, description } = req.body;// Ensure description is included
    if( !companyName ) {
      return res.status(400).json({ message: "Company name is required" });
    }
    // if(!description){
    //   return res.status(400).json({ message: "Description is required" });
    // }
    let company = await Company.findOne({ name: companyName });
    if( company ){
      return res.status(400).json({ message: "Company already exists" });
    }

    company = await Company.create({
      name: companyName,
      description,//include description here
      userId: req.id,
    });
    return res.status(201).json({
      message: "Company created successfully",
      company,
      success: true,
    })

  } catch (error) {
    console.error("error in registerCompany: ",error);
  }
} ;

export const getAllCompanies = async ( req, res )=>{
  try{
    const userId = req.id;// loggedIn user id
    const companies = await Company.find({ userId });
    if( !companies ){
    return res.status(404).json({ 
      message: "No companies found",
     });
    }
    return res.status(200).json({
      message: "Companies found",
      companies,
      }); 
  }
  catch(error){
    console.error("error in getAllCompanies : ",error);
  }
}

//get company by id 
 export const getCompanyById = async ( req, res ) =>{
  try{
    const companyId = req.params.id;
    const company = await Company.findById (companyId);
    if( !company ){
      return res.status(404).json({
        message: "Company not found",
      });
    }
    return res.status(200).json({ company ,success: true });
  }
  catch(error){
    console.error("error in getCompanyById: ",error);
  }
 }


 //update company datail
 export const updateCompany = async ( req, res ) => {
  try{
    const { name, description, website, location } = req.body;
    const file = req.file;
    //cloudary
    const updateData = {name, description, website, location};
    const companyId = req.params.id;
    const company = await Company.findByIdAndUpdate(companyId, updateData, {
      new : true,
    });
  if( !company ){
    return res.status(404).json({
      message: "Company not found",
    });
  }
  return res.status(200).json({ message: "Company updated successfully" ,success: true });
  }
  catch(error){
    console.error("error in updateCompany: ",error);
  }
 }