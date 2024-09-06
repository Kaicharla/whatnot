const Sales=require("../../models/sales");
const Incentives=require("../../models/promoter_incentives");
const Promoter=require("../../models/promoters");
const TargetsAndBonuses=require("../../models/targetsAndBonus");
const Banner=require("../../models/banners");





exports.saleSubmit=async (req,res)=>{
    const promoterId=new mongoose.Types.ObjectId(req.userId);
  console.log(promoterId,"ooooooooooooooooooo");
  const saleId=req.body.saleId;
    const promoterName=req.body.promoterName;
    const brandName = req.body.brandName;
    const brandId=req.body.brandId;
    const categoryId=req.body.categoryId;
    const categoryName=req.body.categoryName;
    const productName=req.body.productName;
    const productId=req.body._id;
    const quantity=req.body.quantity;
    const price=req.body.price;
    const incentive=req.body.incentive;
    const serialNumber=req.body.serialNumber;
    const sellingPrice=req.body.sellingPrice;
    const priceMatch=req.body.priceMatch;
    const invoiceNumber=req.body.invoiceNumber;
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    const logDate = istDateTime.toISO({ includeOffset: true });
    const  monthTarget=(await Incentives.findOne({promoterId:promoterId},{monthTarget:1})).monthTarget
   // console.log(price,incentive,monthTarget)
   console.log(typeof serialNumber,"serial;,ll,",serialNumber)
    try{ 
   console.log( req.files.price_match_screenshot)

    if(saleId==""){
      const added_details=await Sales.create({
        promoterId: promoterId|| console.log("please provide promoter"),
        productName:productName||console.log("no promoters name"),
        productId: productId|| console.log("no promoters mail"),
        brandName: brandName || console.log("no promoters Phonenumber"),
        brandId:  brandId|| console.log("no promoters address"),
        categoryName:categoryName || console.log("no promoters date_of_birth"),
        categoryId:categoryId || console.log("no promoters age"),
        quantity:quantity || console.log("no promoters gender"),
        price:parseInt(price) || console.log("no promoters idNumber",parseInt(price)),
        incentive:parseInt(incentive) || console.log("no promoters storeName",parseInt(incentive)),
        serialNumber: (JSON.parse(serialNumber)).join(',')|| console.log("no promoters bankName"),
        priceMatch: priceMatch || console.log("no promoters branchName"),
        monthTarget:monthTarget,
        sellingPrice:req.body.sellingPrice,
        invoiceNumber:invoiceNumber,
        invoicePath: req.files.invoice? req.files.invoice[0].path:console.log("no invoice update"),
        priceMatchScreenshotPath: req.files.price_match_screenshot? req.files.price_match_screenshot[0].path:console.log("no priceMatchScreenshotPath update"),
        logCreatedDate:logDate,
        logModifiedDate:logDate
    })
    console.log(added_details)
     if(added_details){
  
      const incentives=await Incentives.findOneAndUpdate(
        {
          promoterId:promoterId   
        },
        { 
          $inc: { 
            pendingIncentives: incentive,
            pendingTargets:1
          } ,
        
        },
        { new: true }
        )
        console.log(incentives,"iiiiii")
      if (!incentives){
        const added_incentives=await Incentives.create({
          promoterId:promoterId,
          promoterName:promoterName,
          pendingIncentives:incentive,
          earnedIncentives:0,
          acheivedTargets:0,
          pendingTargets:1,
          totaltargets:0
        })
        console.log(added_incentives,"incet added")
      }
        console.log(incentives);
       res.status(200).json({
         data:added_details,
         message: "Your sale details has been updated successfully",
       });
     }
     else{
       res.status(400).json({
  
         message: "please create again",
       });
     }
    }else{
      const added_details=await Sales.findOneAndUpdate(
        {
          _id:saleId
        },
        {
        promoterId: promoterId|| console.log("please provide promoter"),
        productName:productName||console.log("no promoters name"),
        productId: productId|| console.log("no promoters mail"),
        brandName: brandName || console.log("no promoters Phonenumber"),
        brandId:  brandId|| console.log("no promoters address"),
        categoryName:categoryName || console.log("no promoters date_of_birth"),
        categoryId:categoryId || console.log("no promoters age"),
        quantity:quantity || console.log("no promoters gender"),
        price:parseInt(price) || console.log("no promoters idNumber",parseInt(price)),
        incentive:parseInt(incentive) || console.log("no promoters storeName",parseInt(incentive)),
        serialNumber: (JSON.parse(serialNumber)).join(',')|| console.log("no promoters bankName"),
        priceMatch: priceMatch || console.log("no promoters branchName"),
        monthTarget:monthTarget,
        sellingPrice:req.body.sellingPrice,
        invoiceNumber:invoiceNumber,
        status:"pending",
        reason:"",
        invoicePath: req.files.invoice? req.files.invoice[0].path:console.log("no invoice update"),
        priceMatchScreenshotPath: req.files.price_match_screenshot? req.files.price_match_screenshot[0].path:console.log("no priceMatchScreenshotPath update"),
        logCreatedDate:logDate,
        logModifiedDate:logDate
    })
    console.log(added_details)
     if(added_details){
  
      const incentives=await Incentives.findOneAndUpdate(
        {
          promoterId:promoterId   
        },
        { 
          $inc: { 
            pendingIncentives: incentive,
            pendingTargets:1
          } ,
        
        },
        { new: true }
        )
        console.log(incentives,"iiiiii")
      if (!incentives){
        const added_incentives=await Incentives.create({
          promoterId:promoterId,
          promoterName:promoterName,
          pendingIncentives:incentive,
          earnedIncentives:0,
          acheivedTargets:0,
          pendingTargets:1,
          totaltargets:0
        })
        console.log(added_incentives,"incet added")
      }
        console.log(incentives);
       res.status(200).json({
         data:added_details,
         message: "Your sale details has been updated successfully",
       });
     }
     else{
       res.status(400).json({
  
         message: "please create again",
       });
     }
    }
   
    }catch(err){
        console.log(err)
        console.log(err.message.includes("validation"),err.message);
    if(err.message.includes("validation")){
      return res.status(400).json({ message: "please enter all fields promptly"}); 
    }else{
      return res.status(400).json({ message: err.message ?? "Bad request" });
    }
     
    }
  };
  
  exports.getIncentivesAndTargets=async (req,res)=>{
    const promoterId=req.userId;
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    const logDate = istDateTime.toISO({ includeOffset: true });
    const currentDate = DateTime.local();
    console.log(promoterId,"idddddddddddddd")
    try{
       const getIncentives=await Incentives.findOne({
        promoterId : new mongoose.Types.ObjectId(promoterId)
       });
       const monthTarget=await TargetsAndBonuses.findOne({
        promoterId : new mongoose.Types.ObjectId(promoterId),
        month:istDateTime.month,
        year:istDateTime.year
       })
       const getMonthIncentives=await Sales.aggregate([
        {
        $match:{
        promoterId :new mongoose.Types.ObjectId(promoterId),
        status: "approved",
        logCreatedDate: { 
          $gte: currentDate.startOf('month').toISO({ includeOffset: true }),
          $lte: currentDate.endOf('month').toISO({ includeOffset: true })
        }
         }
       },
       {
        $group: {
          _id:"$promoterId",
          totalEarnedIncentives: { $sum: "$incentive" },
          totalSalesPrice:{ $sum: "$price" }// Sum earnedIncentives for all documents matching the filter
        }
    }
    ]);
    const rejectedSales=await Sales.aggregate([
      {
        $match:{
          promoterId:new mongoose.Types.ObjectId(promoterId),
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
    console.log(getMonthIncentives,"incccc")
       res.status(200).json({
        data:!getIncentives?0:getIncentives,
        monthIncentives:getMonthIncentives.length==0?0: parseInt(getMonthIncentives[0].totalEarnedIncentives),
        monthTarget:monthTarget?monthTarget.monthTarget:0,
        totalSalesPrice:getMonthIncentives.length==0?0:  parseInt(getMonthIncentives[0].totalSalesPrice) ,
         banners: await Banner.find({}),
         rejectedSales:rejectedSales,
         rejectedSalesCount:rejectedSales.length,
         message: "Your incentives has been fetched successfully",
      });
    }catch(err){
      return res.status(400).json({ message: err.message ?? "Bad request" });
    }
  
  };
  exports.getMonthIncentivesAndTargets= async (req,res)=>{
    
    const promoterId=req.userId;
    const month=req.body.month;
    const istDateTime = DateTime.now().setZone("Asia/Kolkata");
    const logDate = istDateTime.toISO({ includeOffset: true });
    const currentDate = DateTime.local();
  console.log(promoterId)
    try{
       const getIncentives=await Sales.aggregate([
        {
        $match:{
        promoterId :new mongoose.Types.ObjectId(promoterId),
        status: "approved",
        logCreatedDate: { 
            $gte: currentDate.startOf('month').toISO({ includeOffset: true }),
            $lte: currentDate.endOf('month').toISO({ includeOffset: true })
        }
         }
       },
       {
        $group: {
          _id:"$promoterId",
          totalEarnedIncentives: { $sum: "$incentive" },
          sales: { $sum: "$price" } // Sum earnedIncentives for all documents matching the filter
        }
    }
    ])

    
    // const getDetails=await Incentives.findOne({
    //   promoterId : new mongoose.Types.ObjectId(promoterId)
    //  })
     const promoter=await Promoter.findOne({
          _id:promoterId
     })
     console.log(promoter)//getIncentives,"ssss",getDetails,"lll");
    // getIncentives[0]?getIncentives[0].totaltargets=24:getIncentives[0]={totaltargets:24}
    // getIncentives[0]?getIncentives[0].achievedTargets =getdetails.achievedTargets:getIncentives[0]={achievedTargets:0}
    // getIncentives?? getIncentives[0]={achievedTargets:0}
    
   // console.log(getIncentives,"ssss");
      //  res.status(200).json({
      //   data:getIncentives,
      //   message: "Your incentives has been fetched successfully",
      // });
      res.status(200).json({
        promoterId: promoter? promoter._id : null,
        promoterName:promoter? promoter.name:null,
        totalEarnedIncentives:getIncentives[0]? getIncentives[0].totalEarnedIncentives:0,
        targetAcheived:getIncentives[0]? getIncentives.sales:0,
        targetAcheivedCount:getIncentives[0]? getIncentives.length:0,
       // data:[...getIncentives],
        message: "Your incentives has been fetched successfully",
      });
    }catch(err){
        console.log(err)
      return res.status(400).json({ message: err.message ?? "Bad request" });
    }

  }

exports.getUploadInvoices= async (req,res)=>{
const status=req.body.status;
const promoterId=req.userId;
let month=req.body.month;
let year=req.body.year;
const istDateTime = DateTime.now().setZone("Asia/Kolkata");
const logDate = istDateTime.toISO({ includeOffset: true });
let date = DateTime.local();

try{
 const getDetails=await Sales.aggregate([
    {
        $match:{
            promoterId:new mongoose.Types.ObjectId ( promoterId),
            status:status,
            
            // logCreatedDate: { 
            //     $gte: date.startOf('month').toISO({ includeOffset: true }),
            //     $lte: date.endOf('month').toISO({ includeOffset: true })
            // }

    }
},{
    $lookup: {
      from: "promoters",
        localField: "promoterId",
        foreignField: "_id",
        as: "promoter"
    }
  },
  {
    $unwind:"$promoter"

    
  },
  {
    $addFields: {
      promoterName: "$promoter.name",
      joinedDate: "$promoter.logCreatedDate",
      
    }},

    { 
      $sort: { saleDate: -1 } 
  },
      
    {
        $project: {
            promoter:0,
            saleDate:0
        }
    },
    


 ])

//  const getMonthIncentives=await Sales.aggregate([
//     {
//     $match:{
//     promoterId :new mongoose.Types.ObjectId(promoterId),
//     status: "approved",
//     logCreatedDate: { 
//         $gte: date.startOf('month').toISO({ includeOffset: true }),
//         $lte: date.endOf('month').toISO({ includeOffset: true })
//     }
//      }
//    },
//    {
//     $group: {
//       _id:"$promoterId",
//       totalEarnedIncentives: { $sum: "$incentive" } // Sum earnedIncentives for all documents matching the filter
//     }
// }
// ])

 console.log(getDetails,getDetails!=[])
 res.status(200).json({
    promoterId: getDetails[0]? getDetails[0].promoterId : null,
    promoterName:getDetails[0]? getDetails[0].promoterName:null,
    //totalEarnedIncentives:getMonthIncentives[0]? getMonthIncentives[0].totalEarnedIncentives:null,
    targetAcheived:getDetails[0]? getDetails.length:null,
    data:[...getDetails],
    message: "Your invoices has been fetched successfully",
  });
}catch(err){
    console.log(err)
  return res.status(400).json({ message: err.message ?? "Bad request" });
}
};





  const salesinvoivceAndScreenshotStorage =//(key)=>{
     //return
      multer.diskStorage({
    destination: (req, file, cb) => {
        const fieldname = file.fieldname;
    let uploadPath = '';

    // Set destination dynamically based on the fieldname
    switch (fieldname) {
      case 'invoice':
        uploadPath = 'invoices/';
        break;
      case 'price_match_screenshot':
        uploadPath = 'price_match_screenshots/';
        break;
      default:
        uploadPath = 'uploads/others/';
    }
      cb(null, "./fileStorage/"+uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
//}

  const promoterImgMaxSize = 30 * 1024 * 1024;
  const upload_sales =  multer({
            storage: salesinvoivceAndScreenshotStorage,
            fileFilter: (req, file, cb) => {
              if (file.originalname.match(/\.(png|PNG|jpg|pdf)$/)) {
                cb(null, true);
              } else {
                console.log(req.files)
                cb(null, false);
                return cb(new Error("This file extension is not allowed"));
              }
            },
            limits: { fileSize: promoterImgMaxSize },
          });
       
 

          
  exports.handleUploadInvoices = (req, res, next) => {
    upload_sales.fields([{
      name: "invoice",
      maxCount: 1,
    },
    {
      name: "price_match_screenshot",
      maxCount: 1,
    },])(req, res, err => {
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
