//const mongoose = require("mongoose");
const Kyc=require("../../models/kyc");
const Promoter=require("../../models/promoters");

exports.uploadKyc=async (req,res)=>{
    const promoterId=req.body.promoterId;
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    const logDate = istDateTime.toISO({ includeOffset: true });
    console.log("sssggg","err.Error",req.body.promoterId,"iiii")
    try{
    
        const added_details=await Kyc.create({
            promoterId:promoterId,
            path: req.file? req.file.path:console.log("no kyc update"),
           logCreatedDate:logDate,
           kycUploadedDate:logDate
       })
       const details= await Promoter.findOneAndUpdate({_id:promoterId},{
        kyc:req.file? (req.file.path).trim():console.log("no kyc update"),
        kycUploadedDate:logDate,
        kycStatus:"pending"
       })
       console.log(added_details)
        if(added_details){
          res.status(200).json({
            data:added_details,
            message: "Your kyc details has been updated successfully",
          });
        }
        else{
          res.status(400).json({
     
            message: "please create again",
          });
        }
      
    }catch(err){
        console.log("sssggg",err)
        return res.status(400).json({ message: err.message ?? "Bad request" });
    }
};

exports.updateKyc=async (req,res)=>{
    const promoterId=req.body.promoterId;
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    const logDate = istDateTime.toISO({ includeOffset: true });
    try{
       
            const updated_details=await Kyc.findOneAndUpdate({
                promoterId:new mongoose.Types.ObjectId(promoterId)
            },
           
                 {
                   $set: {
                    path: req.file? req.file.path:console.log("no kyc update"),
                    kycUploadedDate:logDate
                   },
                 },
                 { new: true }
               );

               const details= await Promoter.findOneAndUpdate({_id:promoterId},{
                kyc:req.file? (req.file.path).trim():console.log("no kyc update"),
                logModifiedDate:logDate
               })
     
                if(updated_details){
                  res.status(200).json({
                    data:updated_details,
                    message: "Your contact details has been updated successfully",
                  });
                }else{
                  res.status(400).json({
     
                    message: "please update again",
                  });  
                }
              
            
     
      
}
catch(err){
    console.log(err)
    return res.status(400).json({ message: err.message ?? "Bad request" });
}
}

exports.getKycdetails= async (req,res)=>{
    const promoterId=req.body.promoterId;
    try{
   const kycDetails= await Kyc.findOne({promoterId:promoterId})
   if(kycDetails){
        res.status(200).json({
          data:kycDetails,
          message: "Your kycDetails has been fetched successfully",
        });
      
    }else{
        res.status(400).json({
   
          message: "no kyc uploaded",
        });
      }


    }
    catch(err){
        console.log(err)
        return res.status(400).json({ message: err.message ?? "Bad request" });
    }
}


exports.kycUpdateRequest= async (req,res)=>{

  const promoterId=req.userId;
    try{
   const kycDetails= await Promoter.findOneAndUpdate({
    _id:promoterId
  },
    {
      kycReverificationStatus:"requested"
    },
    {
      new:true
    })
   if(kycDetails){
        res.status(200).json({
          data:kycDetails,
          message: "Your kyc update has been requested successfully",
        });
      
    }else{
        res.status(400).json({
   
          message: "please try again",
        });
      }


    }
    catch(err){
        console.log(err)
        return res.status(400).json({ message: err.message ?? "Bad request" });
    }
}



const kycImgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./fileStorage/kyc_videos");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  const kycImgMaxSize = 30 * 1024 * 1024;


  const upload_kycVideo = multer({
    ignoreUnknown: true, 
    storage: kycImgStorage,
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/\.(mp4|mov|avi)$/)) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("This file extension is not allowed"));
      }
    },
    limits: { fileSize: kycImgMaxSize },
  });


  exports.handleUploadKyc = (req, res, next) => {
  upload_kycVideo.single("kyc")(req, res, err => {
      if (err instanceof multer.MulterError) {
        // Multer errors (e.g., file size exceeded)
        return res.status(400).json({message :  err.message });
      } else if (err) {
        // Other errors
        return res.status(500).json({ error: 'Internal server error' });
      }
      // If no errors, move to the next middleware
      next();
    });
  };