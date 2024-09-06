
const Promoter= require("../../models/promoters");
const Sale=require("../../models/sales");
const Query=require("../../models/queries");
const Incentive = require("../../models/promoter_incentives");
const TargetsAndBonuses=require("../../models/targetsAndBonus");

exports.getKycStatus= async (req,res)=>{
const promoter=req.body.promoterId
}


exports.updatePromoterDetails= async (req, res) => {

  
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    // console.log(istDateTime)      
     const logDate = istDateTime.toISO({ includeOffset: true });
     const promoter_id=req.body.promoter_id;
     try{
console.log(promoter_id,"id")
   if(promoter_id){ 
    console.log(1,2)
         const updated_details=await Promoter.findOneAndUpdate({_id:promoter_id},
        
              {
                $set: {
                  name: req.body.name ||console.log("no promoters name"),
                  email: req.body.email|| console.log("no promoters mail"),
                  phone: req.body.phone || console.log("no promoters Phonenumber"),
                  address: req.body.address || console.log("no promoters address"),
                  date_of_birth:req.body.date_of_birth || console.log("no promoters date_of_birth"),
                  age:req.body.age || console.log("no promoters age"),
                  gender:req.body.gender || console.log("no promoters gender"),
                  profilePic: req.file? req.file.path:console.log("no image update"),
                  idNumber:req.body.idNumber || console.log("no promoters idNumber"),
                  storeName:req.body.storeName || console.log("no promoters storeName"),
                  bankName:req.body.bankName || console.log("no promoters bankName"),
                  branchName:req.body.branchName || console.log("no promoters branchName"),
                  accountHolderName:req.body.accountHolderName || console.log("no promoters accountHolderName"),
                  accountNumber:req.body.accountNumber || console.log("no promoters accountNumber"),
                  IFSC:req.body.IFSC || console.log("no promoters IFSC"),
                  email:req.body.email || console.log("no promoters email"),
                  fcmToken:req.body.fcmToken,
                   logModifiedDate:logDate
                },
              },
              { new: true }
            );
  
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
           
         
   }else{
    console.log(2,req.file)
     const added_details=await Promoter.create({
        name: req.body.name ||console.log("no promoters name"),
        email: req.body.email|| console.log("no promoters mail"),
        phone: req.body.phone || console.log("no promoters Phonenumber"),
        address: req.body.address || console.log("no promoters address"),
        date_of_birth:req.body.date_of_birth || console.log("no promoters date_of_birth"),
        age:req.body.age || console.log("no promoters age"),
        gender:req.body.gender || console.log("no promoters gender"),
        profilePic:req.file? req.file.path:console.log("no image update"),
        idNumber:req.body.idNumber || console.log("no promoters idNumber"),
        storeName:req.body.storeName || console.log("no promoters storeName"),
        bankName:req.body.bankName || console.log("no promoters bankName"),
        branchName:req.body.branchName || console.log("no promoters branchName"),
        accountHolderName:req.body.accountHolderName || console.log("no promoters accountHolderName"),
        accountNumber:req.body.accountNumber || console.log("no promoters accountNumber"), 
        IFSC:req.body.IFSC || console.log("no promoters IFSC"),
        email:req.body.email || console.log("no promoters email"),
        fcmToken:req.body.fcmToken,
        logCreatedDate:logDate,
        logModifiedDate:logDate
    })
   // console.log(added_details)
     if(added_details){
       res.status(200).json({
         data:added_details,
         message: "Registered successfully",
       });
     }
     else{
       res.status(400).json({
  
         message: "please create again",
       }); 
     }
   }
}catch(err){
    console.log(err.message.includes("duplicate"),err.message);
    if(err.message.includes("duplicate")){
     const promoter= await Promoter.findOne({email:req.body.email})
     console.log(promoter,"ooooooo")
     if(promoter.kycStatus=="pending"){
      return res.status(401).json({ data:promoter,message: " your kyc status is in Pending "});
    }
    else if(promoter.kycStatus=="rejected"){
      return res.status(401).json({ data:promoter,message: " your kyc has been rejected "});
    }
    else if(promoter.kyc=="not uploaded"){
      return res.status(401).json({data:promoter, message: "please upload kyc "});
    }
    else{
      return res.status(400).json({data:promoter, message: "the user with same email already exists"});
    }
       
        
    }else{
      console.log(err)
    return res.status(400).json({ message: err.message ?? "Bad request" });
    }
}
  };


  exports.getPromoterById=async (req,res)=>{

   
    const promoter_id=req.body.promoter_id;
    //const email=req.body.email;
    console.log(promoter_id)

    try {
        const istDateTime = DateTime.now().setZone("Asia/Kolkata");
        const logDate = istDateTime.toISO({ includeOffset: true });
    
        const promoter = await Promoter.find({_id:promoter_id}).sort({logCreatedDate:-1});
        const sales=await Sale.aggregate([
          {
            $match:{
              promoterId:new mongoose.Types.ObjectId(promoter_id),
              status:"approved"
            }
          },
          {
            $lookup: {
              from: "brands",
                localField: "brandId",
                foreignField: "_id",
                as: "brand"
            }
          },
          {
            $unwind: "$brand" // Since $lookup returns an array, we unwind to destructure it
          },
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category"
            }
          },
          {
            $unwind: "$category" // Again, we unwind to destructure the product array
          },
          {
            $lookup:{
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "product"
            }
         },
         {
          $unwind:"$product"
         },
          {
            $addFields: {
              brandName: "$brand.name",
              categoryName: "$category.name",
              productName: "$product.name"
              
            }},
           
          {
            $project: {
             
              "brand": 0,
              "category": 0,
              
            }
          },
          {
            $sort:{
              saleDate:-1
            }
          }
        ]);
        const pendingSales=await Sale.aggregate([
          {
            $match:{
              promoterId:new mongoose.Types.ObjectId(promoter_id),
              status:"pending"
            }
          },
          {
            $lookup: {
              from: "brands",
                localField: "brandId",
                foreignField: "_id",
                as: "brand"
            }
          },
          {
            $unwind: "$brand" // Since $lookup returns an array, we unwind to destructure it
          },
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category"
            }
          },
          {
            $unwind: "$category" // Again, we unwind to destructure the product array
          },
          {
            $lookup:{
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "product"
            }
         },
         {
          $unwind:"$product"
         },
          {
            $addFields: {
              brandName: "$brand.name",
              categoryName: "$category.name",
              productName: "$product.name"
              
            }},
           
           
          {
            $project: {
             
              "brand": 0,
              "category": 0,
              
            }
          },
          {
            $sort:{
              saleDate:-1
            }
          }
        ]);
        const rejectedSales=await Sale.aggregate([
          {
            $match:{
              promoterId:new mongoose.Types.ObjectId(promoter_id),
              status:"rejected"
            }
          },
          {
            $lookup: {
              from: "brands",
                localField: "brandId",
                foreignField: "_id",
                as: "brand"
            }
          },
          {
            $unwind: "$brand" // Since $lookup returns an array, we unwind to destructure it
          },
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category"
            }
          },
          {
            $unwind: "$category" // Again, we unwind to destructure the product array
          },
          {
            $lookup:{
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "product"
            }
         },
         {
          $unwind:"$product"
         },
          {
            $addFields: {
              brandName: "$brand.name",
              categoryName: "$category.name",
              productName: "$product.name"
              
            }},
           
           
          {
            $project: {
             
              "brand": 0,
              "category": 0,
              
            }
          },
          {
            $sort:{
              saleDate:-1
            }
          }
        ]);
       const targetsAndAcheived= await Incentive.aggregate([
       { 
        $match:{
          promoterId:new mongoose.Types.ObjectId(promoter_id)
        }
      }
       ])

  //      const targetachieved=  await Sale.aggregate([
  //       {
  //         $match:{
  //           promoterId:new mongoose.Types.ObjectId(promoter_id),
  //           status:"approved"
  //         }
  //       },
  //      {
  //       $group: {
  //         _id:null,
  //         totalSale: { $sum: "$price" } // Sum earnedIncentives for all documents matching the filter
  //       }
  //   }
  // ])


  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  const totalenquiries = await Promise.all(
    months.map(async (month) => {
//       const year = new Date().getMonth() < month - 1 ? nextYear :
// currentYear;

      const startDate = DateTime.fromObject({ year: currentYear, month: parseInt(month)}).startOf('month').toISO({ includeOffset: true });
      const endDate =DateTime.fromObject({ year: currentYear, month: parseInt(month)}).endOf('month').toISO({ includeOffset: true })
        // new Date(`${year}-${month}-${new Date(year, month, 0).getDate()}`)
        //   .toISOString()
        //   .slice(0, 10) + "T23:59:59.999Z";
console.log(endDate,"DDD",startDate)
      let condition = {
        logCreatedDate: {
          $gte: startDate,
          $lt: endDate,
        },
        promoterId:new mongoose.Types.ObjectId(promoter_id),
        status:"approved"
      //  status: "true",
      };
console.log(condition);
// const sales = await Sale.countDocuments(condition);
// const promoters=await Promoter.countDocuments(condition);
const incentives=  await Sale.aggregate([
  {
  $match:condition
  //promoterId :new mongoose.Types.ObjectId(promoterId),
 },
 {
  $group: {
    _id:"$promoterId",
   // monthTarget:"$monthTarget",
    totalSales: { $sum: "$price" },
    monthTarget: { $first: '$monthTarget' }  // Sum earnedIncentives for all documents matching the filter
  },
  
},
{
  $project: {
      _id: 1,
      totalSales: 1,
      monthTarget: '$monthTarget' // Include the month target field
  }
}
])
   return {
    // sales:sales,
    // promoters:promoters,
    incentives: incentives
   }
    })
  );

 // let incentiveStats=null
  //const monthTarget=( await TargetsAndBonuses.findOne({promoterId:promoter_id}));
 // console.log(monthTarget,"fawrgaegaga")
  const incentiveStats= 
  await Promise.all (totalenquiries.map(async (month,index)=>{
    //const monthTarget=( await TargetsAndBonuses.find({promoterId:promoter_id,month:month,year:2024 }));
    const monthTarget=( await TargetsAndBonuses.findOne({promoterId:promoter_id,month:index+1,year:istDateTime.year }));

    console.log(monthTarget,"fawrgaegaga")

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    console.log(month.incentives[0]? month.incentives[0]:0,"pppppppppp");

    let obj={ 
      month:monthNames[index],
    sale:month.incentives[0]? month.incentives[0].totalSales:0,
    //month:month.month
    //monthTarget:month.incentives[0]? month.incentives[0].monthTarget:0,
    monthTarget: monthTarget? monthTarget.monthTarget:0,
    bonus: monthTarget? monthTarget.bonus:0
   }
    
    
    return obj
  //   { 
  //     month:monthNames[index],
  //   sale:month.incentives[0]? month.incentives[0].totalSales:0,
  //   //month:month.month
  //   //monthTarget:month.incentives[0]? month.incentives[0].monthTarget:0,
  //   monthTarget: monthTarget? monthTarget. monthTarget:0
  //  }
  
  } ) )
  console.log("stats",incentiveStats)

   


  // console.log(targetachieved,"aaaaaa")
        if (!promoter) {
            return res.status(200).json({
              message: "no promoter present",
              promoter: promoter ?? {},
              sales:sales??{},
              pendingSales,
             // targetachieved:targetachieved[0]
            });
          //}
        } else {
          return res.status(200).json({
            message: "Successfull ",
            promoter: promoter ?? {},
            sales:sales??{},
            pendingSales,
            rejectedSales,
           // targetsAndAcheived,
            targetachieved: incentiveStats,
            monthTarget:(await TargetsAndBonuses.findOne({promoterId:promoter_id},{monthTarget:1}))?(await TargetsAndBonuses.findOne({promoterId:promoter_id},{monthTarget:1})).monthTarget:0

          });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err.message ?? "Bad request" });
      }
}

exports.deletePromoters=async (req,res)=>{
    const promoter_id=req.body.promoter_id;
    try {
        const istDateTime = DateTime.now().setZone("Asia/Kolkata");
        const logDate = istDateTime.toISO({ includeOffset: true });
    
       // const brands = await Brand.find({});
       const deleted_promoter=await Promoter.deleteMany({ _id: { $in: promoter_id } })
    
        if (deleted_promoter.deletedCount<1) {
            return res.status(200).json({
              message: "please try again",
              deleted_promoter: deleted_promoter ?? {},
            });
          //}
        } else {
          return res.status(200).json({
            message: "Successfull ",
            deleted_promoter: deleted_promoter ?? {},
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err.message ?? "Bad request" });
      }

  };

  
  exports.getPromoters=async (req,res)=>{


    try {
        const istDateTime = DateTime.now().setZone("Asia/Kolkata");
        const logDate = istDateTime.toISO({ includeOffset: true });
    
        const promoters = await Promoter.find();
   // console.log(categories)
        if (!promoters) {
            return res.status(200).json({
              message: "no categories present",
              promoters: promoters ?? {},
            });
          //}
        } else {
          return res.status(200).json({
            message: "Successfull ",
            promoters: promoters ?? {},
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err.message ?? "Bad request" });
      }
};




// exports.saleSubmit=async (req,res)=>{
//   const promoterId=req.body.promoterId;
//   const promoterName=req.body.promoterName;
//   const brandName = req.body.brandName;
//   const brandId=req.body.brandId;
//   const categoryId=req.body.categoryId;
//   const categoryName=req.body.categoryName;
//   const productName=req.body.productName;
//   const productId=req.body.productId;
//   const quantity=req.body.quantity;
//   const price=req.body.price;
//   const incentive=req.body.incentive;
//   const serialNumber=req.body.serialNumber;
//   const priceMatch=req.body.priceMatch;
//   const istDateTime = DateTime.now().setZone("Asia/Kolkata");
//   const logDate = istDateTime.toISO({ includeOffset: true });
//   try{
//     const added_details=await Sales.create({
//       promoterId: req.body.promoterId|| console.log("please provide promoter"),
//       productName:productName||console.log("no promoters name"),
//       productId: productId|| console.log("no promoters mail"),
//       brandName: brandName || console.log("no promoters Phonenumber"),
//       brandId:  brandId|| console.log("no promoters address"),
//       categoryName:categoryName || console.log("no promoters date_of_birth"),
//       categoryId:categoryId || console.log("no promoters age"),
//       quantity:quantity || console.log("no promoters gender"),
//       price:price || console.log("no promoters idNumber"),
//       incentive:incentive || console.log("no promoters storeName"),
//       serialNumber: serialNumber|| console.log("no promoters bankName"),
//       priceMatch: priceMatch || console.log("no promoters branchName"),
//       // profilePic:req.file.path? req.file.path:console.log("no image update"),
//       // profilePic:req.file.path? req.file.path:console.log("no image update"),
//       logCreatedDate:logDate
//   })
//   console.log(added_details)
//    if(added_details){

//     const incentives=await Incentives.findOneAndUpdate(
//       {
//         promoterId:promoterId
//       },
//       { 
//         $inc: { 
//           pendingIncentives: incentive,
//           pendingTargets:1
//         } 
//       },
//       { new: true }
//       )
//       console.log(incentives,"iiiiii")
//     if (!incentives){
//       const added_incentives=await Incentives.create({
//         promoterId:promoterId,
//         promoterName:promoterName,
//         pendingIncentives:incentive,
//         earnedIncentives:0,
//         acheivedTargets:0,
//         pendingTargets:1,
//         totaltargets:0
//       })
//       console.log(added_incentives,"incet added")
//     }
//       console.log(incentives);
//      res.status(200).json({
//        data:added_details,
//        message: "Your sale details has been updated successfully",
//      });
//    }
//    else{
//      res.status(400).json({

//        message: "please create again",
//      });
//    }
 
//   }catch(err){
//     return res.status(400).json({ message: err.message ?? "Bad request" });
//   }
// };

exports.getIncentivesAndTargets=async (req,res)=>{
  const promoterId=req.userId;
  console.log(promoterId,"iiiii")
  try{
     const getIncentives=await Incentives.findOne({
      promoterId : new mongoose.Types.ObjectId(promoterId)
     })
     res.status(200).json({
      data:getIncentives,
      message: "Your incentives has been fetched successfully",
    });
  }catch(err){
    return res.status(400).json({ message: err.message ?? "Bad request" });
  }

};
exports.getMonthIncentivesAndTargets= async (req,res)=>{

};

exports.sendQuery= async (req,res)=>{
  const promoterId=req.userId;
  const text=req.body.text;
  const istDateTime = DateTime.now().setZone("Asia/Kolkata");
  // console.log(istDateTime)      
   const logDate = istDateTime.toISO({ includeOffset: true });
  try{
    const promoter=await Promoter.findOne({_id:promoterId});
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    let mailOptions = {
      from: process.env.EMAIL_FROM,
      to: `supportwhatnot@gmail.com`,
      cc:promoter.email,
      
      subject: "whatNot",
      html: `<html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Our Store!</title>
      </head>
      <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333;">User Query!</h2>
              <p>The User ${promoter.name } has shared a query with you :</p>
              <ul>
                  <strong> ${text} </strong> 
              </ul>
              <p>Please resolve his query and help him  manage  sales.  Reach out to email : ${promoter.email} anytime.</p>
              <p>Thank you .</p>
              
             
              <p>Warm regards,<br>
                 What Not
              </p>
          </div>
      </body>
      </html>`
     
    }
    transporter.sendMail(mailOptions,async  function (error, success) {
      if (error) {
        console.log(error);
        res.status(400).json({
          message:"Bad Request"})
      }
      if (success) {
        res.status(200).json({
          message:"email sent successfully"})
        console.log("email sent successfully");
        const query= await Query.create({
            promoterId:promoter._id,
            ccMail:promoter.email,
            message:text,
            logCreatedDate:logDate

        });
        console.log(query,promoter)
      }
    });
  }
  catch(err){
    res.status(400).json({
      message:"Bad Request"})
  }
}


  const promoterImgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./fileStorage/promoters_images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  const promoterImgMaxSize = 30 * 1024 * 1024;
  const upload_productImg = multer({
    storage: promoterImgStorage,
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/\.(png|PNG|jpg|pdf)$/)) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("This file extension is not allowed"));
      }
    },
    limits: { fileSize: promoterImgMaxSize },
  });


  
  exports.handleUpload = (req, res, next) => {
    upload_productImg.single("promoterImg")(req, res, err => {
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