

const hiringData = async(req,res,next) =>{
// console.log(req.body)
try {
    const { jobTitle, jobDescription, jobSkills,  jobQualification, jobType, endDate} = req.body
    if(!jobTitle|| !jobDescription || !jobSkills ||  !jobQualification || !jobType || !endDate) {
        return res.status(400).json({
            success:false,
            message: "All feilds are required!",
        });
    }

    if (isNaN(Date.parse(endDate))) {
        return res.status(400).json({
            success: false,
            message: "Invalid endDate format. Please provide a valid date.",
        });
    }
    

next();
} catch (error) {
    console.error(error.name, ":" , error.message)
    return res.status(500).json({
        success: false,
        message: "An unexpected error occurred.",
    });
}

}

module.exports = hiringData;